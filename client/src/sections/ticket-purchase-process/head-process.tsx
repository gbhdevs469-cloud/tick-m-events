import { Box, Typography } from "@mui/material";

export function HeadProcess({ title, step }: any) {
    return (
        <Box position="relative" textAlign="center" mb={4}>
            {/* Step Indicator */}
            <Box
                display="flex"
                justifyContent="center"
                position="absolute"
                left="50%"
                top="-53px"
                sx={{
                    transform: "translateX(-50%)",
                    zIndex: 2
                }}
            >
                <Typography
                    variant="h5"
                    sx={{
                        bgcolor: "#1F8FCD",
                        color: "#fff",
                        px: 2,
                        py: 1,
                        borderRadius: "50%",
                        width: 45,
                        height: 45,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold"
                    }}
                >
                    {step}
                </Typography>
            </Box>

            {/* Title */}
            <Typography
                variant="h5"
                fontWeight={500}
                fontSize={{ xs: "25px", sm: "31px", md: "37px" }}
                sx={{
                    display: "inline-block",
                    position: "relative",
                    textAlign: "center",
                    mx: "auto",
                    maxWidth: { md: "626px" },
                    width: "100%"
                }}
            >
                {title}
            </Typography>
        </Box>

    )
}