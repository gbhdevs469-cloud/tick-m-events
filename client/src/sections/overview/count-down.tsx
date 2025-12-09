import { Paper,Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

interface Event {
    _id: string;
    eventName: string;
    date: string;
    time: string;
}

interface CountDownViewProps {
    selectedEvent: Event | null;
}

export function CountDownView({ selectedEvent }: any) {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Clear countdown if no event is selected
        if (!selectedEvent) {
            setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            return undefined;
        }

        const updateCountdown = () => {
            const now = new Date();
            const eventDateTime = new Date(`${selectedEvent.date}T${selectedEvent.time}`);
            const difference = eventDateTime.getTime() - now.getTime();

            if (difference <= 0) {
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            const days = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
            const minutes = Math.floor((difference / 1000 / 60) % 60);
            const seconds = Math.floor((difference / 1000) % 60);

            setTimeLeft({ days, hours, minutes, seconds });
        };

        // Update immediately
        updateCountdown();

        // Then update every second
        const interval = setInterval(updateCountdown, 1000);

        return () => clearInterval(interval);
    }, [selectedEvent]); // Only re-run when selectedEvent changes

    if (!selectedEvent) {
        return (
            <Paper
                elevation={3}
                sx={{
                    px: { xs: 1, sm: 2, md: 3 },
                    py: 1.5,
                    borderRadius: "12px",
                    textAlign: "center",
                    minWidth: { xs: "120px", sm: "140px", md: "180px" },
                }}
            >
                <Typography
                    sx={{
                        fontWeight: "bold",
                        fontSize: { xs: "12px", sm: "13px", md: "14px" },
                        fontFamily: "Poppins, sans-serif",
                    }}
                >
                    Select an Event
                </Typography>
            </Paper>
        );
    }

    return (
        <Paper
            elevation={3}
            sx={{
                px: { xs: 1, sm: 2, md: 3 },
                py: 1.5,
                borderRadius: "12px",
                textAlign: "center",
                minWidth: { xs: "120px", sm: "140px", md: "180px" },
            }}
        >
            <HeadingCommon title="Countdown to Event" baseSize="15px" weight={700} />
            <Box>
                <span>{timeLeft.days}</span>d&nbsp;
                <span>{timeLeft.hours}</span>h&nbsp;
                <span>{timeLeft.minutes}</span>m&nbsp;
                <span>{timeLeft.seconds}</span>s
            </Box>
           
            <Typography
                sx={{
                    fontSize: { xs: "10px", sm: "11px", md: "12px" },
                    fontFamily: "Poppins, sans-serif",
                    color: "#666",
                    mt: 0.5,
                    textTransform: "capitalize"
                }}
            >
                {selectedEvent?.eventName}
            </Typography>
        </Paper>
    );
}