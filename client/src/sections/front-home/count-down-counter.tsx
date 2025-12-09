import { useState, useEffect } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function CountDownCounter({ date,
    time }: { date?: string; time?: string }) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Parse the event date and time
        const defaultDate = date || "";
        const defaultTime = time || "";
        const [year, month, day] = defaultDate.split('-').map(Number);
        const [hours, minutes] = defaultTime.split(':').map(Number);

        // Create the event date object
        const eventDate = new Date(year, month - 1, day, hours, minutes);

        const calculateTimeLeft = () => {
            const now = new Date();
            const difference = eventDate.getTime() - now.getTime();

            if (difference <= 0) {
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            // Rename variables to avoid shadowing
            const remainingHours = Math.floor(difference / (1000 * 60 * 60)) % 24;
            const remainingMinutes = Math.floor((difference / 1000 / 60) % 60);
            const remainingSeconds = Math.floor((difference / 1000) % 60);

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: remainingHours,
                minutes: remainingMinutes,
                seconds: remainingSeconds
            };
        };

        // Set initial time left
        setTimeLeft(calculateTimeLeft());

        // Update countdown every second
        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        // Clean up interval on unmount
        return () => clearInterval(timer);
    }, [date, time]);

    return (
        <Box mt={3}>
            <Box
                sx={{
                    p: { xs: 2, sm: 3 },
                    borderRadius: 2,
                    boxShadow: 3,
                    textAlign: "center",
                    backgroundColor: "#fff",
                }}
            >
                <HeadingCommon title=" Countdown to the Event" weight={600} baseSize="36px"/>
                
                <Grid container justifyContent="center" spacing={2} mt={1}>
                    {Object.entries(timeLeft).map(([unit, value]) => (
                        <Grid item key={unit}>
                            <Typography color="primary" fontSize={{ xs: "2rem", md: "2.5rem" }} fontWeight="bold">
                        
                                {value.toString().padStart(2, "0")}
                            </Typography>
                            <Typography textTransform="capitalize">{unit}</Typography>
                        </Grid>
                    ))}
                </Grid>
            </Box>
        </Box>
    );
}