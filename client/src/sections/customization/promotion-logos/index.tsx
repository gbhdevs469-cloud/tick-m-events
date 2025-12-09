import React, { useState, useEffect, useCallback } from 'react';
import {
    Typography, Box, Paper, Grid, Card, CardMedia, CardContent, CardActions, Button,
    TextField, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar, Alert,
    CircularProgress, FormControl, FormLabel, Chip, Divider
} from "@mui/material";
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Link as LinkIcon,
    CloudUpload as CloudUploadIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/redux/store';
import { addPromotionLogo, deletePromotionLogo, editPromotionLogo, getPromotionLogo } from 'src/redux/actions/customization/promotion-logo';



// TypeScript Interfaces
interface LogoImage {
    public_id: string;
    url: string;
    format: string;
    bytes: number;
    width: number;
    height: number;
}

interface Logo {
    _id: string;
    name: string;
    image: LogoImage;
    link: string;
    isActive: boolean;
    uploadedBy: string;
    createdAt: string;
    updatedAt: string;
}

interface LogoFormData {
    name: string;
    link: string;
    logo: File | null;
}

interface LogoErrors {
    name?: string;
    link?: string;
    logo?: string;
}

interface SnackbarState {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'warning' | 'info';
}

export function PromotionLogos(): JSX.Element {
    const dispatch = useDispatch<AppDispatch>()
    const { promotionLogos, loading } = useSelector((state: RootState) => state.customization);
    const [uploading, setUploading] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [editingLogo, setEditingLogo] = useState<Logo | null>(null);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success'
    });
    const [formData, setFormData] = useState<LogoFormData>({
        name: '',
        link: '',
        logo: null
    });
    const [errors, setErrors] = useState<LogoErrors>({});

    // Form validation
    const validateForm = (): boolean => {
        const newErrors: LogoErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Logo name is required';
        }

        if (!formData.link.trim()) {
            newErrors.link = 'Link is required';
        } else if (!isValidUrl(formData.link)) {
            newErrors.link = 'Please enter a valid URL';
        }

        if (!editingLogo && !formData.logo) {
            newErrors.logo = 'Logo image is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (string: string): boolean => {
        try {
            // Fixed: Using URL constructor without 'new' for side effects
            const url = new URL(string);
            return !!url;
        } catch (_) {
            return false;
        }
    };

    // Handle form input changes
    const handleInputChange = (field: keyof LogoFormData, value: string): void => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    // Handle file upload
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setErrors(prev => ({
                    ...prev,
                    logo: 'Invalid file type. Please upload PNG, JPEG, SVG, or WebP'
                }));
                return;
            }

            // Validate file size (2MB)
            if (file.size > 2 * 1024 * 1024) {
                setErrors(prev => ({
                    ...prev,
                    logo: 'File size too large. Maximum size is 2MB'
                }));
                return;
            }

            setFormData(prev => ({
                ...prev,
                logo: file
            }));

            if (errors.logo) {
                setErrors(prev => ({
                    ...prev,
                    logo: ''
                }));
            }
        }
    };

    // Create or update logo
    const handleSubmit = async (event: React.FormEvent): Promise<void> => {
        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        setUploading(true);
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('link', formData.link);
            if (formData.logo) {
                submitData.append('logo', formData.logo);
            }

            const response = editingLogo ? await dispatch(editPromotionLogo(submitData, editingLogo._id)) : await dispatch(addPromotionLogo(submitData))
            if (response.status === 201) {
                showSnackbar(
                    editingLogo ? 'Logo updated successfully' : 'Logo uploaded successfully',
                    'success'
                );
                setOpenDialog(false)
                resetForm();
            } else {
                showSnackbar(response.message || 'Operation failed', 'error');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            showSnackbar(`Error: ${errorMessage}`, 'error');
        } finally {
            setUploading(false);
        }
    };

    // Delete logo
    const handleDelete = async (logoId: string): Promise<void> => {
        if (!window.confirm('Are you sure you want to delete this logo?')) {
            return;
        }

        try {
            const response = await dispatch(deletePromotionLogo(logoId));

            if (response.status === 200) {
                showSnackbar('Logo deleted successfully', 'success');

            } else {
                showSnackbar(response.message || 'Delete failed', 'error');
            }
        } catch (error) {
            // Fixed: Using template literal instead of string concatenation
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            showSnackbar(`Error deleting logo: ${errorMessage}`, 'error');
        }
    };

    // Edit logo
    const handleEdit = (logo: Logo): void => {
        setEditingLogo(logo);
        setFormData({
            name: logo.name,
            link: logo.link,
            logo: null // Don't pre-fill file input for security reasons
        });
        setOpenDialog(true);
    };

    // Reset form
    const resetForm = (): void => {
        setFormData({
            name: '',
            link: '',
            logo: null
        });
        setEditingLogo(null);
        setErrors({});
        setOpenDialog(false);
    };

    const showSnackbar = (message: string, severity: SnackbarState['severity']): void => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = (): void => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    useEffect(() => {
        dispatch(getPromotionLogo())
    }, [dispatch]); // Fixed: Added fetchLogos to dependency array

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" gutterBottom fontWeight="bold">
                    Promotion Logos Management
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Upload and manage promotional logos with associated links
                </Typography>
            </Box>

            {/* Add Logo Button */}
            <Box sx={{ mb: 3 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mb: 2 }}
                >
                    Add New Logo
                </Button>
            </Box>

            {/* Logos Grid */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {promotionLogos.length === 0 ? (
                        <Grid item xs={12}>
                            <Paper sx={{ p: 4, textAlign: 'center' }}>
                                <Typography variant="h6" color="text.secondary">
                                    No logos found. Upload your first promotional logo!
                                </Typography>
                            </Paper>
                        </Grid>
                    ) : (
                        promotionLogos?.map((logo: any) => (
                            <Grid item xs={12} sm={6} md={4} key={logo._id}>
                                <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                    {/* Logo Image */}
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={logo.image.url}
                                        alt={logo.name}
                                        sx={{
                                            objectFit: 'contain',
                                            p: 2,
                                            backgroundColor: '#f5f5f5'
                                        }}
                                    />

                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" gutterBottom noWrap>
                                            {logo.name}
                                        </Typography>

                                        <Box sx={{ mb: 1 }}>
                                            <Chip
                                                icon={<LinkIcon />}
                                                label="Link"
                                                variant="outlined"
                                                size="small"
                                                sx={{ mb: 1 }}
                                            />
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            color="primary"
                                            noWrap
                                            sx={{
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            {logo.link}
                                        </Typography>

                                        <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                                            {`Uploaded: ${new Date(logo.createdAt).toLocaleDateString()}`}
                                        </Typography>
                                    </CardContent>

                                    <Divider />

                                    <CardActions>
                                        <Button
                                            size="small"
                                            startIcon={<EditIcon />}
                                            onClick={() => handleEdit(logo)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="small"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            onClick={() => handleDelete(logo._id)}
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))
                    )}
                </Grid>
            )}

            {/* Add/Edit Logo Dialog */}
            <Dialog
                open={openDialog}
                onClose={resetForm}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {editingLogo ? 'Edit Logo' : 'Upload New Logo'}
                </DialogTitle>

                <form onSubmit={handleSubmit} encType='multipart/form-data'>
                    <DialogContent>
                        <Grid container spacing={2}>
                            {/* Logo Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Logo Name"
                                    value={formData.name}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange('name', e.target.value)
                                    }
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    required
                                />
                            </Grid>

                            {/* Logo Link */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Logo Link"
                                    value={formData.link}
                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                        handleInputChange('link', e.target.value)
                                    }
                                    error={!!errors.link}
                                    helperText={errors.link}
                                    placeholder="https://example.com"
                                    required
                                />
                            </Grid>

                            {/* Logo Upload */}
                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.logo}>
                                    <FormLabel component="legend">
                                        {`Logo Image ${!editingLogo ? '*' : ''}`}
                                    </FormLabel>
                                    <Button
                                        variant="outlined"
                                        component="label"
                                        startIcon={<CloudUploadIcon />}
                                        sx={{ mt: 1 }}
                                        fullWidth
                                    >
                                        {formData.logo ? formData.logo.name : 'Choose Logo File'}
                                        <input
                                            type="file"
                                            hidden
                                            accept="image/png, image/jpeg, image/jpg, image/svg+xml, image/webp"
                                            onChange={handleFileChange}
                                        />
                                    </Button>
                                    {errors.logo && (
                                        <Typography variant="caption" color="error" sx={{ mt: 1, display: 'block' }}>
                                            {errors.logo}
                                        </Typography>
                                    )}
                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                        Supported formats: PNG, JPEG, JPG, SVG, WebP | Max size: 2MB
                                    </Typography>
                                </FormControl>
                            </Grid>

                            {/* Preview for new uploads */}
                            {formData.logo && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Preview:
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={URL.createObjectURL(formData.logo)}
                                        alt="Preview"
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: 150,
                                            objectFit: 'contain',
                                            border: '1px solid #ddd',
                                            borderRadius: 1,
                                            p: 1
                                        }}
                                    />
                                </Grid>
                            )}

                            {/* Preview for existing logo when editing */}
                            {editingLogo && !formData.logo && (
                                <Grid item xs={12}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Current Logo:
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={editingLogo.image.url}
                                        alt={editingLogo.name}
                                        sx={{
                                            maxWidth: '100%',
                                            maxHeight: 150,
                                            objectFit: 'contain',
                                            border: '1px solid #ddd',
                                            borderRadius: 1,
                                            p: 1
                                        }}
                                    />
                                </Grid>
                            )}
                        </Grid>
                    </DialogContent>

                    <DialogActions>
                        <Button onClick={resetForm} disabled={uploading}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="contained"
                            disabled={uploading}
                            startIcon={uploading ? <CircularProgress size={16} /> : null}
                        >
                            {uploading ? 'Processing...' : (editingLogo ? 'Update' : 'Upload')}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    variant="filled"
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}