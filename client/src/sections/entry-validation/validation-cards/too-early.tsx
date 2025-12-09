import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Paper,
    Grid,
    Chip,
    CircularProgress
} from '@mui/material';
import {
    AccessTime,
    CalendarToday,
    LocationOn,
    HourglassEmpty
} from '@mui/icons-material';
import { formatEventDate, formatTimeTo12Hour } from 'src/hooks/formate-time';

// Type definitions
interface EventDetails {
    name: string;
    date: string;
    time: string;
    location: string;
    entryStartTime: string;
    entryEndTime: string;
}

interface FlagData {
    counter: string;
    message: string;
    ticket: any;
    eventDetails: EventDetails;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    totalMs: number;
    expired?: boolean;
}

interface EarlyEntryCountdownProps {
    flagData: FlagData;
}

export function EarlyEntryCountdown({ flagData }: EarlyEntryCountdownProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft | { expired: boolean }>(() => {
        const entryStartTime = new Date(flagData.eventDetails.entryStartTime);
        const now = new Date();
        const difference = entryStartTime.getTime() - now.getTime();

        if (difference <= 0) {
            return { expired: true };
        }

        return {
            days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((difference % (1000 * 60)) / 1000),
            totalMs: difference
        };
    });

    useEffect(() => {
        function calculateTimeLeft(): TimeLeft | { expired: boolean } {
            const entryStartTime = new Date(flagData.eventDetails.entryStartTime);
            const now = new Date();
            const difference = entryStartTime.getTime() - now.getTime();

            if (difference <= 0) {
                return { expired: true };
            }

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
                totalMs: difference
            };
        }

        if ('expired' in timeLeft && timeLeft.expired) {
            return undefined;
        }

        const timer = setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearTimeout(timer);
    }, [timeLeft, flagData.eventDetails.entryStartTime]);

    if ('expired' in timeLeft && timeLeft.expired) {
        return (
            <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="h6" color="success.main">
                    Entry time has arrived! Please scan again.
                </Typography>
            </Box>
        );
    }

    // Type guard to check if timeLeft is TimeLeft type
    const currentTimeLeft = timeLeft as TimeLeft;

    return (
        <Paper
            elevation={3}
            sx={{
                p: 4,
                maxWidth: "100%",
                mx: 'auto',
                mt: 2,
                background: 'linear-gradient(135deg, #fff3e0 0%, #ffe0b2 100%)',
                border: '2px solid #ff9800'
            }}
        >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 3 }}>
                <HourglassEmpty sx={{ fontSize: 48, color: '#ff9800', mb: 2 }} />
                <Typography variant="h4" color="#e65100" fontWeight="bold" gutterBottom>
                    Entry Not Available Yet
                </Typography>
                <Typography variant="h6" color="text.secondary">
                    Please wait for the entry time
                </Typography>
            </Box>

            {/* Countdown Timer */}
            <Box sx={{ textAlign: 'center', mb: 4, p: 3, bgcolor: '#fff8e1', borderRadius: 2 }}>
                <Typography variant="h6" gutterBottom color="#e65100">
                    Entry Opens In:
                </Typography>
                <Grid container justifyContent="center" spacing={2}>
                    {currentTimeLeft.days > 0 && (
                        <Grid item>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h3" fontWeight="bold" color="#e65100">
                                    {currentTimeLeft.days}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Days
                                </Typography>
                            </Box>
                        </Grid>
                    )}
                    <Grid item>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="#e65100">
                                {currentTimeLeft.hours.toString().padStart(2, '0')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Hours
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="#e65100">
                                {currentTimeLeft.minutes.toString().padStart(2, '0')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Minutes
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Box sx={{ textAlign: 'center' }}>
                            <Typography variant="h3" fontWeight="bold" color="#e65100">
                                {currentTimeLeft.seconds.toString().padStart(2, '0')}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Seconds
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Event Details */}
            <Box sx={{ mb: 3 }}>
                <Typography variant="h5" gutterBottom fontWeight="bold" color="#e65100">
                    {flagData.eventDetails.name}
                </Typography>

                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <CalendarToday sx={{ mr: 1, color: '#ff9800' }} />
                            <Typography variant="body1">
                                <strong>Date:</strong> {formatEventDate(flagData.eventDetails.date)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                            <AccessTime sx={{ mr: 1, color: '#ff9800' }} />
                            <Typography variant="body1">
                                <strong>Time:</strong> {formatTimeTo12Hour(flagData.eventDetails.time)}
                            </Typography>
                        </Box>
                    </Grid>
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 1 }}>
                            <LocationOn sx={{ mr: 1, mt: 0.5, color: '#ff9800' }} />
                            <Typography variant="body1">
                                <strong>Venue:</strong> {flagData.eventDetails.location}
                            </Typography>
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            {/* Entry Time Window */}
            <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom fontWeight="bold">
                    Entry Time Window:
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                    <Chip
                        icon={<AccessTime />}
                        label={`Starts: ${new Date(flagData.eventDetails.entryStartTime).toLocaleString()}`}
                        variant="outlined"
                        color="warning"
                    />
                    <Chip
                        icon={<AccessTime />}
                        label={`Ends: ${new Date(flagData.eventDetails.entryEndTime).toLocaleString()}`}
                        variant="outlined"
                        color="warning"
                    />
                </Box>
            </Box>

            {/* Additional Info */}
            <Box sx={{ mt: 3, textAlign: 'center' }}>
                <Typography variant="body2" color="black" fontStyle="italic" fontWeight={700}>
                    You can enter from 2 hours before the event starts until 2 hours after
                </Typography>
            </Box>
        </Paper>
    );
};