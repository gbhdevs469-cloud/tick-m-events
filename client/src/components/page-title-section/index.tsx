import { Box, Typography } from "@mui/material";

export function PageTitleSection({ title, desc, rightCom }: any) {
    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: { xs: "row", md: "row" }, // Stack on small screens
                justifyContent: "space-between",
                alignItems: { xs: "center", md: "center" }, // Align left on small, center on large
                mb: { xs: 2, md: 3 },

            }}
            mt={3}
        >
            {/* Left Side - Dashboard Title & Subtitle */}
            <Box sx={{ width: { xs: "50%", md: "auto" } }}>
                <Typography
                    variant="h4"
                    sx={{
                        mb: { xs: 1, sm: 2, md: 3 },
                        fontWeight: 600,
                        color: "#000",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: { xs: "15px", sm: "18px", md: "30px" }, // Responsive size
                        lineHeight: { xs: "20px" }, // Responsive size
                    }}
                >
                    {title}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{
                        color: "#C0C0C0",
                        fontFamily: "Poppins, sans-serif",
                        fontSize: { xs: "12px", sm: "15px", md: "18px" }, // Adjust dynamically
                    }}
                >
                    {desc}
                </Typography>
            </Box>

            {/* Right Side - Countdown/Search Bar, etc. */}
            {
                rightCom && (
                    <Box display="flex" justifyContent="center" sx={{ width: { xs: "50%", md: "auto" }, textAlign: { xs: "left", md: "right" } }}>
                        {rightCom}
                    </Box>
                )
            }
        </Box >
    )
}