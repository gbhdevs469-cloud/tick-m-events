import { Dialog, IconButton, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';

interface FullScreenAvatarProps {
    src: string;
    alt: string;
    open: boolean;
    onClose: () => void;
}

export function FullScreenAvatar({ src, alt, open, onClose }: FullScreenAvatarProps) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="lg"
            fullWidth
            PaperProps={{
                style: {
                    backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    boxShadow: 'none',
                    overflow: 'hidden'
                }
            }}
        >
            <Box sx={{ position: 'relative', width: '100%', height: '100vh' }}>
                <IconButton
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        color: 'white',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 10,
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)',
                        }
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        width: '100%',
                        height: '100vh',
                        padding: 2,
                        boxSizing: 'border-box'
                    }}
                >
                    <Box
                        component="img"
                        src={src}
                        alt={alt}
                        sx={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            borderRadius: '33%',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            '&:hover': {
                                transform: 'scale(1.02)'
                            }
                        }}
                        onClick={onClose}
                    />
                </Box>
            </Box>
        </Dialog>
    );
};
