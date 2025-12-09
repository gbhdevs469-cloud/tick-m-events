import {
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Paper, CircularProgress,
  Avatar,
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { AttachFile, Call, Close, VideoCall } from "@mui/icons-material";
import { useState, useEffect, useRef } from "react";
import { RootState } from "src/redux/store";
import { useSelector } from "react-redux";

import { formatTimeToAMPM } from "src/hooks/formate-time";

import axios from '../../redux/helper/axios'

interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: string;
}

export function ChatBox({ handleCloseModal, conv }: any) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUser = useSelector((state: RootState) => state.auth.user?._id);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Fetch messages from API


  // Initial fetch and refresh every 5 seconds
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const response = await axios.get(`/conv?eventId=${conv?.eventId?._id}&serviceRequestId=${conv?.serviceRequestId?._id}`);
        console.log('response', response);

        setMessages(response.data.messages);
      } catch (err) {
        console.log(err, 'Failed to fetch messages');
      } finally {
        setIsLoading(false);
      }
    };
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [conv]);

  // Send new message
  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    try {
      setIsSending(true);
      const response = await axios.post('/conv', {
        message: newMessage,
        eventId: conv?.eventId?._id,
        serviceRequestId: conv?.serviceRequestId?._id,
        receiverId: conv?.organizerId?._id
      });

      setMessages(prev => [...prev, response.data]);
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
      console.error(err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Paper
      elevation={6}
      sx={{
        mt: 4,
        borderRadius: 3,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        height: { xs: "80vh", sm: "85vh", md: "90vh" },
        maxHeight: "800px",
        width: { xs: "95vw", sm: "80vw", md: "70vw" },
        maxWidth: "900px",
      }}
    >
      {/* Top bar with improved styling */}
      <Box
        sx={{
          backgroundColor: "#0B2E4C",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
          borderBottom: "2px solid #1F8FCD",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Avatar
            src={conv?.organizerId?.avatar?.url}
            sx={{ width: 40, height: 40, borderRadius: 3 }}
            variant="square"
          />
          <Box>
            <Typography fontWeight="bold" variant="h6">{conv.organizerId.name}</Typography>
            <Typography fontSize={12} color="#aaa">Online</Typography>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            p: 1,
            borderRadius: "16px",
            alignItems: "center",
          }}
        >
          {[<VideoCall />, <Call />, <Close />].map((icon, idx) => (
            <IconButton
              key={idx}
              onClick={idx === 2 ? handleCloseModal : undefined}
              sx={{
                backgroundColor: idx === 2 ? "#ff4444" : "white",
                color: idx === 2 ? "white" : "#0B2E4C",
                borderRadius: "12px",
                width: 40,
                height: 40,
                "&:hover": {
                  backgroundColor: idx === 2 ? "#ff0000" : "#f0f0f0",
                },
              }}
            >
              {icon}
            </IconButton>
          ))}
        </Box>
      </Box>

      {/* Action buttons with better spacing */}
      <Box
        sx={{
          display: "flex",
          p: 1,
          backgroundColor: "#f8f8f8",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Button
          fullWidth
          variant="outlined"
          sx={{
            mr: 1,
            py: 1.5,
            borderRadius: 1,
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '16px',
            border: "2px solid #1F8FCD",
            color: "#0B2E4C",
            "&:hover": {
              border: "2px solid #1F8FCD",
              backgroundColor: "rgba(31, 143, 205, 0.1)"
            }
          }}
        >
          Generate Contract
        </Button>

        <Button
          fullWidth
          variant="contained"
          sx={{
            ml: 1,
            py: 1.5,
            borderRadius: 1,
            backgroundColor: "#0B2E4C",
            fontFamily: 'Poppins',
            fontWeight: 600,
            fontSize: '16px',
            border: "2px solid #1F8FCD",
            "&:hover": {
              backgroundColor: "#1a4b7a",
            }
          }}
        >
          Accept Service
        </Button>
      </Box>

      {/* Main chat area with proper scrolling */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#f3f3f3",
          overflow: "hidden",
        }}
      >
        {/* Chat messages container with scroll */}
        <Box
          sx={{
            flex: 1,
            p: 2,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 2,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#888",
              borderRadius: "3px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "#555",
            },
          }}
        >
          {/* Date separator */}
          <Box sx={{ textAlign: "center", my: 1 }}>
            <Typography variant="caption" color="textSecondary">
              Today, June 19
            </Typography>
          </Box>

          {/* Sample messages - these would be mapped from your actual messages */}
          {/* Messages area */}
          <Box sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
            backgroundColor: '#f5f5f5',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}>
            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : messages.length === 0 ? (
              <Typography variant="body1" color="textSecondary">
                No Chat available
              </Typography>
            ) : (
              messages.map((item: any) => (
                <Box
                  key={item._id}
                  sx={{
                    alignSelf: item.senderId === currentUser ? 'flex-end' : 'flex-start',
                    maxWidth: '80%'
                  }}
                >
                  {/* Message bubble */}
                  <Box
                    sx={{
                      backgroundColor: item.senderId === currentUser ? '#0B2E4C' : '#E0E0E0',
                      color: item.senderId === currentUser ? 'white' : 'inherit',
                      p: 1.5,
                      px: 2,
                      borderRadius: item.senderId === currentUser
                        ? '20px 20px 0 20px'
                        : '20px 20px 20px 0',
                      display: 'inline-block'
                    }}
                  >
                    <Typography fontWeight={500}>
                      {item.message}
                    </Typography>
                  </Box>
                  {/* Timestamp */}
                  <Typography
                    fontSize={12}
                    color="textSecondary"
                    mt={0.5}
                    sx={{
                      textAlign: item.senderId === currentUser ? 'right' : 'left',
                      mr: item.senderId === currentUser ? 1 : 0,
                      ml: item.senderId === currentUser ? 0 : 1
                    }}
                  >
                    {formatTimeToAMPM(item.createdAt)}
                  </Typography>
                </Box>
              ))
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Typing indicator */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Box
              sx={{
                backgroundColor: "#E0E0E0",
                p: 1.5,
                px: 2,
                borderRadius: "20px 20px 20px 4px",
                display: "inline-flex",
                alignItems: "center",
              }}
            >
              <Box sx={{ display: "flex", gap: 0.5 }}>
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#666",
                  animation: "pulse 1.5s infinite ease-in-out",
                  "&:nth-of-type(1)": { animationDelay: "0s" },
                  "&:nth-of-type(2)": { animationDelay: "0.3s" },
                  "&:nth-of-type(3)": { animationDelay: "0.6s" },
                  "@keyframes pulse": {
                    "0%, 100%": { opacity: 0.3, transform: "translateY(0)" },
                    "50%": { opacity: 1, transform: "translateY(-3px)" },
                  }
                }} />
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#666",
                  animation: "pulse 1.5s infinite ease-in-out",
                  animationDelay: "0.3s"
                }} />
                <Box sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#666",
                  animation: "pulse 1.5s infinite ease-in-out",
                  animationDelay: "0.6s"
                }} />
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Input field - always visible at bottom */}
        {/* Input area */}
        <Box sx={{
          p: 2,
          borderTop: '1px solid #e0e0e0',
          backgroundColor: 'white',
          display: 'flex',
          alignItems: 'center'
        }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            variant="outlined"
            size="small"
            sx={{
              mr: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
                paddingRight: '8px'
              }
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: '50%'
            }}
          >
            {isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          </Button>
        </Box>
        {/* <Box
          sx={{
            p: 2,
            display: "flex",
            alignItems: "center",
            borderTop: "1px solid #ddd",
            backgroundColor: "#fff",
          }}
        >
          <IconButton sx={{ color: "#0B2E4C", mr: 1 }}>
            <AttachFile />
          </IconButton>
          <TextField
            fullWidth
            placeholder="Type a message..."
            variant="outlined"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            size="small"
            multiline
            maxRows={4}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "20px",
                backgroundColor: "#f5f5f5",
                "& fieldset": {
                  borderColor: "transparent",
                },
                "&:hover fieldset": {
                  borderColor: "#1F8FCD",
                },
                "&.Mui-focused fieldset": {
                  borderColor: "#1F8FCD",
                  borderWidth: "1px",
                },
              },
            }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={sendMessage}
            disabled={!newMessage.trim() || isSending}
            sx={{
              minWidth: 'auto',
              width: 40,
              height: 40,
              borderRadius: '50%'
            }}
          >
            {isSending ? <CircularProgress size={20} color="inherit" /> : <SendIcon />}
          </Button>
         
        </Box> */}
      </Box>
    </Paper >
  );
};