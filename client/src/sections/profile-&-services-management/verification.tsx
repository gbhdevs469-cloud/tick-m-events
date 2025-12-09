import { useEffect, useState, useCallback } from 'react';
import { Box, Button, Grid, Stack, Typography, Modal, TextField, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import type { E164Number } from 'libphonenumber-js';
import PhoneInput from 'react-phone-number-input'

import { RootState } from 'src/redux/store';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import axios from 'src/redux/helper/axios';

interface VerificationItem {
    label: string;
    status: boolean;
    type: 'email' | 'whatsapp' | 'identity' | 'payment';
    disabled: boolean;
    verify: string;
    detail?: string;
}

export function ProfileVerification() {
    const { number, email } = useSelector((state: RootState) => state?.auth?.user);

    const [verifications, setVerifications] = useState<VerificationItem[]>([
        { label: "Email Verified", status: false, verify: '', type: "email", disabled: false },
        { label: "WhatsApp Verified", status: false, verify: '', type: "whatsapp", disabled: true },
        { label: "Identity Verified", status: false, verify: '', type: "identity", disabled: true },
        // { label: "Payment Verified", status: false, verify: '', type: "payment", disabled: true },
    ]);
    const [documentType, setDocumentType] = useState('');
    const [identityFile, setIdentityFile] = useState<File | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [currentVerification, setCurrentVerification] = useState<VerificationItem | null>(null);
    const [otp, setOtp] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(number || '');
    const [country, setCountry] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const handleVerificationClick = (item: VerificationItem) => {
        if (item.disabled) return;
        setCurrentVerification(item);
        setOpenModal(true);
    };

    const updateVerificationStatus = (type: VerificationItem['type'], status: boolean) => {
        const updated = verifications.map(v => {
            if (v.type === type) {
                return { ...v, status };
            }
            // Enable the next verification step if current one is completed
            if (status && type === 'email' && v.type === 'whatsapp') {
                return { ...v, disabled: false };
            }
            if (status && type === 'whatsapp' && v.type === 'identity') {
                return { ...v, disabled: false };
            }
            if (status && type === 'identity' && v.type === 'payment') {
                return { ...v, disabled: false };
            }
            return v;
        });
        setVerifications(updated);
    };

    const handleVerifyEmail = async () => {
        try {
            await axios.post('/verification/send-email-otp');
            toast.success('OTP sent to your email');
        } catch (error) {
            toast.error('Failed to send OTP');
        }
    };

    const fetchVerificationStatus = useCallback(async () => {
        try {
            const response = await axios.get('/verification');
            const {
                emailVerified,
                identityStatus,
                whatsappVerified,
                identityVerified,
                // paymentVerified
            } = response.data;

            setVerifications([
                {
                    label: "Email Verified",
                    status: emailVerified,
                    type: "email",
                    verify: '',
                    disabled: false
                },
                {
                    label: "WhatsApp Verified",
                    status: whatsappVerified,
                    type: "whatsapp",
                    verify: '',
                    disabled: !emailVerified
                },
                {
                    label: "Identity Verified",
                    status: identityVerified,
                    verify: identityStatus,
                    type: "identity",
                    disabled: !whatsappVerified
                },
                // {
                //     label: "Payment Verified",
                //     status: paymentVerified,
                //     type: "payment",
                //     verify: '',
                //     disabled: !identityVerified
                // },
            ]);
        } catch (error) {
            console.error('Failed to fetch verification status:', error);
            toast.error('Failed to load verification status');
        }
    }, []); // Empty dependency array means this callback never changes

    useEffect(() => {
        fetchVerificationStatus();
    }, [fetchVerificationStatus]); // Now stable between renders

    const handleSubmitOtp = async () => {
        try {
            const response = await axios.post('/verification/verify-email', { otp });
            if (response.data.success) {
                updateVerificationStatus('email', true);
                toast.success('Email verified successfully');
                setOpenModal(false);
                setOtp('')
            }
        } catch (error) {
            toast.error('Invalid OTP');
        }
    };

    const handleWhatsAppVerification = async () => {
        try {
            const response = await axios.post('/verification/send-whatsapp-otp', { phoneNumber });
            if (response.data.success) {
                toast.success('OTP sent to your WhatsApp');
            }
        } catch (error) {
            toast.error('Failed to send OTP to WhatsApp');
        }
    };

    const handleWhatsAppOtpSubmit = async () => {
        try {
            const response = await axios.post('/verification/verify-whatsapp-otp', { otp });
            if (response.data.success) {
                updateVerificationStatus('whatsapp', true);
                toast.success('WhatsApp verified successfully');
                setOpenModal(false);
            }
        } catch (error) {
            toast.error('Invalid OTP');
        }
    };

    const handleIdentityUpload = async () => {
        if (!identityFile || !documentType) return;

        const formData = new FormData();
        formData.append('identity', identityFile);
        formData.append('type', documentType);
        try {
            const response = await axios.post('/verification/verify-identity', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (response.data.success) {
                toast.success('Identity submitted for verification');
                setOpenModal(false);
                // Refresh verification status immediately after success
                await fetchVerificationStatus();
            }
        } catch (error) {
            toast.error('Failed to upload identity');
        }
    };

    // const handlePaymentVerification = async () => {
    //     if (!country || !paymentMethod) {
    //         toast.error('Please select country and payment method');
    //         return;
    //     }

    //     try {
    //         const response = await axios.post('/verification/verify-payment', { country, paymentMethod });
    //         if (response.data.success) {
    //             updateVerificationStatus('payment', true);
    //             toast.success('Payment method verified successfully');
    //             setOpenModal(false);
    //         }
    //     } catch (error) {
    //         toast.error('Payment verification failed');
    //     }
    // };

    // const getPaymentMethods = () => {
    //     if (country === 'South Africa') {
    //         return ['Bank Transfer', 'Credit Card', 'PayFast'];
    //     }
    //     if (country === 'Cameroon') {
    //         return ['MTN Mobile Money', 'Orange Money', 'Bank Transfer'];
    //     }
    //     return [];
    // };

    const handlePhoneChange = (value: E164Number | undefined) => {
        const phoneValue = value as string; // or String(value)
        setPhoneNumber(phoneValue);
    };

    return (
        <Box sx={{ borderRadius: '20px', background: '#FFFFFF', boxShadow: '0px 0px 14px 0px #00000040', p: { xs: 2, md: 4 }, mt: 4 }}>
            <HeadingCommon weight={600} variant="h6" title="Profile Trust & Verification" />
            <HeadingCommon weight={400} variant="h6" baseSize="16px" title="Boost your credibility by completing all verification steps." />

            <Stack spacing={1.5} mb={4}>
                {verifications.map((item, index) => (
                    <Grid container alignItems="center" spacing={1} key={index} sx={{ width: '100%' }}>
                        <Grid item>
                            {item.status ? (
                                <CheckCircleIcon sx={{ color: 'green', fontSize: 20 }} />
                            ) : (
                                <CancelIcon sx={{ color: 'red', fontSize: 20 }} />
                            )}
                        </Grid>
                        <Grid item>
                            <HeadingCommon
                                weight={400}
                                variant="h6"
                                baseSize="16px"
                                title={item.label}
                                sx={{ color: item.disabled ? 'text.disabled' : 'text.primary' }}
                            />
                            {item.verify === 'pending' && (
                                <Typography variant="caption" color="text.secondary">
                                    (Verification in progress)
                                </Typography>
                            )}
                            {item.verify === 'rejected' && (
                                <Typography variant="caption" color="error">
                                    (Verification rejected)
                                </Typography>
                            )}
                        </Grid>
                        <Grid item xs={4} sm={4}>
                            {!item.status && item.verify !== 'pending' && (
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleVerificationClick(item)}
                                    disabled={item.disabled}
                                    sx={{
                                        visibility: item.verify === 'pending' ? 'hidden' : 'visible'
                                    }}
                                >
                                    {item.verify === 'rejected' ? 'Verify Again' : 'Verify'}
                                </Button>
                            )}
                        </Grid>
                        {/* {!item.status && (
                            <Grid item>
                                <Button
                                    size="small"
                                    variant="outlined"
                                    onClick={() => handleVerificationClick(item)}
                                    disabled={item.disabled}
                                >
                                    Verify
                                </Button>
                            </Grid>
                        )} */}

                    </Grid>
                ))}
            </Stack>

            <Modal open={openModal} onClose={() => setOpenModal(false)}>
                <Box sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', sm: 400 },
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    borderRadius: 2
                }}>
                    {currentVerification?.type === 'email' && (
                        <>
                            <Typography variant="h6" gutterBottom>Email Verification</Typography>
                            <Typography variant="body2" gutterBottom>
                                We&apos;ll send a verification code to your email address.
                            </Typography>
                            <Button
                                variant="contained"
                                onClick={handleVerifyEmail}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Send OTP
                            </Button>
                            <TextField
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                fullWidth
                                margin="normal"
                            />
                            <Button
                                variant="contained"
                                onClick={handleSubmitOtp}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Verify Email
                            </Button>
                        </>
                    )}

                    {currentVerification?.type === 'whatsapp' && (
                        <>
                            <Typography variant="h6" gutterBottom>WhatsApp Verification</Typography>
                            <Typography variant="body2" gutterBottom>
                                We&apos;ll send a verification code to your WhatsApp number.
                            </Typography>
                            {/* Phone Number Input with Country Code */}
                            <Box sx={{
                                '& .PhoneInput': {
                                    width: '100%',
                                    '& input': {
                                        width: '100%',
                                        padding: '16.5px 14px',
                                        border: '1px solid rgba(0, 0, 0, 0.23)',
                                        borderRadius: '4px',
                                        fontFamily: 'inherit',
                                        fontSize: '1rem',
                                        '&:hover': {
                                            borderColor: 'black',
                                        },
                                        '&:focus': {
                                            borderColor: 'black',
                                            borderWidth: '2px',
                                            outline: 'none',
                                        },
                                    },
                                    '& .PhoneInputCountry': {
                                        marginRight: '8px',
                                    },
                                    '& .PhoneInputCountrySelect': {
                                        marginRight: '8px',
                                    },
                                },
                                '& .PhoneInput--focus': {
                                    '& input': {
                                        borderColor: 'black',
                                        borderWidth: '2px',
                                    },
                                },
                            }}>
                                <PhoneInput
                                disabled
                                    international
                                    defaultCountry="US"
                                    value={phoneNumber}
                                    onChange={handlePhoneChange}
                                    placeholder="Enter phone number"
                                    sx
                                />
                            </Box>
                           
                            <Button
                                variant="contained"
                                onClick={handleWhatsAppVerification}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Send WhatsApp OTP
                            </Button>
                            <TextField
                                label="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                fullWidth
                                margin="normal"
                                sx={{ mt: 2 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handleWhatsAppOtpSubmit}
                                fullWidth
                                sx={{ mt: 2 }}
                            >
                                Verify WhatsApp
                            </Button>
                        </>
                    )}

                    {currentVerification?.type === 'identity' && (
                        <>
                            <Typography variant="h6" gutterBottom>Identity Verification</Typography>
                            <Typography variant="body2" gutterBottom>
                                Select the type of identity document and upload a clear photo or scan.
                            </Typography>

                            <FormControl fullWidth margin="normal">
                                <InputLabel id="document-type-label">Document Type</InputLabel>
                                <Select
                                    labelId="document-type-label"
                                    value={documentType}
                                    onChange={(e) => setDocumentType(e.target.value)}
                                    label="Document Type"
                                >
                                    <MenuItem value="passport">Passport</MenuItem>
                                    <MenuItem value="driving_license">Driving License</MenuItem>
                                    <MenuItem value="national_id">National ID</MenuItem>
                                </Select>
                            </FormControl>

                            <input
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setIdentityFile(e.target.files?.[0] || null)}
                                style={{ marginTop: '16px' }}
                            />
                            <Typography variant="body2" color="red" mb="16px" fontSize={10}>
                                Supported formats: PDF or image (JPEG, PNG).
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={handleIdentityUpload}
                                fullWidth
                                disabled={!identityFile || !documentType}
                            >
                                Submit for Verification
                            </Button>
                        </>
                    )}


                </Box>
            </Modal>

            <Button
                variant="contained"
                fullWidth
                sx={{
                    borderRadius: '20px',
                    backgroundColor: '#0B2E4C',
                    textTransform: 'none',
                    fontSize: { xs: 13, sm: 14, md: 16 },
                    py: 1.2,
                    '&:hover': { backgroundColor: '#0B2E4C' },
                }}
                onClick={() => {
                    const nextToVerify = verifications.find(v => !v.status && !v.disabled);
                    if (nextToVerify) {
                        handleVerificationClick(nextToVerify);
                    } else if (verifications.every(v => v.status)) {
                        toast.success('All verifications completed!');
                    } else {
                        toast.info('Please complete the previous verification steps first');
                    }
                }}
            >
                {verifications.every(v => v.status) ? 'All Verifications Complete' : 'Continue Verification'}
            </Button>
        </Box>
    );
}

// if payment verification is on so this code add line no. 386
// {
//     currentVerification?.type === 'payment' && (
//         <>
//             <Typography variant="h6" gutterBottom>Payment Verification</Typography>
//             <FormControl fullWidth margin="normal">
//                 <InputLabel>Country</InputLabel>
//                 <Select
//                     value={country}
//                     onChange={(e) => setCountry(e.target.value)}
//                     label="Country"
//                 >
//                     <MenuItem value="South Africa">South Africa</MenuItem>
//                     <MenuItem value="Cameroon">Cameroon</MenuItem>
//                 </Select>
//             </FormControl>

//             {country && (
//                 <FormControl fullWidth margin="normal">
//                     <InputLabel>Payment Method</InputLabel>
//                     <Select
//                         value={paymentMethod}
//                         onChange={(e) => setPaymentMethod(e.target.value)}
//                         label="Payment Method"
//                     >
//                         {getPaymentMethods().map(method => (
//                             <MenuItem key={method} value={method}>{method}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>
//             )}

//             <Button
//                 variant="contained"
//                 onClick={handlePaymentVerification}
//                 fullWidth
//                 sx={{ mt: 2 }}
//                 disabled={!country || !paymentMethod}
//             >
//                 Verify Payment Method
//             </Button>
//         </>
//     )
// }