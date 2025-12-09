import {
  Box, Avatar, Typography, TextField, Button, List, ListItem, ListItemAvatar, ListItemText,
  InputAdornment, IconButton, MenuItem, Menu
} from '@mui/material';
import Videocam from '@mui/icons-material/Videocam';
import CallIcon from '@mui/icons-material/Call';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { useCallback, useEffect, useRef, useState } from 'react';
import ChatIcon from '@mui/icons-material/Chat';
import { useDispatch, useSelector } from 'react-redux';
import { io, Socket } from 'socket.io-client'
import SearchIcon from '@mui/icons-material/Search';
import { AttachFile, CameraAlt, InsertPhoto, InsertDriveFile, EmojiEmotionsRounded } from '@mui/icons-material';
import EmojiPicker from 'emoji-picker-react';

import { fetchConversation, fetchConversationUserList, fetchMessagesbyConvId } from 'src/redux/actions/message.action';
import { AppDispatch, RootState } from 'src/redux/store';

import axios from '../../redux/helper/axios'
import { HeadingCommon } from '../multiple-responsive-heading/heading';
import { SelectedUser, ConversationUser, UnreadCounts, MessagesState } from './utills';
import { MessageBubble } from './message-bubble';
import { FullScreenAvatar } from './full-screen-avatar';

export function ChatPanel() {
  const [selectedOption, setSelectedOption] = useState<SelectedUser>();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state?.auth);
  const [convUser, setConvUser] = useState<ConversationUser | null>(null);
  const { conv, userList } = useSelector((state: RootState) => state.allMessages);
  const [unreadCounts, setUnreadCounts] = useState<UnreadCounts>({});
  const [messages, setMessages] = useState<MessagesState>({
    messages: []
  });
  const individualMsgList = useSelector((state: RootState) => state.allMessages.messages);
  const [showPicker, setShowPicker] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [online, setOnline] = useState([]);
  const [message, setMessage] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const documentInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  // Inside your ChatPanel component, add state for the avatar modal
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState('');

  const handleClick = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    dispatch(fetchConversation());
    dispatch(fetchConversationUserList());

  }, [dispatch, messages]);

  // Filter users based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredUsers(conv || []);
      setSearchResults([]);
      return;
    }

    // Filter existing conversations
    const filteredConv = conv?.filter((item: any) =>
      item.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Filter potential new users from userList
    const filteredNewUsers = userList?.filter((item: any) => {
      const isNotInConv = !conv?.some((convItem: any) =>
        convItem.user._id === item._id ||
        convItem.user.userId === item._id
      );
      return (
        isNotInConv &&
        (item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.email.toLowerCase().includes(searchQuery.toLowerCase())
        ))
    });

    setFilteredUsers(filteredConv || []);
    setSearchResults(filteredNewUsers || []);
  }, [searchQuery, conv, userList]);

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.emit('addUser', user?._id);

      const handleGetMessage = (data: {
        senderId: string;
        message: string;
        conversationId: string;
        receiverId: string;
        user: {
          _id: string;
          name: string;
          email: string;
          profile: string;
        };
        files: any,
        type: string;
        updatedAt?: string;
      }) => {
        // Don't add the message if it's from the current user
        // The optimistic update already handles this case
        if (data.senderId === user?._id) {
          return;
        }

        if (data.conversationId === messages.conversationId) {
          // If message is for current conversation, add to messages
          setMessages(prev => ({
            ...prev,
            messages: [
              ...prev.messages,
              {
                user: data.user,
                files: data.files,
                message: data.message,
                updatedAt: data.updatedAt,
                type: data.type,
              }
            ]
          }));
        } else {
          // If message is for another conversation, increment unread count
          setUnreadCounts(prev => ({
            ...prev,
            [data.conversationId]: (prev[data.conversationId] || 0) + 1
          }));
        }
      };

      socket.on('getMessage', handleGetMessage);
      socket.on('getUsers', (users) => setOnline(users));

      return () => {
        socket.off('getMessage', handleGetMessage);
        socket.off('getUsers');
      };
    }
    return undefined; // Explicit return to satisfy ESLint
  }, [socket, messages?.conversationId, user?._id]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const receiverId = typeof messages?.receiver === 'string'
      ? messages?.receiver
      : messages?.receiver?.receiverId;

    if (!receiverId && messages?.conversationId === 'new') {
      return;
    }

    const tempMessageId = Date.now().toString();
    const messageData = {
      conversationId: messages?.conversationId,
      senderId: user?._id,
      message,
      receiverId,
      type: "text"
    };

    // Optimistic update
    setMessages(prev => ({
      ...prev,
      messages: [
        ...prev.messages,
        {
          user: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            profile: user?.profile
          },
          message,
          updatedAt: new Date().toISOString(),
          type: "text",
          tempId: tempMessageId
        }
      ]
    }));

    setMessage('');

    try {
      // Emit socket event first
      socket?.emit('sendMessage', {
        ...messageData,
        user: {
          _id: user?._id,
          name: user?.name,
          email: user?.email,
          profile: user?.profile
        },
        updatedAt: new Date().toISOString()
      });

      // Then send to server
      const response = await axios.post(`/conv/message`, messageData);

      // If this was a new conversation, update the conversation ID
      if (messages?.conversationId === 'new' && response.data.conversationId) {
        // Update the selected conversation with the new ID
        setSelectedOption((prev: any) => ({
          ...prev,
          conversationId: response.data.conversationId
        }));

        // Update messages state with the new conversation ID
        setMessages(prev => ({
          ...prev,
          conversationId: response.data.conversationId
        }));

        // Refresh conversations list
        dispatch(fetchConversation());
      }
    } catch (error) {
      // Rollback optimistic update on error
      setMessages(prev => ({
        ...prev,
        messages: prev.messages.filter(msg => msg.tempId !== tempMessageId)
      }));
    }
  };

  useEffect(() => {
    setMessages(individualMsgList)
  }, [individualMsgList])

  const fetchMessages = useCallback(async (conversationId: any, receiver: any) => {
    dispatch(fetchMessagesbyConvId(conversationId, receiver, user?._id));
  }, [dispatch, user?._id]);

  const fetchMsgData = useCallback((convId: string | undefined, userData: any) => {
    fetchMessages(convId, userData);
    if (convId) {
      setUnreadCounts(prev => ({
        ...prev,
        [convId]: 0
      }));
    }

    const covData = {
      convId: convId || "new",
      userData,
      _id: user?._id
    };
  }, [fetchMessages, user?._id]);

  // Add this useEffect hook near the top of the ChatPanel component
  useEffect(() => {
    // Check if we have a provider from the Chat Now button click
    const storedProvider = sessionStorage.getItem('currentChatProvider');
    if (storedProvider) {
      try {
        const provider = JSON.parse(storedProvider);
        // Find if this provider already has a conversation
        const existingConv = conv?.find((c: any) =>
          c.user.receiverId === provider._id
        );
        if (existingConv) {
          setSelectedOption(existingConv);
          fetchMessages(existingConv.conversationId, existingConv.user);
        } else {
          // Create a new conversation item for this provider
          const newConvItem = {
            user: {
              _id: provider._id,
              name: provider.name,
              email: provider.email || '',
              avatar: provider.avatar?.url || '',
              receiverId: provider._id
            },
            conversationId: 'new'
          };
          setSelectedOption(newConvItem);
          fetchMessages('new', provider._id);
        }

        // Clear the stored provider after using it
        sessionStorage.removeItem('currentChatProvider');
      } catch (error) {
        sessionStorage.removeItem('currentChatProvider');
      }
    }
  }, [conv, fetchMessages, fetchMsgData, filteredUsers]); // Added fetchMessages to dependencies

  useEffect(() => {
    const fetchConversations = async () => {
      await axios.get(`/conv/conversations?userId=${convUser?.organizerId?._id || selectedOption}`);
    };
    fetchConversations();
  }, [messages, convUser?.organizerId?._id, selectedOption]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Trigger file input click
  const triggerFileInput = (type: 'image' | 'document' | 'video') => {
    if (type === 'image' && imageInputRef.current) {
      imageInputRef.current.click();
    } else if (type === 'document' && documentInputRef.current) {
      documentInputRef.current.click();
    } else if (type === 'video' && videoInputRef.current) {
      videoInputRef.current.click();
    }
  };

  // Update the handleUpload function
  const handleUpload = async (file: File, type: 'image' | 'document' | 'video') => {

    if (!selectedOption) {
      alert('Please select a conversation first');
      return;
    }

    // Validate file type
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    const validDocumentTypes = ['application/pdf', 'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    const validVideoTypes = ['video/mp4', 'video/webm', 'video/quicktime'];

    if (type === 'image' && !validImageTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, GIF, WEBP)');
      return;
    }

    if (type === 'document' && !validDocumentTypes.includes(file.type)) {
      alert('Please select a valid document file (PDF, DOC, DOCX, TXT)');
      return;
    }

    if (type === 'video' && !validVideoTypes.includes(file.type)) {
      alert('Please select a valid video file (MP4, WEBM, MOV)');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // Upload file to backend
      const result = await axios.post(`/conv/upload-file`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (result.data) {
        const receiverId = typeof messages?.receiver === 'string'
          ? messages?.receiver
          : messages?.receiver?.receiverId;

        const messageData = {
          conversationId: messages?.conversationId,
          senderId: user?._id,
          message, // Include text message if any
          files: [{
            public_id: result.data.public_id,
            url: result.data.secure_url,
            fileType: type,
            fileName: file.name,
            fileSize: file.size
          }],
          receiverId,
          type: "file"
        };

        // Optimistic update
        const tempMessageId = Date.now().toString();
        setMessages(prev => ({
          ...prev,
          messages: [
            ...prev.messages,
            {
              user: {
                _id: user?._id,
                name: user?.name,
                email: user?.email,
                profile: user?.profile
              },
              files: messageData.files,
              message: messageData.message,
              updatedAt: new Date().toISOString(),
              type: "file",
              tempId: tempMessageId
            }
          ]
        }));

        setMessage(''); // Clear text message

        // Emit socket event
        socket?.emit('sendMessage', {
          ...messageData,
          user: {
            _id: user?._id,
            name: user?.name,
            email: user?.email,
            profile: user?.profile
          },
          updatedAt: new Date().toISOString()
        });

        // Send to server
        await axios.post(`/conv/message`, messageData);
      }
    } catch (error) {
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Update the file input change handler
  const handleImageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleUpload(files[0], 'image');
    e.target.value = '';
  };

  const handleDocumentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleUpload(files[0], 'document');
    e.target.value = '';
  };

  const handleVideoInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    handleUpload(files[0], 'video');
    e.target.value = '';
  };
  useEffect(() => {
    // When conversations are loaded, check if we need to update the selected conversation
    if (selectedOption?.conversationId === 'new' && conv) {
      const newConv = conv.find((c: any) =>
        c.user.receiverId === selectedOption.user.receiverId ||
        c.user._id === selectedOption.user.receiverId
      );

      if (newConv) {
        setSelectedOption(newConv);
        fetchMessages(newConv.conversationId, newConv.user);
      }
    }
  }, [conv, selectedOption, fetchMessages]);

  // Add the handler functions
  const handleAvatarClick = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
    setAvatarModalOpen(true);
  };

  const handleAvatarClose = () => {
    setAvatarModalOpen(false);
    setSelectedAvatar('');
  };

  return (
    <>
      {(user?.role === "organizer" || user?.role === "provider") && (
        <Box
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '5px 24px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            position: 'relative',
            overflow: 'hidden',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: 'linear-gradient(90deg, #ffd700, #ffed4e)'
            }
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 0.5 }}>
            💰 Admin Fee Notice
          </Typography>
          <Typography variant="body1" sx={{ opacity: 0.95 }} fontSize={11}>
            <strong>10%</strong> of every project revenue is allocated to platform administration
          </Typography>
        </Box>
      )}
      <Box sx={{
        display: 'flex',
        height: `calc(100vh - ${user?.role === "organizer" || user?.role === "provider" ? '155px' : '105px'})`, // Adjust based on your layout
        border: '1px solid #e0e0e0',
        borderRadius: 3,
        my: 1
      }}>
        {/* Users List */}
        <Box sx={{
          width: { xs: '100%', sm: 2700, md: 300 }, // Responsive width
          borderRight: { xs: 'none', sm: '1px solid #e0e0e0' }, // Hide border on mobile
          borderLeft: '1px solid #e0e0e0', // Hide border on mobile
          overflowY: 'auto',
          height: { xs: 'auto', sm: 'calc(100vh - 105px)', md: `calc(100vh - ${user?.role === "organizer" || user?.role === "provider" ? '155px' : '105px'})` }, // Full height on desktop
          borderRadius: 2,
          position: { xs: 'absolute', sm: 'relative' }, // Absolute positioning on mobile
          zIndex: { xs: 1000, sm: 'auto' }, // Ensure it's above other content on mobile
          backgroundColor: 'background.paper',
          display: { xs: selectedOption ? 'none' : 'block', sm: 'block' }, // Hide on mobile when chat is open
        }}>
          <HeadingCommon
            variant="h6"
            color="#000080"
            baseSize="18px"
            title="Tick-m Events"
            css={{
              p: 2,
              borderBottom: '1px solid #e0e0e0',
              position: { xs: 'sticky', sm: 'static' }, // Sticky on mobile
              top: 0,
              backgroundColor: 'background.paper',
              zIndex: 1
            }}
          />

          {/* Search Box */}
          <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search users..."
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
              InputProps={{
                startAdornment: <SearchIcon sx={{ color: 'action.active', mr: 1 }} />
              }}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '20px',
                }
              }}
            />
          </Box>

          {/* Search Results for New Users */}
          {searchQuery && searchResults.length > 0 && (
            <Box sx={{ p: 1, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="subtitle2" sx={{ px: 1, py: 0.5, color: 'text.secondary' }}>
                New Conversations
              </Typography>
              {searchResults.map((row, index) => (
                <ListItem
                  key={row._id || index}
                  button
                  onClick={() => {
                    // First check if this user already has a conversation
                    const existingConv = conv?.find((c: any) =>
                      c.user.receiverId === row._id ||
                      c.user._id === row._id
                    );

                    if (existingConv) {
                      setSelectedOption(existingConv);
                      fetchMessages(existingConv.conversationId, existingConv.user);
                    } else {
                      const item = {
                        user: {
                          receiverId: row._id,
                          name: row.name,
                          email: row.email,
                          avatar: row.avatar.url
                        },
                        conversationId: 'new'
                      };
                      setSelectedOption(item);
                      fetchMessages('new', row._id);
                    }
                  }}
                  sx={{
                    '&:hover': {
                      backgroundColor: '#f5f5f5'
                    }
                  }}
                >
                  <ListItemAvatar>
                    <Avatar src={row.avatar.url} alt={row.name} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={row.name}
                    secondary={row.email}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                  <ChatIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                </ListItem>
              ))}
            </Box>
          )}

          {filteredUsers?.length > 0 ? (
            <List sx={{
              flex: 1,
              pt: { xs: 0, sm: 0 } // Adjust padding
            }}>
              {filteredUsers?.map((item: any, index: any) => (
                <ListItem
                  key={item._id || index}
                  button
                  onClick={() => {
                    setSelectedOption(item)
                    fetchMsgData(item.conversationId, item.user)
                  }}
                  sx={{
                    '&.Mui-selected': {
                      backgroundColor: '#f5f5f5'
                    },
                    backgroundColor: selectedOption?.conversationId === item.conversationId
                      ? item.user.isOrganizer
                        ? '#e3f2fd'
                        : '#f5f5f5'
                      : 'transparent',
                    '&:hover': {
                      backgroundColor: item.user.isOrganizer
                        ? '#e3f2fd'
                        : '#fafafa'
                    },
                    px: { xs: 1, sm: 2 }, // Responsive padding
                    py: { xs: 1, sm: 1.5 } // Responsive padding
                  }}
                  selected={selectedOption?.conversationId === item.conversationId}
                >
                  <ListItemAvatar sx={{ minWidth: { xs: 40, sm: 56 } }}>
                    <Avatar
                      src={item.user.avatar}
                      alt={item.user.name}
                      sx={{ width: { xs: 36, sm: 40 }, height: { xs: 36, sm: 40 } }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body1" sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
                        {item.user.name}
                      </Typography>
                    }
                    secondary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: { xs: 120, sm: 180 },
                            fontSize: { xs: '0.75rem', sm: '0.875rem' },
                            filter: 'blur(4px)', 
                            userSelect:'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                            // '&:hover': {
                            //   filter: 'blur(0px)', // Remove blur on hover to reveal
                            //   transition: 'filter 0.3s ease'
                            // }
                          }}
                        >
                          {item.user.email}
                        </Typography>
                      </Box>
                    }
                    secondaryTypographyProps={{ noWrap: true }}
                    sx={{ my: 0 }} // Remove default margin
                  />
                  <Box sx={{ ml: { xs: 0.5, sm: 1 } }}>
                    {unreadCounts[item.conversationId] > 0 && (
                      <Box sx={{
                        backgroundColor: '#032D4F',
                        color: 'white',
                        borderRadius: '50%',
                        width: { xs: 18, sm: 20 },
                        height: { xs: 18, sm: 20 },
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: { xs: 10, sm: 12 }
                      }}>
                        {unreadCounts[item.conversationId]}
                      </Box>
                    )}
                  </Box>
                </ListItem>
              ))}
            </List>
          ) : (
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: { xs: 2, sm: 4 },
              height: 'calc(100% - 64px)' // Account for header height
            }}>
              <ChatIcon sx={{
                fontSize: { xs: 48, sm: 60 },
                color: '#bdbdbd',
                mb: 2
              }} />
              <HeadingCommon
                variant="h6"
                mb={1}
                baseSize={{ xs: '16px', sm: '18px' }}
                title="No conversations found"
              />
              <HeadingCommon
                variant="body2"
                color="text.secondary"
                baseSize={{ xs: '14px', sm: '16px' }}
                title="You don't have any active conversations"
              />
            </Box>
          )}
        </Box>

        {/* Conversation */}
        {
          selectedOption ? (
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column'
            }}>
              {/* Chat header */}
              <Box sx={{
                p: 1.2,
                borderBottom: '1px solid #e0e0e0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between', // Added to push icons to the end
                gap: 2,
                backgroundColor: '#f5f5f5'
              }}>
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    src={selectedOption?.user?.avatar}
                    alt={selectedOption?.user?.name}
                    onClick={() => handleAvatarClick(selectedOption?.user?.avatar)}
                    sx={{
                      cursor: 'pointer',
                      transition: 'transform 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.1)'
                      }
                    }}
                  />
                  <Typography variant="h6">{selectedOption?.user?.name}</Typography>
                </Box>

                {/* // Add the FullScreenAvatar component at the end of your JSX */}
                <FullScreenAvatar
                  src={selectedAvatar}
                  alt={selectedOption?.user?.name || 'User avatar'}
                  open={avatarModalOpen}
                  onClose={handleAvatarClose}
                />

                {/* Call and Video Call Icons */}
                {/* <Box display="flex" gap={1}>
                <IconButton color="primary" aria-label="call">
                  <CallIcon />
                </IconButton>
                <IconButton color="primary" aria-label="video call">
                  <VideoCallIcon />
                </IconButton>
              </Box> */}
              </Box>
              {/* Messages */}
              <Box
                flex={1}
                p={2}
                sx={{
                  overflowY: 'auto',
                  backgroundColor: '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                ref={(el: any) => {
                  if (el) {
                    el.scrollTop = el.scrollHeight;
                  }
                }}
              >
                {messages?.messages?.length > 0 ? (
                  messages.messages.map((msg: any, index: any) => (
                    <>
                      <MessageBubble
                        key={msg.msgId || index}
                        message={msg}
                        isCurrentUser={msg.user._id === user?._id}
                      />
                    </>

                  ))
                ) : (
                  <Typography sx={{ textAlign: 'center', mt: 2 }}>No Messages</Typography>
                )}
              </Box>

              {/* Message input */}
              <Box sx={{
                p: 2,
                borderTop: '1px solid #e0e0e0',
                display: 'flex',
                gap: 1
              }}>

                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Type your message..."
                  size="small"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px',
                      paddingRight: '40px', // Make space for icons
                    }
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position='start'>
                        <IconButton onClick={() => setShowPicker(!showPicker)}>
                          <EmojiEmotionsRounded fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handleClick}
                          aria-controls={open ? 'attachment-menu' : undefined}
                          aria-haspopup="true"
                          aria-expanded={open ? 'true' : undefined}
                        >
                          <AttachFile fontSize="small" />
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
                {showPicker && (
                  <Box sx={{ position: "absolute", top: '117px' }}>
                    <EmojiPicker

                      onEmojiClick={emojiObject => {
                        setMessage(prev => prev + emojiObject.emoji);
                        setShowPicker(!showPicker)
                      }}
                      width={300}
                      height={400}
                    />
                  </Box>
                )}
                {/* Hidden file inputs */}
                {/* Hidden file inputs for each type */}
                <input
                  type="file"
                  ref={imageInputRef}
                  onChange={handleImageInputChange}
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  style={{ display: 'none' }}
                />
                <input
                  type="file"
                  ref={documentInputRef}
                  onChange={handleDocumentInputChange}
                  accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
                  style={{ display: 'none' }}
                />
                <input
                  type="file"
                  ref={videoInputRef}
                  onChange={handleVideoInputChange}
                  accept="video/mp4,video/webm,video/quicktime"
                  style={{ display: 'none' }}
                />

                {/* Attachment menu */}
                <Menu
                  id="attachment-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'attachment-button',
                  }}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'right',
                  }}
                >
                  <MenuItem onClick={() => {
                    triggerFileInput('image');
                    handleClose();
                  }}>
                    <InsertPhoto fontSize="small" sx={{ mr: 1 }} />
                    Image
                  </MenuItem>
                  <MenuItem onClick={() => {
                    triggerFileInput('document');
                    handleClose();
                  }}>
                    <InsertDriveFile fontSize="small" sx={{ mr: 1 }} />
                    Document
                  </MenuItem>
                  <MenuItem onClick={() => {
                    triggerFileInput('video');
                    handleClose();
                  }}>
                    <Videocam fontSize="small" sx={{ mr: 1 }} />
                    Video
                  </MenuItem>
                </Menu>

                <Button
                  onClick={sendMessage}
                  variant="contained"
                  disabled={!message}
                  sx={{
                    backgroundColor: "#032D4F",
                    borderRadius: '20px',
                    minWidth: 'auto',
                    px: 3,
                    "&:hover": {
                      backgroundColor: "#021f37",
                    },
                  }}
                >
                  Send
                </Button>
              </Box>
            </Box>
          ) : (
            <Box sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              p: 4,
              backgroundColor: '#fafafa'
            }}>
              <ChatIcon sx={{
                fontSize: 60,
                color: '#bdbdbd',
                mb: 2
              }} />
              <Typography variant="h6" sx={{ mb: 1 }}>
                No conversation selected
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Please select a user from the left panel to start chatting
              </Typography>
            </Box>
          )
        }

      </Box>
    </>

  );
};


