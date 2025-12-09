import { Box, Typography, Link, Grid } from "@mui/material";

export function HeroSection() {
    return (
        <>
            <Box sx={{ display: "flex", justifyContent: "center", py: 6, px: 2 }}>
                <Box
                    sx={{
                        position: "relative",
                        height: { xs: "60vh", md: "70vh" },
                        minHeight: "400px",
                        width: "100%",
                        maxWidth: "1000px",
                        borderRadius: "16px",
                        overflow: "hidden",
                        backgroundImage: `url("/assets/background/about-hero.jpg")`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Box
                        sx={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            backgroundColor: "rgba(0, 0, 0, 0.4)",
                            zIndex: 1,
                        }}
                    />
                    <Box sx={{ position: "relative", zIndex: 2, pl: { xs: 4, md: 8 }, maxWidth: "600px", pt: 8 }}>
                        <Typography variant="h1" sx={{ color: "white", fontWeight: "bold", fontSize: { xs: "2.5rem", md: "3.5rem" }, mb: 2 }}>
                            About Us
                        </Typography>
                        <Typography variant="h6" sx={{ color: "white", fontSize: { xs: "1rem", md: "1.2rem" }, mb: 4 }}>
                            Get the latest news, updates and tips
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", p: 1.5, borderRadius: "8px", border: "1px solid rgba(255, 255, 255, 0.7)", width: "fit-content" }}>
                            <Link href="#" sx={{ color: "#ffffff", fontWeight: "500", fontSize: "1rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>Home</Link>
                            <Typography sx={{ color: "#ffffff", mx: 1, fontSize: "1rem" }}>›</Typography>
                            <Link href="#" sx={{ color: "#ffffff", fontWeight: "500", fontSize: "1rem", textDecoration: "none", "&:hover": { textDecoration: "underline" } }}>About Us</Link>
                        </Box>
                    </Box>
                </Box>
            </Box>
            <Box
                sx={{
                    px: { xs: 2, md: 4 },
                    py: { xs: 4, md: 8 },
                    maxWidth: "1050px",
                    mx: "auto",
                }}
            >
                <Grid
                    container
                    spacing={4}
                    alignItems="center"  
                    justifyContent="center"
                >
                    {/* Heading Column */}
                    <Grid item xs={12} md={5}>
                        <Typography
                            component="h2"
                            sx={{
                                fontSize: { xs: "1rem", md: "2.8rem" },
                                fontWeight: 700,
                                lineHeight: 1.2,
                                color: "#000",
                            }}
                        >
                            The Future of{" "}
                            <Box component="span" sx={{ color: "#2395d4" }}>
                                Amazing Event
                            </Box>{" "}
                            is Here
                        </Typography>
                    </Grid>

                    {/* Text Column */}
                    <Grid item xs={12} md={7}>
                        <Typography
                            sx={{
                                fontSize: "1rem",
                                lineHeight: 1.6,
                                color: "#555",
                            }}
                        >
                           Welcome to TICK-M EVENTS, the all-in-one platform that is revolutionizing the way events are organized, discovered, and experienced in Africa and worldwide.
                            We know every event is unique – whether it’s a concert, wedding, conference, festival, or trade show. That’s why we created a simple, secure, and accessible ecosystem that connects Organizers, Participants, and Service Providers on one platform.
                        </Typography>
                    </Grid>
                </Grid>
            </Box>
        </>

    );
}
