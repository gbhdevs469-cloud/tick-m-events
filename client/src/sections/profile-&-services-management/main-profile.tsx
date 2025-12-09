import {
    Avatar, Box, Button, Grid, Typography, IconButton,
    Menu, MenuItem, ListItemIcon, Dialog, DialogTitle,
    DialogContent, DialogActions, Collapse, CircularProgress
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from '@mui/icons-material/Edit';
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { WhatsApp, Facebook, Twitter, LinkedIn, Instagram, Link as LinkIcon, ExpandMore, ExpandLess } from '@mui/icons-material';
import { CountryCode, parsePhoneNumber } from 'libphonenumber-js';
import flags from 'react-phone-number-input/flags';

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { AppDispatch, RootState } from "src/redux/store";
import { profileGet, updateProAvatar, updateProCover } from "src/redux/actions";
import { TikTokIcon } from "./utills";
import 'react-phone-number-input/style.css'

interface ApiResult {
    status: number;
    type: string;
    message: any;
}

interface PhoneNumberDisplayProps {
    phoneNumber: string;
    defaultCountry?: CountryCode;
}

export function MainProfile({ handleAvalibility, setShowService, onModify }: any) {
    const { profile } = useSelector((state: RootState) => state?.profile);
    const { user } = useSelector((state: RootState) => state?.auth);
    const dispatch = useDispatch<AppDispatch>();
    const [covererror, setCoverError] = useState(null)
    const [coverloading, setCoverLoading] = useState(false)
    const [picloading, setPicLoading] = useState(false)
    const [avatarerror, setAvatarError] = useState(null)
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [shareAnchorEl, setShareAnchorEl] = useState<null | HTMLElement>(null);
    const [copySuccess, setCopySuccess] = useState(false);
    const openShareMenu = Boolean(shareAnchorEl);
    const [showDetails, setShowDetails] = useState(false);
    const handleShareClick = (event: React.MouseEvent<HTMLElement>) => {
        setShareAnchorEl(event.currentTarget);
    };

    const handleShareClose = () => {
        setShareAnchorEl(null);
    };

    const copyProfileLink = () => {
        const profileUrl = `${import.meta.env.VITE_FRONT_URL || 'https://tick-m-events.vercel.app'}/profile/${user?._id}`;
        navigator.clipboard.writeText(profileUrl);
        setCopySuccess(true);
        handleShareClose();
        setTimeout(() => setCopySuccess(false), 3000);
    };

    const shareOnSocialMedia = (platform: string) => {
        const profileUrl = `${import.meta.env.VITE_FRONT_URL || 'https://tick-m-events.vercel.app'}/profile/${user?._id}`;
        const message = `Check out my profile on EventHub: ${profileUrl}`;

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(message)}`;
                break;
            case 'facebook':
                url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(profileUrl)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`;
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
    const handleModifyClick = (rowData: any) => {
        onModify(rowData);  // Call the callback with row data
    };


    const handleCoverChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('cover', file);

            try {
                setCoverLoading(true);
                setCoverError(null);

                const result = await dispatch(updateProCover(formData))
                if ((result as ApiResult)?.status === 200) {
                    setCoverError(null);
                    dispatch(profileGet(profile?._id));
                } else {
                    setCoverError(result.message);

                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setCoverLoading(false);
            }
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append('avatar', file);

            try {
                setPicLoading(true);
                setAvatarError(null);
                const result = await dispatch(updateProAvatar(formData))
                if ((result as ApiResult)?.status === 200) {
                    setAvatarError(null);
                    dispatch(profileGet(profile?._id));
                } else {
                    toast.error(result.message);
                }
            } catch (error) {
                toast.error(error.message);
            } finally {
                setPicLoading(false);
            }
        }
    };

    const triggerAvatarInput = () => {
        avatarInputRef.current?.click();
    };

    const triggerCoverInput = () => {
        coverInputRef.current?.click();
    };

    useEffect(() => {
        dispatch(profileGet(user?._id));
    }, [dispatch, user?._id]);

    return (
        <Box boxShadow={3} borderRadius={3} bgcolor="#FFFFFF" >
            {/* Banner Image */}
            {/* Hidden file inputs */}
            <input
                type="file"
                ref={avatarInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                style={{ display: 'none' }}
            />
            <input
                type="file"
                ref={coverInputRef}
                onChange={handleCoverChange}
                accept="image/*"
                style={{ display: 'none' }}
            />

            {/* Banner Image with Edit Button */}
            <Box
                borderRadius="24px 24px 0px 0px"
                sx={{
                    width: "100%",
                    height: { xs: "150px", sm: "220px" },
                    backgroundImage: profile?.cover?.url
                        ? `url(${profile.cover?.url})`
                        : `url(https://res.cloudinary.com/dm624gcgg/image/upload/v1745399695/a33ffade6c44792172af87c950e914099ba87c45_dg1rab.png)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center center",
                    backgroundRepeat: "no-repeat",
                    position: 'relative',
                    overflow: 'hidden',
                    opacity: coverloading ? 0.7 : 1,
                    transition: 'opacity 0.3s ease'
                }}
            >
                {/* Loading overlay for cover image */}
                {coverloading && (
                    <Box
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            zIndex: 1
                        }}
                    >
                        <CircularProgress size={40} sx={{ color: 'white' }} />
                    </Box>
                )}

                <IconButton
                    onClick={triggerCoverInput}
                    sx={{
                        position: 'absolute',
                        bottom: 16,
                        right: 16,
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        color: 'white',
                        '&:hover': {
                            backgroundColor: 'rgba(0, 0, 0, 0.7)'
                        },
                        zIndex: 2,
                        opacity: coverloading ? 0.5 : 1
                    }}
                    disabled={coverloading}
                >
                    {coverloading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <EditIcon fontSize="small" />}
                </IconButton>

                <Typography sx={{
                    position: 'absolute',
                    top: 10,
                    right: 16,
                    zIndex: 2
                }} color="red" fontSize={15} fontWeight={600}>
                    {covererror}
                </Typography>
            </Box>

            {/* Profile Info */}
            <Box display="flex" alignItems="center" gap={3} p={3} >
                <Box sx={{ position: "relative", mt: -5 }}>
                    <Avatar
                        src={profile?.avatar?.url}
                        alt="Profile"
                        sx={{
                            width: 90,
                            height: 90,
                        }}
                    />
                    {/* Inset Active Dot */}
                    {/* <Box
                        sx={{
                            position: "absolute",
                            bottom: 4,
                            right: 4,
                            width: 12,
                            height: 12,
                            backgroundColor: "#04C832",
                            border: "2px solid white",
                            borderRadius: "50%",
                            zIndex: 1,
                        }}
                    /> */}
                    {/* Avatar Edit Button */}
                    <IconButton
                        onClick={triggerAvatarInput}
                        sx={{
                            position: 'absolute',
                            bottom: -2,
                            right: -8,
                            backgroundColor: 'rgba(0, 0, 0, 0.5)',
                            color: 'white',
                            '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.7)'
                            }
                        }}
                    >
                        {picloading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <EditIcon fontSize="small" />}
                    </IconButton>
                </Box>

                <Box sx={{ marginTop: "-43px" }}>
                    <HeadingCommon variant="body1" title={profile?.name} weight={600} mb={0} />
                    <Typography fontWeight={600} fontSize={{ xs: 11, sm: 12, md: 13 }}>{profile?.username}</Typography>
                </Box>
            </Box>

            <Box p={3}>
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
                            {/* Contact Info */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Contact</Typography>
                                <Typography>{profile?.email}</Typography>
                                {profile?.number && (
                                    <PhoneNumberDisplay
                                        phoneNumber={profile.number}
                                        defaultCountry="US" // You can detect this dynamically
                                    />
                                )}
                                <Typography textTransform="capitalize">{profile?.address}</Typography>
                            </Grid>

                            {/* Social Links */}
                            <Grid item xs={12} md={6}>
                                <Typography variant="subtitle2" color="textSecondary">Social Media</Typography>
                                <Box display="flex" gap={1} mt={1}>
                                    {profile?.socialLinks?.linkedin && (
                                        <IconButton
                                            size="small"
                                            href={profile.socialLinks.linkedin}
                                            target="_blank"
                                        >
                                            <LinkedIn fontSize="small" />
                                        </IconButton>
                                    )}
                                    {profile?.socialLinks?.tiktok && (
                                        <IconButton
                                            size="small"
                                            href={profile.socialLinks.tiktok}
                                            target="_blank"
                                        >
                                            <TikTokIcon />
                                        </IconButton>
                                    )}
                                    {profile?.socialLinks?.facebook && (
                                        <IconButton
                                            size="small"
                                            href={profile.socialLinks.facebook}
                                            target="_blank"
                                        >
                                            <Facebook />
                                        </IconButton>
                                    )}
                                    {profile?.socialLinks?.instagram && (
                                        <IconButton
                                            size="small"
                                            href={profile.socialLinks.instagram}
                                            target="_blank"
                                        >
                                            <Instagram />
                                        </IconButton>
                                    )}
                                </Box>
                            </Grid>

                            {/* Experience */}
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="textSecondary">Experience</Typography>
                                <Typography>{profile?.experience || 'Not specified'}</Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </Collapse>
            </Box>

            {/* Stats Section */}
            <Box mx={3}>
                {/* Stats Box */}
                <Grid container
                    sx={{
                        p: 2,
                        display: 'flex',
                        justifyContent: 'space-around',
                        border: '1px solid #ccc',
                        borderRadius: 3,
                        textAlign: 'center',
                        backgroundColor: '#fff',
                    }}>
                    <Grid item xs={6} sm={3}>
                        <Typography fontSize="13px" color="#1E1E1E">
                            Overall Rating
                        </Typography>
                        <Typography fontWeight="bold" fontSize="16px" mt={0.5}>
                            {profile?.averageRating}/5{" "}
                            <Typography component="span" fontSize="13px" color="#1E1E1E">
                                ({profile?.reviewCount} reviews)
                            </Typography>
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sm={3}>
                        <Typography fontSize="13px" color="#1E1E1E">
                            Completed Gigs
                        </Typography>
                        <Typography fontWeight="bold" fontSize="16px" mt={0.5}>
                            {profile?.gigsCounts?.completed || 0}
                        </Typography>
                    </Grid>
                    {profile?.role === 'provider' && (
                        <Grid xs={6} sm={3}>
                            <Typography fontSize="13px" color="#1E1E1E">
                                Profile Views
                            </Typography>
                            <Typography fontWeight="bold" fontSize="16px" mt={0.5}>
                                {profile?.profileViews?.currentMonth?.count || 0}
                                {/* 250{" "} */}
                                {/* <Typography component="span" fontSize="13px" color="#1E1E1E">
                                    this week
                                </Typography> */}
                            </Typography>
                        </Grid>
                    )}

                    <Grid item xs={6} sm={3}>
                        <Typography fontSize="13px" color="#1E1E1E">
                            Response Time
                        </Typography>
                        <Typography fontWeight="bold" fontSize="16px" mt={0.5}>
                            within 1h
                        </Typography>
                    </Grid>
                </Grid>

                {/* Action Buttons */}
                <Grid container spacing={2} my={2}>
                    <Grid item xs={12} sm={6} md={profile?.role === 'provider' ? 3 : 6} >
                        <Button
                            fullWidth
                            onClick={() => { handleModifyClick(profile) }}
                            variant="contained"
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
                            Modify Profile
                        </Button>

                    </Grid>
                    {profile?.role === 'provider' && (
                        <>
                            <Grid item xs={12} sm={6} md={3} >
                                <Button
                                    onClick={() => { setShowService() }}

                                    fullWidth
                                    variant="contained"
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
                                    Add a Service
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3} >
                                <Button
                                    fullWidth
                                    onClick={() => { handleAvalibility() }}

                                    variant="contained"
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
                                    Update Availability
                                </Button>
                            </Grid>
                        </>
                    )}
                    {/* Share Button - Replace your existing one with this */}
                    <Grid item xs={12} sm={6} md={user?.role === 'provider' ? 3 : 6}>
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
                </Grid>
            </Box>
        </Box>
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