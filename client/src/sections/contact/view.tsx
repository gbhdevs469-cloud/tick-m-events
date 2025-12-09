import { useState } from 'react';
import {
    Grid,
    Box,
    Typography,
    TextField,
    Button,
    IconButton, Tooltip
} from '@mui/material';

import Header from 'src/components/Header';
import { Iconify } from 'src/components/iconify';

import axios from '../../redux/helper/axios';

interface SubmitStatus {
    success: boolean;
    message: string;
}

export function Contact() {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<SubmitStatus | null>(null);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const response = await axios.post('/contact', formData);
            setSubmitStatus({
                success: true,
                message: response.data.message
            });
            setFormData({ name: '', email: '', message: '' }); // Reset form
        } catch (error) {
            console.log(error);

            setSubmitStatus({
                success: false,
                message: error.response?.data?.message || 'Failed to submit form'
            });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <Header />
            <Box
                sx={{
                    height: '100vh',
                    backgroundColor: '#f5f5f5',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    px: 3,
                }}
            >
                <Grid
                    container
                    spacing={4}
                    sx={{
                        maxWidth: '1000px',
                        backgroundColor: '#ffffff',
                        borderRadius: 2,
                        boxShadow: 3,
                        p: 5,
                    }}
                >
                    {/* Left Section */}
                    <Grid item xs={12} md={6}>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 'bold',
                                color: '#333333',
                                mb: 2,
                            }}
                        >
                            Contact Us
                        </Typography>
                        <Typography fontSize={{ sm: 14, md: 16 }}>
                            Office Address: <span style={{ color: "#73BAFB" }}>Douala - Nyalla Cobblestone Street,</span>
                        </Typography>
                        <Typography fontSize={{ sm: 14, md: 16 }} color="text.secondary">before the ZZ Hotel.</Typography>
                        <Typography sx={{ mb: 3 }} fontSize={{ sm: 14, md: 16 }}>
                            Phone number: <span style={{ color: "#73BAFB" }}>+237 697 182 551</span>
                        </Typography>
                        <Box sx={{ display: "flex", gap: 2 }}>
                            {/* Email */}
                            <Tooltip title="Email: tickmevents@gmail.com">
                                <IconButton
                                    sx={{ color: "black" }}
                                    onClick={() => window.open('mailto:tickmevents@gmail.com')}
                                >
                                    <Iconify width={24} icon="ic:outline-email" />
                                </IconButton>
                            </Tooltip>

                            {/* Fax */}
                            <Tooltip title="Fax: +237 652 590 797">
                                <IconButton
                                    sx={{ color: "black" }}
                                    onClick={() => window.open('tel:+237652590797', '_blank')}
                                >
                                    <Iconify width={24} icon="emojione-monotone:fax-machine" />
                                </IconButton>
                            </Tooltip>

                            {/* WhatsApp */}
                            <Tooltip title="WhatsApp: +237 697 182 551">
                                <IconButton
                                    sx={{ color: "black" }}
                                    onClick={() => window.open('https://wa.me/237697182551', '_blank')}
                                >
                                    <Iconify width={24} icon="ic:baseline-whatsapp" />
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Grid>

                    {/* Right Section - Form */}
                    <Grid item xs={12} md={6}>
                        <Typography
                            sx={{
                                color: '#555555',
                                mb: 3,
                            }}
                        >
                            Great vision without great people is irrelevant. Let’s work together.
                        </Typography>

                        <Box component="form" noValidate onSubmit={handleSubmit}>
                            <TextField
                                fullWidth
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Enter your Name"
                                size="small"
                                sx={{ mb: 2, backgroundColor: '#fff' }}
                                required
                            />
                            <TextField
                                fullWidth
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Enter a valid email address"
                                type="email"
                                size="small"
                                sx={{ mb: 2, backgroundColor: '#fff' }}
                                required
                            />
                            <TextField
                                fullWidth
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                variant="outlined"
                                placeholder="Enter your message"
                                multiline
                                rows={4}
                                sx={{ mb: 2, backgroundColor: '#fff' }}
                                required
                            />

                            {submitStatus && (
                                <Box sx={{
                                    mb: 2,
                                    color: submitStatus.success ? 'success.main' : 'error.main'
                                }}>
                                    {submitStatus.message}
                                </Box>
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                fullWidth
                                disabled={submitting}
                                sx={{
                                    backgroundColor: '#3CB1F1',
                                    color: '#000',
                                    '&:hover': {
                                        backgroundColor: '#c5a359',
                                    },
                                }}
                            >
                                {submitting ? 'Submitting' : 'Submit'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
}
