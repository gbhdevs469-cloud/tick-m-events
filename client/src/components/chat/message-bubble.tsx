import { Box, Typography, Button } from '@mui/material';
import { InsertDriveFile } from '@mui/icons-material';

import { formatTimeToAMPM } from 'src/hooks/formate-time';

import { downloadFile, formatFileSize } from './utills';

export const MessageBubble = ({ message, isCurrentUser }: any) => {
    const { type, message: content, updatedAt, files } = message;

    const bubbleStyle = {
        display: 'flex',
        justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
        mb: 1
    };

    const contentBoxStyle = {
        backgroundColor: isCurrentUser ? '#032D4F' : '#e0e0e0',
        borderRadius: isCurrentUser ? '18px 18px 0 18px' : '18px 18px 18px 0',
        overflow: 'hidden',
        maxWidth: '70%'
    };

    const captionStyle = {
        display: 'block',
        textAlign: 'right',
        color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)',
        p: 1,
        fontSize: '10px'
    };

    const textContentStyle = {
        ...contentBoxStyle,
        color: isCurrentUser ? 'white' : 'black',
        px: 2,
        py: 1,
    };

    // Handle file messages
    if (type === 'file' && files && files.length > 0) {
        const file = files[0];
        const isImage = file.fileType === 'image';
        const isVideo = file.fileType === 'video';
        const isDocument = file.fileType === 'document';

        return (
            <Box sx={bubbleStyle}>
                <Box sx={contentBoxStyle}>
                    {isImage && (
                        <img
                            src={file.url}
                            alt="Uploaded content"
                            style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                display: 'block'
                            }}
                        />
                    )}
                    {isVideo && (
                        <video
                            controls
                            style={{
                                maxWidth: '100%',
                                maxHeight: '300px',
                                display: 'block'
                            }}
                        >
                            <source src={file.url} type="video/mp4" />
                            <track kind="captions" src="" srcLang="en" label="English" />
                            Your browser does not support the video tag.
                        </video>
                    )}
                    {isDocument && (
                        <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 1, minWidth: { xs: 150, sm: 170, md: 200 } }}>
                            <InsertDriveFile sx={{ fontSize: 40, color: isCurrentUser ? 'white' : 'inherit' }} />
                            <Typography variant="body2" sx={{ color: isCurrentUser ? 'white' : 'inherit' }}>
                                {file.fileName || 'Document'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: isCurrentUser ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.5)' }}>
                                {formatFileSize(file.fileSize)}
                            </Typography>
                            <Button
                                variant="contained"
                                size="small"
                                onClick={() => downloadFile(file.url, file.fileName)}
                                sx={{
                                    backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                                    color: isCurrentUser ? 'white' : 'inherit',
                                    '&:hover': {
                                        backgroundColor: isCurrentUser ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.2)',
                                    }
                                }}
                            >
                                Download
                            </Button>
                        </Box>
                    )}
                    {content && (
                        <Typography sx={{ p: 1, color: isCurrentUser ? 'white' : 'inherit' }}>
                            {content}
                        </Typography>
                    )}
                    <Typography variant="caption" sx={captionStyle}>
                        {formatTimeToAMPM(updatedAt)}
                    </Typography>
                </Box>
            </Box>
        );
    }

    // Default text message
    return (
        <Box sx={bubbleStyle}>
            <Box sx={textContentStyle}>
                <Typography fontSize={14}>{content}</Typography>
                <Typography variant="caption" sx={captionStyle}>
                    {formatTimeToAMPM(updatedAt)}
                </Typography>
            </Box>
        </Box>
    );
};