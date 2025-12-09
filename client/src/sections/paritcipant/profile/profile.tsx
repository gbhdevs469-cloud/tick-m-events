import {
    Typography, Card, Box, Grid, TextField, Button, IconButton,
    Avatar, Chip, Fab, Dialog, DialogActions, DialogContent, DialogTitle, CircularProgress
} from "@mui/material";
import {
    Edit, Verified, LocationOn, Email, Phone, Person,
    Star, Share
} from "@mui/icons-material";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import EditIcon from '@mui/icons-material/Edit';

import { AppDispatch, RootState } from "src/redux/store";
import { profileGet, updateProAvatar, updateProCover } from "src/redux/actions";

import axios from '../../../redux/helper/axios';
import { ProfileData, ApiResult } from "../utils";

export function Profile() {
    const { user } = useSelector((state: RootState) => state?.auth);
    const [profileData, setProfileData] = useState<ProfileData | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<Partial<ProfileData>>({});
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);
    const coverInputRef = useRef<HTMLInputElement>(null);
    const [covererror, setCoverError] = useState(null)
    const [coverloading, setCoverLoading] = useState(false)
    const [picloading, setPicLoading] = useState(false)
    const dispatch = useDispatch<AppDispatch>();
    console.log(profileData, 'profileData');

    useEffect(() => {
        const fetchProfileData = async () => {
            try {
                const response = await axios.get(`/participant/profile`);
                setProfileData(response.data.userProfile);
                setEditedData(response.data.userProfile);
            } catch (err) {
                console.error("Error fetching profile data:", err);
            }
        };

        fetchProfileData();
    }, [user]);


    const handleSave = async () => {
        try {
            const response = await axios.put(`/participant/profile`, editedData);
            setProfileData(response.data.userProfile);
            setIsEditing(false);
            setEditDialogOpen(false);
        } catch (err) {
            console.error("Error updating profile:", err);
        }
    };

    const handleChange = (field: keyof ProfileData, value: string) => {
        setEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (!profileData) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '50vh',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}
            >
                <Typography variant="h6" color="white">
                    Loading Profile...
                </Typography>
            </Box>
        );
    }

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
                    const response = await axios.get(`/participant/profile`);
                    setProfileData(response.data.userProfile);
                    setEditedData(response.data.userProfile);
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
                const result = await dispatch(updateProAvatar(formData))
                if ((result as ApiResult)?.status === 200) {
                    const response = await axios.get(`/participant/profile`);
                    setProfileData(response.data.userProfile);
                    setEditedData(response.data.userProfile);
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



    return (
        <Box sx={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            py: 4,
            px: 2
        }}>
            {/* Floating Action Buttons */}
            <Fab
                color="primary"
                sx={{ position: 'fixed', bottom: 24, right: 24 }}
                onClick={() => setEditDialogOpen(true)}
            >
                <Edit />
            </Fab>

            {/* <Fab 
        color="secondary" 
        sx={{ position: 'fixed', bottom: 24, right: 90 }}
      >
        <Share />
      </Fab> */}

            <Box sx={{ maxWidth: 800, margin: 'auto' }}>
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
                {/* Main Profile Card */}
                <Card sx={{
                    borderRadius: 4,
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
                    overflow: 'visible',
                    mb: 3
                }}>
                    {/* Profile Header */}
                    <Box sx={{
                        height: 160,
                        background: `linear-gradient(45deg, rgba(255,255,255,0.2), rgba(255,255,255,0.1)), url(${profileData.cover.url})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                        position: 'relative',
                        '&:hover .edit-cover-btn': {
                            opacity: 1,
                            transform: 'translateY(0)'
                        }
                    }}>
                        {/* Cover Edit Button */}
                        <IconButton
                            className="edit-cover-btn"
                            sx={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                backgroundColor: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                // opacity: 0,
                                transform: 'translateY(-10px)',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                    backgroundColor: 'rgba(0,0,0,0.8)',
                                },
                                opacity: coverloading ? 0.5 : 1

                            }}
                            disabled={coverloading}

                            onClick={triggerCoverInput}
                        >
                            {coverloading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <EditIcon fontSize="small" />}
                        </IconButton>
                        <Typography sx={{
                            position: 'absolute',
                            top: 10,
                            right: 16,
                            zIndex: 2
                        }} color="red" fontSize={12} fontWeight={600}>
                            {covererror}
                        </Typography>
                        {/* Avatar Container */}
                        <Box sx={{
                            position: 'absolute',
                            bottom: -50,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            '&:hover .edit-avatar-btn': {
                                opacity: 1,
                            }
                        }}>
                            <Avatar
                                src={profileData.avatar.url}
                                sx={{
                                    width: 100,
                                    height: 100,
                                    border: '4px solid rgba(255,255,255,0.3)',
                                    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                                    position: 'relative'
                                }}
                            />

                            {/* Avatar Edit Button */}
                            <IconButton
                                className="edit-avatar-btn"
                                sx={{
                                    position: 'absolute',
                                    bottom: 4,
                                    right: 4,
                                    backgroundColor: 'primary.main',
                                    color: 'white',
                                    width: 32,
                                    height: 32,
                                    opacity: 0,
                                    transition: 'all 0.3s ease',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                    '& .MuiSvgIcon-root': {
                                        fontSize: 16
                                    }
                                }}
                                onClick={triggerAvatarInput}

                            >
                                {picloading ? <CircularProgress size={20} sx={{ color: 'white' }} /> : <EditIcon fontSize="small" />}
                            </IconButton>
                        </Box>
                    </Box>

                    {/* Profile Content */}
                    <Box sx={{ p: 3, mt: 6, textAlign: 'center' }}>
                        {/* Name and Badges */}
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
                            <Typography variant="h5" fontWeight="bold" color="white" sx={{ mr: 1 }}>
                                {profileData.name}
                            </Typography>
                            {profileData.isVerified && (
                                <Verified sx={{ color: '#00ff88', fontSize: 20 }} />
                            )}
                        </Box>

                        <Typography variant="body2" color="rgba(255,255,255,0.8)" gutterBottom>
                            {profileData.username}
                        </Typography>

                        {/* Status Chips */}
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, my: 2 }}>
                            <Chip
                                label={profileData.role}
                                size="small"
                                sx={{
                                    textTransform: "capitalize",
                                    background: 'rgba(255,255,255,0.2)',
                                    color: 'white',
                                    backdropFilter: 'blur(10px)'
                                }}
                            />
                            <Chip
                                label={profileData.status}
                                size="small"
                                sx={{
                                    textTransform: "capitalize",

                                    background: profileData.status === 'active' ? 'rgba(0,255,136,0.3)' : 'rgba(255,255,255,0.2)',
                                    color: 'white'
                                }}
                            />
                        </Box>

                        {/* Stats */}
                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'space-around',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: 3,
                            p: 2,
                            mb: 3,
                            backdropFilter: 'blur(10px)'
                        }}>
                            <Box textAlign="center">
                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Star sx={{ color: '#ffd700', mr: 0.5, fontSize: 20 }} />
                                    <Typography variant="h6" color="white" fontWeight="bold">
                                        {profileData.rewardPoints}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                    Points
                                </Typography>
                            </Box>

                            <Box textAlign="center">
                                <Typography variant="h6" color="white" fontWeight="bold">
                                    {profileData.referralCount}
                                </Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                    Referrals
                                </Typography>
                            </Box>

                            <Box textAlign="center">
                                <Typography variant="h6" color="white" fontWeight="bold">
                                    {profileData.referralCode}
                                </Typography>
                                <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                    Referral Code
                                </Typography>
                            </Box>
                        </Box>

                        {/* Contact Info */}
                        <Box sx={{ textAlign: 'left' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Email sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: 20 }} />
                                <Typography variant="body2" color="white">
                                    {profileData.email}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Phone sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: 20 }} />
                                <Typography variant="body2" color="white">
                                    {profileData.number}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <LocationOn sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: 20 }} />
                                <Typography variant="body2" color="white">
                                    {profileData.address}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Person sx={{ color: 'rgba(255,255,255,0.7)', mr: 2, fontSize: 20 }} />
                                <Typography variant="body2" color="white">
                                    {profileData.gender}
                                </Typography>
                            </Box>

                            {profileData.referredBy && (
                                <Box sx={{
                                    background: 'rgba(255,255,255,0.1)',
                                    borderRadius: 2,
                                    p: 2,
                                    mt: 2
                                }}>
                                    <Typography variant="caption" color="rgba(255,255,255,0.7)">
                                        Referred by
                                    </Typography>
                                    <Typography variant="body2" color="white" fontWeight="medium">
                                        {profileData.referredBy.name}
                                    </Typography>
                                </Box>
                            )}
                        </Box>
                    </Box>
                </Card>

                {/* Edit Dialog */}
                <Dialog
                    open={editDialogOpen}
                    onClose={() => setEditDialogOpen(false)}
                    maxWidth="sm"
                    fullWidth
                >
                    <DialogTitle sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white'
                    }}>
                        Edit Profile
                    </DialogTitle>
                    <DialogContent sx={{ pt: 3 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} mt={2}>
                                <TextField
                                    label="Full Name"
                                    value={editedData.name || ''}
                                    onChange={(e) => handleChange('name', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Username"
                                    value={editedData.username || ''}
                                    onChange={(e) => handleChange('username', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Email"
                                    type="email"
                                    value={editedData.email || ''}
                                    onChange={(e) => handleChange('email', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Phone"
                                    value={editedData.number || ''}
                                    onChange={(e) => handleChange('number', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Gender"
                                    select
                                    value={editedData.gender || ''}
                                    onChange={(e) => handleChange('gender', e.target.value)}
                                    fullWidth
                                    SelectProps={{ native: true }}
                                >
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Address"
                                    multiline
                                    rows={2}
                                    value={editedData.address || ''}
                                    onChange={(e) => handleChange('address', e.target.value)}
                                    fullWidth
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setEditDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant="contained"
                            sx={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            }}
                        >
                            Save Changes
                        </Button>
                    </DialogActions>
                </Dialog>
            </Box>
        </Box>
    );
}