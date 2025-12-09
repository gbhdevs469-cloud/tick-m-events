import {
    Modal, Collapse, Box, MenuItem, Typography,
    Button, Avatar, Grid, IconButton,
    Menu, ListItemIcon, Dialog, DialogTitle,
    DialogContent, DialogActions, Chip, Divider
} from "@mui/material";
import {
    WhatsApp, Facebook, Twitter, LinkedIn, Instagram, Link as LinkIcon, ExpandMore, ExpandLess,
    CheckCircleOutline, AccessTime, Block, RemoveCircleOutline
} from '@mui/icons-material';
import { useState } from "react";
import Rating from '@mui/material/Rating';
import flags from 'react-phone-number-input/flags';
import { toast } from "react-toastify";
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';

import { TikTokIcon } from "src/sections/profile-&-services-management/utills";
import { ServiceCard } from "src/sections/search-&-select-service-providers/ServiceCard";

import { HeadingCommon } from "../multiple-responsive-heading/heading";

interface PhoneNumberDisplayProps {
    phoneNumber: string;
    defaultCountry?: CountryCode;
}

export function ProviderOrganizerInfoModal({ isModalOpen, selectedEvent, handleCloseModal, select }: any) {
 
    const [showDetails, setShowDetails] = useState(false);
    const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
    const openShareMenu = Boolean(shareAnchorEl);
    const [copySuccess, setCopySuccess] = useState(false);

    const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
        setShareAnchorEl(event.currentTarget);
    };
    const handleShareClose = () => {
        setShareAnchorEl(null);
    };
    const shareOnSocialMedia = (platform: string) => {
        const profileUrl = `${import.meta.env.VITE_Live_URL}/pro/${select?._id}`;
        const profileTextMsg = `Check out my profile on EventHub: ${profileUrl}`;

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(profileTextMsg)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(profileTextMsg)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(profileUrl)}`;
                break;
            case 'instagram':
                // Note: Instagram doesn't support direct sharing via URL
                toast.info("Copy the link to share on Instagram");
                copyProfileLink();
                return;
            default:
                return;
        }

        window.open(url, '_blank', 'noopener,noreferrer');
        handleShareClose();
    };
    const copyProfileLink = () => {
        const profileUrl = `${import.meta.env.VITE_FRONT_URL || 'https://tick-m-events.vercel.app'}/pro/${select?._id}`;
        navigator.clipboard.writeText(profileUrl);
        setCopySuccess(true);
        handleShareClose();
        setTimeout(() => setCopySuccess(false), 3000);
    };

    return (
        <Modal
            open={isModalOpen}
            onClose={handleCloseModal}
            aria-labelledby="provider-profile-modal"
            aria-describedby="provider-profile-details"
        >
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: '80%', md: '90%' },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2,
                    maxHeight: '90vh',
                    overflowY: 'auto'
                }}>
                {/* Cover Image */}
                <Box
                    sx={{
                        height: { xs: 150, sm: 200, md: 250 },
                        backgroundImage: `url(${select?.cover?.url || '/assets/images/home-and-recommendations/tech.png'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        position: 'relative',
                        borderTopLeftRadius: 3,
                        borderTopRightRadius: 3,
                    }}
                >
                    {/* Status Badge */}
                    <Box sx={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        display: 'flex',
                        gap: 1
                    }}>
                        <Chip
                            label={select?.isVerified ? "Verified" : "Unverified"}
                            color={select?.isVerified ? "success" : "warning"}
                            size="small"
                            sx={{
                                fontWeight: 600,
                                textTransform: 'uppercase',
                                fontSize: '0.65rem',
                                backdropFilter: 'blur(4px)',
                                backgroundColor: select?.isVerified ? 'rgba(46, 125, 50, 0.9)' : 'rgba(237, 108, 2, 0.9)',
                                color: 'white'
                            }}
                        />
                        {/* Status Badge - Dynamic based on status */}
                        {select?.status === 'active' && (
                            <Chip
                                label="Active"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.65rem',
                                    backgroundColor: 'rgba(56, 142, 60, 0.9)',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                                icon={<CheckCircleOutline fontSize="small" />}
                            />
                        )}

                        {select?.status === 'pending' && (
                            <Chip
                                label="Pending"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.65rem',
                                    backgroundColor: 'rgba(251, 192, 45, 0.9)',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                                icon={<AccessTime fontSize="small" />}
                            />
                        )}

                        {select?.status === 'block' && (
                            <Chip
                                label="Blocked"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.65rem',
                                    backgroundColor: 'rgba(211, 47, 47, 0.9)',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                                icon={<Block fontSize="small" />}
                            />
                        )}

                        {select?.status === 'inActive' && (
                            <Chip
                                label="Inactive"
                                size="small"
                                sx={{
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '0.65rem',
                                    backgroundColor: 'rgba(158, 158, 158, 0.9)',
                                    color: 'white',
                                    '& .MuiChip-icon': { color: 'white' }
                                }}
                                icon={<RemoveCircleOutline fontSize="small" />}
                            />
                        )}
                    </Box>
                </Box>

                <Box sx={{ p: { xs: 2, sm: 2, md: 3 }, position: 'relative' }}>
                    <Avatar
                        src={select?.avatar?.url || '/assets/images/Profile.jpg'}
                        sx={{
                            width: 100,
                            height: 100,
                            position: 'absolute',
                            top: -30,
                            left: { xs: 'calc(50% - 40px)', sm: 'calc(50% - 40px)', md: 24 },
                        }}
                    />

                    <Box sx={{
                        ml: { xs: 0, sm: 15, md: 15 },
                        mt: { xs: 8, sm: 8, md: -2 },
                        textAlign: { xs: 'center', sm: 'center', md: 'left' }
                    }}
                    >
                        <Typography variant="h6" fontWeight={600}>
                            {select?.name}
                        </Typography>
                        <Typography variant="body2" >
                            {select?.username}
                        </Typography>
                    </Box>

                    {/* Basic Information  */}
                    {/* <Box p={3}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="h6" fontWeight={600}>Basic Information</Typography>
                            <Button
                                variant="text"
                                onClick={() => setShowDetails(!showDetails)}
                                endIcon={showDetails ? <ExpandLess /> : <ExpandMore />}
                            >
                                {showDetails ? 'Hide Details' : 'Show Details'}
                            </Button>
                        </Box>

                        <Collapse in={showDetails} timeout="auto" unmountOnExit>
                            <Box mt={2} sx={{
                                borderTop: '1px solid #e0e0e0',
                                pt: 2,
                            }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Contact</Typography>
                                        <Typography>{select?.email}</Typography>
                                        {select?.number && (
                                            <PhoneNumberDisplay
                                                phoneNumber={select.number}
                                                defaultCountry="US" 
                                            />
                                        )}
                                        <Typography textTransform="capitalize">{select?.address}</Typography>
                                    </Grid>

                                    <Grid item xs={12} md={6}>
                                        <Typography variant="subtitle2" color="textSecondary">Social Media</Typography>
                                        <Box display="flex" gap={1} mt={1}>
                                            {select?.socialLinks?.linkedin && (
                                                <IconButton
                                                    size="small"
                                                    href={select.socialLinks.linkedin}
                                                    target="_blank"
                                                >
                                                    <LinkedIn fontSize="small" />
                                                </IconButton>
                                            )}
                                            {select?.socialLinks?.tiktok && (
                                                <IconButton
                                                    size="small"
                                                    href={select.socialLinks.tiktok}
                                                    target="_blank"
                                                >
                                                    <TikTokIcon />
                                                </IconButton>
                                            )}
                                            {select?.socialLinks?.facebook && (
                                                <IconButton
                                                    size="small"
                                                    href={select.socialLinks.facebook}
                                                    target="_blank"
                                                >
                                                    <Facebook />
                                                </IconButton>
                                            )}
                                            {select?.socialLinks?.instagram && (
                                                <IconButton
                                                    size="small"
                                                    href={select.socialLinks.instagram}
                                                    target="_blank"
                                                >
                                                    <Instagram />
                                                </IconButton>
                                            )}
                                        </Box>
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
                                        <Typography>{select?.experience || 'Not specified'}</Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Collapse>
                    </Box> */}

                    {/* Stats Section */}
                    <Grid
                        container
                        spacing={0}
                        sx={{
                            mt:3,
                            p: 2,
                            display: 'flex',
                            justifyContent: 'space-around',
                            border: '1px solid #ccc',
                            borderRadius: 3,
                            textAlign: 'center',
                            backgroundColor: '#fff',
                        }}
                    >
                        <Box>
                            <Typography variant="subtitle2">Overall Rating</Typography>
                            <Typography fontWeight={600}>{select?.averageRating}/5 ({select?.reviewCount} reviews)</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Completed Gigs</Typography>
                            <Typography fontWeight={600}>  {select?.gigsCounts?.completed|| 0}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="subtitle2">Response Time</Typography>
                            <Typography fontWeight={600}>within 1h</Typography>
                        </Box>
                    </Grid>

                    {/* Share Button - Replace your existing one with this */}
                    <Box display="flex" flexDirection={{ xs: 'column', sm: 'row' }} gap={2}>
                        <Grid item xs={12} sm={6} md={6} mt={3} width="100%">
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={handleShareClick}
                                sx={{
                                    backgroundColor: "#032D4F",
                                    textTransform: "none",
                                    borderRadius: "8px",
                                    fontWeight: 500,
                                    fontSize: "14px",
                                    py: 1.5,
                                    "&:hover": {
                                        backgroundColor: "#021f37",
                                    },
                                }}
                            >
                                Share Profile
                            </Button>

                            {/* Share Menu */}
                            <Menu
                                anchorEl={shareAnchorEl}
                                open={openShareMenu}
                                onClose={handleShareClose}
                                PaperProps={{
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                    },
                                }}
                                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                            >
                                <MenuItem onClick={() => shareOnSocialMedia('whatsapp')}>
                                    <ListItemIcon>
                                        <WhatsApp fontSize="small" />
                                    </ListItemIcon>
                                    WhatsApp
                                </MenuItem>
                                <MenuItem onClick={() => shareOnSocialMedia('facebook')}>
                                    <ListItemIcon>
                                        <Facebook fontSize="small" />
                                    </ListItemIcon>
                                    Facebook
                                </MenuItem>
                                <MenuItem onClick={() => shareOnSocialMedia('twitter')}>
                                    <ListItemIcon>
                                        <Twitter fontSize="small" />
                                    </ListItemIcon>
                                    Twitter
                                </MenuItem>
                                <MenuItem onClick={() => shareOnSocialMedia('linkedin')}>
                                    <ListItemIcon>
                                        <LinkedIn fontSize="small" />
                                    </ListItemIcon>
                                    LinkedIn
                                </MenuItem>
                                <MenuItem onClick={() => shareOnSocialMedia('instagram')}>
                                    <ListItemIcon>
                                        <Instagram fontSize="small" />
                                    </ListItemIcon>
                                    Instagram
                                </MenuItem>
                                <MenuItem onClick={copyProfileLink}>
                                    <ListItemIcon>
                                        <LinkIcon fontSize="small" />
                                    </ListItemIcon>
                                    Copy Link
                                </MenuItem>
                            </Menu>
                        </Grid>
                    </Box>

                    {/* Copy Success Dialog */}
                    <Dialog open={copySuccess} onClose={() => setCopySuccess(false)}>
                        <DialogTitle>Link Copied!</DialogTitle>
                        <DialogContent>
                            Your profile link has been copied to clipboard.
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setCopySuccess(false)}>OK</Button>
                        </DialogActions>
                    </Dialog>

                    {/* Reviews Section */}
                    <Box sx={{ mt: 4, p: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Reviews ({select?.reviews?.length || 0})
                        </Typography>

                        {select?.reviews?.length > 0 ? (
                            <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                {select?.reviews?.map((review: any) => (
                                    <Box key={review._id} sx={{ mb: 3, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <Avatar
                                                src={review.user?.avatar?.url}
                                                sx={{ width: 40, height: 40, mr: 2 }}
                                            />
                                            <Box>
                                                <Typography fontWeight={600}>{review.user?.name}</Typography>
                                                <Rating
                                                    value={review.rating}
                                                    readOnly
                                                    size="small"
                                                    sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }}
                                                />
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
                                                {new Date(review.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Typography>{review.comment}</Typography>

                                        {/* Reply section if exists */}
                                        {review.reply?.text && (
                                            <Box sx={{
                                                mt: 2,
                                                p: 2,
                                                bgcolor: '#f9f9f9',
                                                borderRadius: 1,
                                                borderLeft: '3px solid #032D4F'
                                            }}>
                                                <Typography variant="subtitle2" color="text.secondary">
                                                    Response from {review.reply.repliedBy?.name || 'provider'}
                                                </Typography>
                                                <Typography>{review.reply.text}</Typography>
                                            </Box>
                                        )}
                                    </Box>
                                ))}
                            </Box>
                        ) : (
                            <Typography color="text.secondary">No reviews yet</Typography>
                        )}
                    </Box>

                    {/* Availability Section */}
                    <Box sx={{ p: 3 }}>
                        <Typography variant="h6" fontWeight={600} mb={2}>
                            Availability
                        </Typography>

                        {!select?.availability?.isAvailable ? (
                            <Typography color="text.secondary">This provider is currently not available</Typography>
                        ) : (
                            <Box>
                                <Typography mb={2}>Provider&apos;s weekly availability:</Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                    {select?.availability?.schedule?.map((day: any) => (
                                        <Box key={day.day} sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            p: 1,
                                            bgcolor: day.available ? '#f0f8ff' : '#f5f5f5',
                                            borderRadius: 1
                                        }}>
                                            <Typography fontWeight={500}>{day.day}</Typography>
                                            {day.available ? (
                                                day.allDay ? (
                                                    <Typography>Available all day</Typography>
                                                ) : (
                                                    <Typography>Available from {day.startTime} to {day.endTime}</Typography>
                                                )
                                            ) : (
                                                <Typography color="text.secondary">Not available</Typography>
                                            )}
                                        </Box>
                                    ))}
                                </Box>
                            </Box>
                        )}
                    </Box>

                    <Box px={3}>
                        {
                            select?.services?.length > 0 && (
                                <Box sx={{ mt: 4 }}>
                                    <Divider sx={{ mb: 2 }} />
                                    <Box display="flex" justifyContent="space-between">
                                        <HeadingCommon variant="h6" mb={1} baseSize="24px" weight={600} title='Offered Services' />
                                        <HeadingCommon variant="h6" mb={1} baseSize="24px" weight={600} title={`Event Name: ${selectedEvent?.eventName}`} />
                                    </Box>
                                    <Grid container spacing={2}>
                                        {select.services.map((service: any) => (
                                            <Grid item xs={12} sm={6} key={service._id} sx={{ my: 3 }}>
                                                <ServiceCard
                                                    eventId={selectedEvent?._id}
                                                    event={selectedEvent}
                                                    service={service}
                                                    providerId={select}
                                                    disabled={!selectedEvent?._id} // Disable if no event selected
                                                />
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Box>
                            )
                        }
                    </Box>
                </Box>
            </Box>
        </Modal>
    )
}

export function PhoneNumberDisplay({ phoneNumber, defaultCountry = 'US' }: PhoneNumberDisplayProps) {
    // Parse the phone number to get country information
    const parsedNumber = parsePhoneNumber(phoneNumber, defaultCountry);
    const country = parsedNumber?.country || defaultCountry;
    const formattedNumber = parsedNumber?.formatInternational() || phoneNumber;

    // Get the flag component for the country
    const FlagComponent = flags[country as CountryCode];

    return (
        <Box display="flex" alignItems="center" gap={1}>
            {FlagComponent && (
                <Box width={24} height={24} display="flex" alignItems="center" justifyContent="center">
                    <FlagComponent title={country} />
                </Box>
            )}
            <Typography variant="body1">{formattedNumber}</Typography>
        </Box>
    );
}