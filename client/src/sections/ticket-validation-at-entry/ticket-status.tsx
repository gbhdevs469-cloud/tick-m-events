import { Box, Button, Card, Divider, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import BlockIcon from '@mui/icons-material/Block';
import RefreshIcon from '@mui/icons-material/Refresh';
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

interface Order {
    _id: string;
    eventId: string;
    userId: string;
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    verifyEntry: boolean;
    ticketCode: string;
    createdAt: string;
    qrCode?: string | null;
    validation?: any
}

interface TicketsStatusProps {
    participant: Order | null;
    order: Order | null;
    isPaymentConfirmed: boolean;
}

export function TicketsStatus({ participant, order, isPaymentConfirmed }: TicketsStatusProps) {
    const [status, setStatus] = useState<'pending' | 'validated' | 'denied' | 'select-participant'>('select-participant');
    const [showRetry, setShowRetry] = useState(false);

    useEffect(() => {
        // Reset status when order changes
        if (!order) {
            setStatus('select-participant');
            setShowRetry(false);
            return;
        }

        // Check payment status first - IMMEDIATE DENIED if payment not confirmed
        if (!isPaymentConfirmed) {
            setStatus('denied');
            setShowRetry(true);
            return;
        }

        // If payment is confirmed but no participant selected yet
        if (!participant) {
            setStatus('select-participant');
            setShowRetry(false);
            return;
        }

        // If payment is confirmed and participant is selected, check validation status
        if (participant.validation) {
            setStatus('validated');
            setShowRetry(false);
        } else {
            setStatus('pending');
            setShowRetry(false);
        }
    }, [participant, order, isPaymentConfirmed]);

    const handleRetry = () => {
        // Simulate retry logic - in real app, you would call an API here
        setStatus('pending');
        setShowRetry(false);

        // Simulate validation after retry
        setTimeout(() => {
            if (order && !isPaymentConfirmed) {
                setStatus('denied');
                setShowRetry(true);
            } else if (participant) {
                setStatus(participant.validation ? 'validated' : 'pending');
            }
        }, 2000);
    };

    if (!order) {
        return (
            <Card sx={{ p: 2, marginTop: 2, borderRadius: "12px", flex: 1, boxShadow: 3 }}>
                <HeadingCommon variant="body1" title="Ticket Status" weight={600} />
                <HeadingCommon variant="body2" mt={2} title="Please select an event and order to view ticket status." color="text.secondary" weight={600} baseSize="14px" />
            </Card>
        );
    }

    const statusConfig = {
        'select-participant': {
            color: "#1976d2",
            icon: <PendingIcon fontSize="large" color="info" />,
            title: "Select Participant",
            message: "Please select a participant to validate ticket."
        },
        pending: {
            color: "orange",
            icon: <PendingIcon fontSize="large" color="warning" />,
            title: "Pending",
            message: "In validation process, please wait."
        },
        validated: {
            color: "green",
            icon: <CheckCircleIcon fontSize="large" color="success" />,
            title: "Validated",
            message: "Your ticket has been successfully scanned, you may enter."
        },
        denied: {
            color: "red",
            icon: <BlockIcon fontSize="large" color="error" />,
            title: "Denied",
            message: !isPaymentConfirmed 
                ? "Payment not confirmed. Ticket validation denied." 
                : "Ticket already used or invalid."
        }
    };

    return (
        <Card sx={{ p: 2, marginTop: 2, borderRadius: "12px", flex: 1, boxShadow: 3 }}>
            <Typography fontWeight={600} fontSize={{ xs: "18px", sm: "22px", md: "26px" }}>
                Ticket Status
            </Typography>
            <Divider sx={{ border: "1px solid #C3C3C3", my: 2 }} />

            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    textAlign: 'center',
                    mb: 2
                }}
            >
                {statusConfig[status].icon}

                <Typography
                    fontWeight={600}
                    color={statusConfig[status].color}
                    fontSize={{ xs: "18px", sm: "22px", md: "26px" }}
                    mt={1}
                >
                    {statusConfig[status].title}
                </Typography>

                <Typography
                    variant="body2"
                    fontWeight={400}
                    fontSize={{ xs: "12px", sm: "14px", md: "16px" }}
                    mt={1}
                    mb={2}
                >
                    {statusConfig[status].message}
                </Typography>

                {showRetry && (
                    <Button
                        fullWidth
                        variant="contained"
                        startIcon={<RefreshIcon />}
                        onClick={handleRetry}
                        sx={{
                            mt: 2,
                            backgroundColor: "#0B2E4C",
                            color: "white",
                            py: 1.5,
                            maxWidth: 200
                        }}
                    >
                        Retry Validation
                    </Button>
                )}
            </Box>
        </Card>
    );
}