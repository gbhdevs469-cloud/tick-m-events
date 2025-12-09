import { Box, Typography,Grow,Fade } from "@mui/material";
import { Iconify } from "src/components/iconify";

export function StepperSuccessful() {

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "60vh",
                textAlign: "center",
                p: 3,
            }}
        >
            {/* Fade in and grow animation for the icon */}
            <Grow in timeout={1000}>
                <Box
                    sx={{
                        transform: 'scale(1.2)',
                        transition: 'all 0.3s ease-in-out',
                        '&:hover': {
                            transform: 'scale(1.3)',
                        }
                    }}
                >
                    <Fade in timeout={1500}>
                        <Iconify
                            icon='material-symbols:check-circle-outline'
                            width={80}
                            color="#7ce11e"
                            sx={{
                                animation: 'pulse 1.5s ease-in-out infinite alternate',
                                '@keyframes pulse': {
                                    '0%': { opacity: 0.8, transform: 'scale(1)' },
                                    '100%': { opacity: 1, transform: 'scale(1.1)' },
                                }
                            }}
                        />
                    </Fade>
                </Box>
            </Grow>

            <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
                Event Successfully Created!
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 4, maxWidth: 500 }}>
                Your event has been successfully published. You can now share it with attendees
                or manage it from your dashboard.
            </Typography>
        </Box>
    );
}