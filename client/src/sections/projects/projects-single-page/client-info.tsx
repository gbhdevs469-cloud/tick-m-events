import InstagramIcon from '@mui/icons-material/Instagram';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TikTokIcon from '@mui/icons-material/MusicNote';
import {
    Box, Typography, Paper, Divider, Stack,
    IconButton, Link, Avatar, Tooltip, Button
} from "@mui/material";
import { useNavigate } from 'react-router-dom';
import ChatIcon from '@mui/icons-material/Chat';
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useDispatch, useSelector } from 'react-redux';

import { formatEventDate } from 'src/hooks/formate-time';
import { secureInfoData } from 'src/redux/actions/secure.acation';
import { useEffect } from 'react';
import { AppDispatch, RootState } from 'src/redux/store';


export function ClientInfo({ _project }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const { isAssigned } = useSelector((state: RootState) => state?.security);

    const navigate = useNavigate();
    useEffect(() => {
        dispatch(secureInfoData(_project?._id));
    }, [dispatch, _project?._id]);
    const verificationItems = [
        {
            key: 'emailVerified',
            label: 'Email verified',
            value: _project?.createdBy?.verification?.emailVerified
        },
        {
            key: 'whatsappVerified',
            label: 'Phone verified',
            value: _project?.createdBy?.verification?.whatsappVerified
        },
        {
            key: 'identityVerified',
            label: 'Identity verified',
            value: _project?.createdBy?.verification?.identityVerified
        },
        {
            key: 'paymentVerified',
            label: 'Payment verified',
            value: _project?.createdBy?.verification?.paymentVerified
        },
        // {
        //     key: 'depositMade',
        //     label: 'Deposit made',
        //     value: _project?.createdBy?.depositMade // Example of additional field
        // },
        // {
        //     key: 'profileCompleted',
        //     label: 'Profile completed',
        //     value: _project?.createdBy?.profileCompleted // Example of additional field
        // }
    ];
    return (
        <Paper sx={{
            p: 3,
            borderRadius: 2,
            border: '3px solid #2395D4'
        }}>
            <Typography fontWeight="bold" mb={2}>
                About the Client
            </Typography>

            <Box display="flex" justifyContent="space-around" alignItems="center">
                <Box>
                    <Avatar
                        src={_project?.createdBy?.avatar?.url} // Replace with your image path
                        alt={_project?.createdBy?.name}
                        sx={{
                            width: 50,
                            height: 50,
                            border: '3px solid #f0f0f0'
                        }}
                    >
                        {/* Fallback initials if image fails to load */}
                        {_project?.createdBy?.name
                            ? _project.createdBy.name
                                .split(' ')
                                .map((word: any) => word.charAt(0))
                                .join('')
                                .toUpperCase()
                                .slice(0, 2)
                            : 'US' // Default fallback if no name
                        }
                    </Avatar>
                </Box>
                <Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="h6" textTransform="capitalize">
                            {_project?.createdBy?.name}
                        </Typography>
                        {_project?.createdBy?.isVerified && (
                            <Tooltip title="Verified User">
                                <VerifiedIcon
                                    fontSize="small"
                                    color="primary"
                                    sx={{
                                        color: '#1F8FCD', // Custom blue color
                                        fontSize: '18px'
                                    }}
                                />
                            </Tooltip>
                        )}
                    </Box>
                    <Typography variant="body2" textTransform="capitalize" fontSize={11}>📍 {_project?.createdBy?.address}</Typography>
                    <Typography variant="body2" color="gray" fontSize={11}>
                        Member since {formatEventDate(_project?.createdBy?.createdAt)}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            fontSize: 11,
                            filter: 'blur(4px)',
                            userSelect: 'none',
                            WebkitUserSelect: 'none',
                            MozUserSelect: 'none',
                        }}
                    >
                        {_project?.createdBy?.email}
                    </Typography>
                </Box>
            </Box>


            <Divider sx={{ my: 2, borderColor: "#334155" }} />

            <Typography fontWeight="bold" mb={1}>
                Client Engagement
            </Typography>
            <Typography variant="body2">✔️ Contacted <b>less than 10</b> freelancers</Typography>
            <Typography variant="body2">✔️ Invited <b>0</b> freelancers</Typography>
            <Typography variant="body2">✔️ Completed <b>0</b> projects</Typography>


            {/* Social Media Icons */}
            {
                _project?.createdBy?.socialLinks ?
                    <>
                        <Divider sx={{ my: 2, borderColor: "#334155" }} /><Box>
                            <Typography fontWeight="bold" mb={1}>
                                Social Media
                            </Typography>

                            <Box display="flex" gap={1} mb={2}>
                                {_project?.createdBy?.socialLinks?.instagram && (
                                    <IconButton
                                        component={Link}
                                        href={_project.createdBy.socialLinks.instagram}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{ color: '#E1306C' }} // Instagram color
                                    >
                                        <InstagramIcon />
                                    </IconButton>
                                )}

                                {_project?.createdBy?.socialLinks?.facebook && (
                                    <IconButton
                                        component={Link}
                                        href={_project.createdBy.socialLinks.facebook}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{ color: '#1877F2' }} // Facebook color
                                    >
                                        <FacebookIcon />
                                    </IconButton>
                                )}

                                {_project?.createdBy?.socialLinks?.linkedin && (
                                    <IconButton
                                        component={Link}
                                        href={_project.createdBy.socialLinks.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{ color: '#0077B5' }} // LinkedIn color
                                    >
                                        <LinkedInIcon />
                                    </IconButton>
                                )}

                                {_project?.createdBy?.socialLinks?.tiktok && (
                                    <IconButton
                                        component={Link}
                                        href={_project.createdBy.socialLinks.tiktok}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        size="small"
                                        sx={{ color: '#000000' }} // TikTok color
                                    >
                                        <TikTokIcon />
                                    </IconButton>
                                )}
                            </Box>

                        </Box>
                    </> : null
            }



            <Divider sx={{ my: 2, borderColor: "#334155" }} />

            <Typography fontWeight="bold" mb={1}>
                Client Verification
            </Typography>
            <Stack spacing={0.5}>
                {verificationItems.map((item) => {
                    const isVerified = item.value === true;
                    const hasData = item.value !== undefined && item.value !== null;

                    return (
                        <Typography key={item.key} variant="body2" sx={{ display: 'flex', alignItems: 'center' }}>
                            {hasData ? (
                                isVerified ? (
                                    <CheckCircleIcon fontSize="small" color="success" sx={{ mr: 1 }} />
                                ) : (
                                    <CancelIcon fontSize="small" color="error" sx={{ mr: 1 }} />
                                )
                            ) : (
                                <CancelIcon fontSize="small" color="disabled" sx={{ mr: 1 }} />
                            )}
                            {item.label}
                        </Typography>
                    );
                })}
            </Stack>

            {/* Chat by Organizer */}
            <Divider sx={{ my: 2, borderColor: "#334155" }} />

            <Button
                variant="outlined"
                fullWidth
                startIcon={<ChatIcon />}
                onClick={() => {
                    navigate("/messaging-&-client-relationship");
                    sessionStorage.setItem('currentChatProvider', JSON.stringify(_project?.createdBy));
                }}
                size="small"
                sx={{ mt: 1 }}  // Add some margin top for spacing
            >
                Chat Now
            </Button>
        </Paper>
    )
}