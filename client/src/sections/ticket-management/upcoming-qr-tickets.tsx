import { Box, Button, Card, Typography, Paper, Chip, Grid, Divider, Stack } from '@mui/material';
import {
    Event as EventIcon,
    Person as PersonIcon,
    CalendarToday as CalendarIcon,
    Schedule as ScheduleIcon,
    LocationOn as LocationIcon,
    ConfirmationNumber as TicketIcon,
    Payment as PaymentIcon,
    QrCode as QrCodeIcon,
    CheckCircle as ValidIcon,
    Pending as PendingIcon
} from '@mui/icons-material';
import { formatDateTimeCustom, formatEventDate, formatTimeTo12Hour } from 'src/hooks/formate-time';

export function UpcomingQrTicket({ upcomingQrTicket }: any) {
    return (
        <Box sx={{ py: { xs: 2, md: 3 } }}>
            {/* Header - Improved mobile responsiveness */}
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 2, sm: 3 },
                    mb: { xs: 3, md: 4 },
                    borderRadius: { xs: 2, md: 3 },
                    background: 'linear-gradient(135deg, #0a2540 0%, #1a365d 100%)',
                    color: 'white'
                }}
            >
                <Box display="flex" alignItems="center" mb={{ xs: 1, md: 2 }} flexWrap="wrap">
                    <QrCodeIcon sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, mr: 2 }} />
                    <Typography
                        variant="h4"
                        fontWeight={700}
                        fontSize={{ xs: '1.5rem', sm: '1.75rem', md: '2rem' }}
                    >
                        Event Ticket & QR Code
                    </Typography>
                </Box>
                <Typography
                    variant="subtitle1"
                    sx={{ opacity: 0.9 }}
                    fontSize={{ xs: '0.875rem', sm: '1rem' }}
                >
                    Your digital pass for {upcomingQrTicket.eventDetails.eventName}
                </Typography>
            </Paper>

            <Grid container spacing={{ xs: 2, md: 3 }}>
                {/* Left Column - Ticket Details */}
                <Grid item xs={12} md={7}>
                    <Card
                        elevation={2}
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: { xs: 2, md: 3 },
                            height: '100%'
                        }}
                    >
                        <Typography
                            variant="h5"
                            fontWeight={600}
                            mb={3}
                            color="primary"
                            fontSize={{ xs: '1.25rem', sm: '1.5rem' }}
                        >
                            <EventIcon sx={{ verticalAlign: 'middle', mr: 1, fontSize: { xs: 20, md: 24 } }} />
                            Ticket Information
                        </Typography>

                        {/* Event Details */}
                        <Box mb={4}>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                mb={2}
                                color="text.primary"
                                fontSize={{ xs: '1.125rem', sm: '1.25rem' }}
                            >
                                {upcomingQrTicket.eventDetails.eventName}
                            </Typography>

                            <Stack spacing={{ xs: 1.5, md: 2 }} mb={3}>
                                <Box display="flex" alignItems="flex-start">
                                    <CalendarIcon sx={{
                                        mr: 1.5,
                                        color: 'primary.main',
                                        mt: 0.25,
                                        fontSize: { xs: 18, md: 20 }
                                    }} />
                                    <Typography variant="body1" fontSize={{ xs: '0.875rem', sm: '1rem' }}>
                                        {formatEventDate(upcomingQrTicket.eventDetails.date)}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="flex-start">
                                    <ScheduleIcon sx={{
                                        mr: 1.5,
                                        color: 'primary.main',
                                        mt: 0.25,
                                        fontSize: { xs: 18, md: 20 }
                                    }} />
                                    <Typography variant="body1" fontSize={{ xs: '0.875rem', sm: '1rem' }}>
                                        {formatTimeTo12Hour(upcomingQrTicket.eventDetails.time)}
                                    </Typography>
                                </Box>

                                <Box display="flex" alignItems="flex-start">
                                    <LocationIcon sx={{
                                        mr: 1.5,
                                        color: 'primary.main',
                                        mt: 0.25,
                                        fontSize: { xs: 18, md: 20 }
                                    }} />
                                    <Typography variant="body1" fontSize={{ xs: '0.875rem', sm: '1rem' }}>
                                        {upcomingQrTicket.eventDetails.location} • {upcomingQrTicket.eventDetails.format}
                                    </Typography>
                                </Box>
                            </Stack>

                            <Box display="flex" gap={1} flexWrap="wrap">
                                <Chip
                                    label={upcomingQrTicket.eventDetails.eventType}
                                    color="primary"
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                                />
                                <Chip
                                    label={upcomingQrTicket.eventDetails.status}
                                    color="success"
                                    variant="outlined"
                                    size="small"
                                    sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                                />
                            </Box>
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Participant Details */}
                        <Box mb={4}>
                            <Typography
                                variant="h6"
                                fontWeight={600}
                                mb={2}
                                color="text.primary"
                                fontSize={{ xs: '1.125rem', sm: '1.25rem' }}
                            >
                                <PersonIcon sx={{
                                    verticalAlign: 'middle',
                                    mr: 1,
                                    fontSize: { xs: 20, md: 24 }
                                }} />
                                Participant Information
                            </Typography>

                            {upcomingQrTicket.participantDetails.map((participant: any, index: number) => (
                                <Paper
                                    key={participant._id || index}
                                    elevation={1}
                                    sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        mb: 2,
                                        borderRadius: { xs: 1.5, sm: 2 }
                                    }}
                                >
                                    <Grid container spacing={{ xs: 1, sm: 1.5 }}>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                            >
                                                Name
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                fontWeight={500}
                                                fontSize={{ xs: '0.875rem', sm: '1rem' }}
                                                sx={{ wordBreak: 'break-word' }}
                                            >
                                                {participant.name}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3} md={3}>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                            >
                                                Age
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                fontSize={{ xs: '0.875rem', sm: '1rem' }}
                                            >
                                                {participant.age}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6} sm={3} md={3}>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                            >
                                                Gender
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                fontSize={{ xs: '0.875rem', sm: '1rem' }}
                                            >
                                                {participant.gender}
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={12} sm={6} md={3}>
                                            <Typography
                                                variant="subtitle2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                            >
                                                Entry Status
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                color={participant.validation ? "#23a823ff" : "#d49828ff"}
                                                fontWeight={500}
                                                fontSize={{ xs: '0.875rem', sm: '1rem' }}
                                            >
                                                {participant.validation ? "Validated" : "Pending"}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            ))}
                        </Box>

                        <Divider sx={{ my: 3 }} />

                        {/* Ticket & Payment Details */}
                        <Grid container spacing={{ xs: 2, md: 3 }}>
                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    mb={2}
                                    color="text.primary"
                                    fontSize={{ xs: '1.125rem', sm: '1.25rem' }}
                                >
                                    <TicketIcon sx={{
                                        verticalAlign: 'middle',
                                        mr: 1,
                                        fontSize: { xs: 20, md: 24 }
                                    }} />
                                    Ticket Details
                                </Typography>

                                {upcomingQrTicket.tickets.map((ticket: any, index: number) => (
                                    <Paper
                                        key={ticket._id || index}
                                        elevation={1}
                                        sx={{
                                            p: { xs: 1.5, sm: 2 },
                                            borderRadius: { xs: 1.5, sm: 2 },
                                            mb: { xs: 1.5, md: 2 }
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            fontWeight={600}
                                            mb={1}
                                            fontSize={{ xs: '1rem', sm: '1.125rem' }}
                                        >
                                            {ticket.ticketType}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                        >
                                            Quantity: {ticket.quantity}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                        >
                                            Unit Price: {ticket.unitPrice} XAF
                                        </Typography>
                                    </Paper>
                                ))}
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    mb={2}
                                    color="text.primary"
                                    fontSize={{ xs: '1.125rem', sm: '1.25rem' }}
                                >
                                    <PaymentIcon sx={{
                                        verticalAlign: 'middle',
                                        mr: 1,
                                        fontSize: { xs: 20, md: 24 }
                                    }} />
                                    Payment Details
                                </Typography>

                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: { xs: 1.5, sm: 2 }
                                    }}
                                >
                                    <Stack spacing={{ xs: 1, sm: 1.5 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                            >
                                                Total Amount:
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                fontWeight={600}
                                                color="primary"
                                                fontSize={{ xs: '0.9375rem', sm: '1rem' }}
                                            >
                                                {upcomingQrTicket.totalAmount} XAF
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                            >
                                                Payment Status:
                                            </Typography>
                                            <Chip
                                                label={upcomingQrTicket.paymentStatus}
                                                color="success"
                                                size="small"
                                                sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                                            />
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                            >
                                                Payment Method:
                                            </Typography>
                                            <Typography
                                                variant="body1"
                                                textTransform="capitalize"
                                                fontSize={{ xs: '0.875rem', sm: '1rem' }}
                                            >
                                                {upcomingQrTicket.paymentMethod}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                {/* Right Column - QR Code & Validation */}
                <Grid item xs={12} md={5}>
                    <Card
                        elevation={2}
                        sx={{
                            p: { xs: 2, md: 3 },
                            borderRadius: { xs: 2, md: 3 },
                            height: '100%'
                        }}
                    >
                        <Box
                            display="flex"
                            flexDirection="column"
                            alignItems="center"
                            justifyContent="center"
                            height="100%"
                        >
                            {/* QR Code */}
                            <Paper
                                elevation={3}
                                sx={{
                                    p: { xs: 2, md: 3 },
                                    mb: { xs: 3, md: 4 },
                                    borderRadius: { xs: 2, md: 3 },
                                    backgroundColor: '#f8f9fa',
                                    width: '100%',
                                    maxWidth: { xs: 280, sm: 300 }
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    fontWeight={600}
                                    mb={2}
                                    textAlign="center"
                                    fontSize={{ xs: '1.125rem', sm: '1.25rem' }}
                                >
                                    Your QR Code
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mb={3}
                                    textAlign="center"
                                    fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                >
                                    Scan this code at the event entry
                                </Typography>

                                <Box display="flex" justifyContent="center">
                                    <img
                                        src={upcomingQrTicket.qrCode}
                                        alt="QR Code"
                                        style={{
                                            width: '100%',
                                            height: 'auto',
                                            maxWidth: 220,
                                            maxHeight: 220,
                                            objectFit: 'contain',
                                            borderRadius: 8
                                        }}
                                    />
                                </Box>

                                <Typography
                                    variant="caption"
                                    display="block"
                                    textAlign="center"
                                    mt={2}
                                    color="text.secondary"
                                    fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                >
                                    Ticket Code: <strong>{upcomingQrTicket.ticketCode}</strong>
                                </Typography>
                            </Paper>

                            {/* Validation Status */}
                            <Box width="100%" textAlign="center" maxWidth={{ xs: 280, sm: 300 }}>
                                <Button
                                    variant="contained"
                                    size="large"
                                    fullWidth
                                    startIcon={upcomingQrTicket.verifyEntry ? <ValidIcon /> : <PendingIcon />}
                                    sx={{
                                        py: { xs: 1.25, md: 1.5 },
                                        px: { xs: 1, md: 2 },
                                        backgroundColor: upcomingQrTicket.verifyEntry ? '#2e7d32' : '#ed6c02',
                                        '&:hover': {
                                            backgroundColor: upcomingQrTicket.verifyEntry ? '#1b5e20' : '#e65100'
                                        },
                                        fontWeight: 600,
                                        fontSize: { xs: '0.9375rem', sm: '1rem', md: '1.1rem' },
                                        whiteSpace: 'nowrap',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}
                                >
                                    {upcomingQrTicket.verifyEntry ? 'Validated & Entry Confirmed' : 'Pending Validation'}
                                </Button>

                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    mt={2}
                                    fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                                >
                                    {upcomingQrTicket.verifyEntry
                                        ? 'Your ticket has been validated and entry is confirmed.'
                                        : 'Your ticket is pending validation at the event entry.'}
                                </Typography>
                            </Box>

                            {/* Additional Info */}
                            <Box mt={4} width="100%" maxWidth={{ xs: 280, sm: 300 }}>
                                <Paper
                                    elevation={1}
                                    sx={{
                                        p: { xs: 1.5, sm: 2 },
                                        borderRadius: { xs: 1.5, sm: 2 }
                                    }}
                                >
                                    <Stack spacing={{ xs: 1, sm: 1.5 }}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                            >
                                                Transaction ID:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontWeight={500}
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                                sx={{
                                                    wordBreak: 'break-all',
                                                    textAlign: 'right',
                                                    ml: 1
                                                }}
                                            >
                                                {upcomingQrTicket.transactionId}
                                            </Typography>
                                        </Box>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                            >
                                                Purchase Date:
                                            </Typography>
                                            <Typography
                                                variant="body2"
                                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                                sx={{ textAlign: 'right' }}
                                            >
                                                {formatDateTimeCustom(upcomingQrTicket.createdAt)}
                                            </Typography>
                                        </Box>
                                    </Stack>
                                </Paper>
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            {/* Refund Policy */}
            {upcomingQrTicket.refundPolicy && (
                <Card
                    elevation={2}
                    sx={{
                        p: { xs: 2, md: 3 },
                        mt: 3,
                        borderRadius: { xs: 2, md: 3 }
                    }}
                >
                    <Typography
                        variant="h6"
                        fontWeight={600}
                        mb={2}
                        color="text.primary"
                        fontSize={{ xs: '1.125rem', sm: '1.25rem' }}
                    >
                        Refund Policy
                    </Typography>
                    <Grid container spacing={{ xs: 1.5, sm: 2 }}>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                mb={0.5}
                            >
                                Full Refund:
                            </Typography>
                            <Chip
                                label={upcomingQrTicket.refundPolicy.fullRefund ? 'Available' : 'Not Available'}
                                color={upcomingQrTicket.refundPolicy.fullRefund ? 'success' : 'default'}
                                size="small"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                mb={0.5}
                            >
                                Partial Refund:
                            </Typography>
                            <Chip
                                label={upcomingQrTicket.refundPolicy.partialRefund ? 'Available' : 'Not Available'}
                                color={upcomingQrTicket.refundPolicy.partialRefund ? 'success' : 'default'}
                                size="small"
                                sx={{ fontSize: { xs: '0.75rem', sm: '0.8125rem' } }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                fontSize={{ xs: '0.75rem', sm: '0.8125rem' }}
                                mb={0.5}
                            >
                                No Refund After:
                            </Typography>
                            <Typography
                                variant="body2"
                                fontWeight={500}
                                fontSize={{ xs: '0.8125rem', sm: '0.875rem' }}
                            >
                                {upcomingQrTicket.refundPolicy.noRefundDate
                                    ? formatDateTimeCustom(upcomingQrTicket.refundPolicy.noRefundDate)
                                    : 'Not specified'}
                            </Typography>
                        </Grid>
                    </Grid>
                </Card>
            )}
        </Box>
    );
}