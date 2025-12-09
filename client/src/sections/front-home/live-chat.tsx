import React from "react";
import { Box, Button, Card, CardContent, IconButton, TextField, Typography } from "@mui/material";
import PlayCircleIcon from "@mui/icons-material/PlayCircle";
import ShareIcon from "@mui/icons-material/Share";

export function LiveChat() {
    return (
        <Box
            mt={3}
            sx={{
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                gap: 2,
                
                justifyContent: "center",
                alignItems: "center",
            }}
        >
            {/* Video Section */}
            <Card
                sx={{
                    position: "relative",
                    width: { xs: "100%", sm: "80%", md: "60%" },
                    borderRadius: "16px",
                    overflow: "hidden",
                }}
            >
                <img
                    src="./assets/images/company/viewo.png"
                    alt="Live Event"
                    style={{ width: "100%", height: "auto", display: "block" }}
                />
                {/* Play Button Overlay */}
                <IconButton
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        background: "rgba(255,255,255,0.8)",
                        "&:hover": { background: "rgba(255,255,255,1)" },
                    }}
                >
                    <PlayCircleIcon sx={{ fontSize: 50 }} />
                </IconButton>

                {/* Share Button */}
                <Button
                    variant="contained"
                    startIcon={<ShareIcon />}
                    sx={{
                        position: "absolute",
                        bottom: 10,
                        right: 10,
                        backgroundColor: "#0D3B66",
                        "&:hover": { backgroundColor: "#092C4C" },
                    }}
                >
                    Share
                </Button>
            </Card>

            {/* Live Chat Section */}
            <Card
                sx={{
                    width: { xs: "100%", sm: "80%", md: "35%" },
                    p: 2,
                    borderRadius: "16px",
                }}
            >
                <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                        Live Chat
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Welcome to the live event
                    </Typography>

                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                        <TextField fullWidth size="small" placeholder="Type a message..." />
                        <Button variant="contained" sx={{ backgroundColor: "#0D3B66" }}>
                            Send
                        </Button>
                    </Box>

                    {/* Emoji Reactions */}
                    <Box sx={{ display: "flex", gap: 1, mt: 2 }}>
                        {["👍", "❤️", "😂", "🎉", "🔥"].map((emoji, index) => (
                            <Typography key={index} sx={{ fontSize: 24, cursor: "pointer" }}>
                                {emoji}
                            </Typography>
                        ))}
                    </Box>
                </CardContent>
            </Card>
        </Box>
    )
}