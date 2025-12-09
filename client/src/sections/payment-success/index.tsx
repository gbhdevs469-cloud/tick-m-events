import { Box, Typography, Button, Card, CardContent, CircularProgress, Alert, Paper } from "@mui/material";
import { CheckCircle, Pending, Error, Home, Refresh, Payment } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { checkPayConStat } from "src/redux/actions/contactpayment/contact-payment";
import { AppDispatch } from "src/redux/store";
import { DashboardContent } from "src/layouts/dashboard";

export function PaymentSuccess() {
    const [status, setStatus] = useState<'checking' | 'successful' | 'pending' | 'failed' | 'expired' | 'invalid'>('checking');
    const [payData, setPayData] = useState<any>()
    const location = useLocation();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkPaymentStatus = async () => {
            const urlParams = new URLSearchParams(location.search);
            const transactionId = urlParams.get('transId') || localStorage.getItem('currentTransactionId');

            if (transactionId) {
                try {
                    const result = await dispatch(checkPayConStat(transactionId));
                    setStatus(result.data.status as any);
                    setPayData(result.data);
                    localStorage.removeItem('currentTransactionId');
                } catch (error) {
                    setStatus('error' as any);
                    console.error('Status check failed:', error);
                } finally {
                    setLoading(false);
                }
            } else {
                setStatus('invalid');
                setLoading(false);
            }
        };

        checkPaymentStatus();
    }, [location, dispatch]);

    const StatusCard = ({
        icon,
        title,
        message,
        severity = "info",
        actions
    }: {
        icon: React.ReactNode;
        title: string;
        message: string;
        severity?: "success" | "error" | "warning" | "info";
        actions?: React.ReactNode;
    }) => (
        <Card
            elevation={3}
            sx={{
                maxWidth: 500,
                mx: 'auto',
                mt: 4,
                border: 1,
                borderColor: severity === 'success' ? 'success.main' :
                    severity === 'error' ? 'error.main' :
                        severity === 'warning' ? 'warning.main' : 'info.main'
            }}
        >
            <CardContent sx={{ textAlign: 'center', py: 4 }}>
                <Box sx={{ color: `${severity}.main`, mb: 2 }}>
                    {icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom fontWeight="bold">
                    {title}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                    {message}
                </Typography>
                {actions && (
                    <Box sx={{ mt: 2 }}>
                        {actions}
                    </Box>
                )}
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '60vh',
                    textAlign: 'center'
                }}
            >
                <CircularProgress size={60} thickness={4} sx={{ mb: 3, color: 'primary.main' }} />
                <Typography variant="h4" component="h1" gutterBottom fontWeight="medium">
                    Verifying Payment
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Please wait while we confirm your payment status...
                </Typography>
            </Box>
        );
    }

    return (
        <DashboardContent>
            <Box sx={{ py: 4, px: 2, minHeight: '80vh' }}>
                <Paper
                    elevation={0}
                    sx={{
                        maxWidth: 800,
                        mx: 'auto',
                        p: 4,
                        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
                    }}
                >
                    <Typography
                        variant="h3"
                        component="h1"
                        align="center"
                        gutterBottom
                        fontWeight="bold"
                        sx={{
                            background: 'linear-gradient(45deg, #1976d2 30%, #21CBF3 90%)',
                            backgroundClip: 'text',
                            WebkitBackgroundClip: 'text',
                            color: 'transparent',
                            mb: 1
                        }}
                    >
                        Payment Status
                    </Typography>

                    <Typography
                        variant="h6"
                        align="center"
                        color="text.secondary"
                        sx={{ mb: 4 }}
                    >
                        Transaction Overview
                    </Typography>

                    {status === 'successful' && (
                        <StatusCard
                            icon={<CheckCircle sx={{ fontSize: 80 }} />}
                            title="Payment Successful!"
                            message={`Thank you for your payment of ${payData.amount || 0} ${payData.currency || 'XAF'}. Our team will contact you shortly to discuss your requirements.`}
                            severity="success"
                            actions={
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Home />}
                                        onClick={() => navigate('/')}
                                        sx={{ px: 4 }}
                                    >
                                        Return Home
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/contact')}
                                    >
                                        Contact Again
                                    </Button>
                                </Box>
                            }
                        />
                    )}

                    {status === 'pending' && (
                        <StatusCard
                            icon={<Pending sx={{ fontSize: 80 }} />}
                            title="Payment Processing"
                            message="Your payment is being processed. This may take a few minutes. You'll receive a confirmation email once it's completed."
                            severity="warning"
                            actions={
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Refresh />}
                                        onClick={() => window.location.reload()}
                                        sx={{ px: 4 }}
                                    >
                                        Refresh Status
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/')}
                                    >
                                        Go Home
                                    </Button>
                                </Box>
                            }
                        />
                    )}

                    {(status === 'failed' || status === 'expired') && (
                        <StatusCard
                            icon={<Error sx={{ fontSize: 80 }} />}
                            title="Payment Not Completed"
                            message="Your payment could not be processed. Please try again or contact support if the issue persists."
                            severity="error"
                            actions={
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Payment />}
                                        onClick={() => navigate('/contact')}
                                        sx={{ px: 4 }}
                                    >
                                        Try Payment Again
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/')}
                                    >
                                        Return Home
                                    </Button>
                                </Box>
                            }
                        />
                    )}

                    {status === 'invalid' && (
                        <StatusCard
                            icon={<Error sx={{ fontSize: 80 }} />}
                            title="Invalid Transaction"
                            message="No valid payment transaction found. Please initiate a new payment to continue."
                            severity="error"
                            actions={
                                <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        startIcon={<Payment />}
                                        onClick={() => navigate('/contact')}
                                        sx={{ px: 4 }}
                                    >
                                        Make New Payment
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => navigate('/')}
                                    >
                                        Go to Homepage
                                    </Button>
                                </Box>
                            }
                        />
                    )}

                    {/* Additional Information Section */}
                    <Box sx={{ mt: 4, textAlign: 'center' }}>
                        <Alert severity="info" sx={{ maxWidth: 500, mx: 'auto' }}>
                            <Typography variant="body2">
                                Need help? Contact our support team at support@yourcompany.com
                            </Typography>
                        </Alert>
                    </Box>
                </Paper>
            </Box>
        </DashboardContent>
    );
}