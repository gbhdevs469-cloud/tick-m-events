import { Box, Typography, Grid, Button} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import PeopleIcon from "@mui/icons-material/People";
import VerifiedIcon from "@mui/icons-material/Verified";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import { useNavigate } from "react-router-dom";

const features = [
    {
        icon: <StarIcon sx={{ fontSize: 40, color: "#2395d4" }} />,
        title: "Trusted Platform",
        desc: "We provide a secure and reliable event booking experience for customers worldwide.",
    },
    {
        icon: <PeopleIcon sx={{ fontSize: 40, color: "#2395d4" }} />,
        title: "Wide Community",
        desc: "Thousands of organizers and millions of customers use our platform daily.",
    },
    {
        icon: <VerifiedIcon sx={{ fontSize: 40, color: "#2395d4" }} />,
        title: "Verified Events",
        desc: "All events are carefully verified to ensure quality and authenticity.",
    },
    {
        icon: <SupportAgentIcon sx={{ fontSize: 40, color: "#2395d4" }} />,
        title: "24/7 Support",
        desc: "Our support team is always available to help you with your queries.",
    },
];

export function MissionSection() {
     const navigate = useNavigate();
    
    return (
        <>
            <Box
                sx={{
                    py: { xs: 1, md: 1 },
                    px: { xs: 2, md: 4 },
                    maxWidth: "1050px",
                    mx: "auto",
                }}
            >
                <Grid container spacing={6} alignItems="center">
                    {/* Left content */}
                    <Grid item xs={12} md={7}>
                        <Box sx={{ mb: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    backgroundColor: "#0d2436",
                                    textTransform: "none",
                                    borderRadius: "10px",
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    fontSize: "0.9rem",
                                    "&:hover": { backgroundColor: "#102c44" },
                                }}
                            >
                                Our Mission
                            </Button>
                        </Box>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.3,
                                mb: 2,
                                fontSize: { xs: "1.8rem", md: "2.4rem" },
                                color: "#000000",
                            }}
                        >
                            Book Your Best Events Or Sell
                            <br />
                            Your Events Tickets Easily
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#000000",
                                mb: 3,
                                lineHeight: 1.7,
                            }}
                        >
                            To make TICK-M EVENTS the official partner for events in Africa, and soon across the world, by becoming the go-to app for experiencing, organizing, and professionalizing events.
                             With TICK-M EVENTS, every event becomes simpler, more connected, and truly unforgettable.
                        </Typography>

                        {/* Bullet points */}
                        {[
                            "Simplifies event organization with modern ticketing and management tools.",
                            "Makes events more accessible with secure e-tickets (QR Code).",
                            "Connects organizers with service providers through a dedicated marketplace (venues, caterers, decorators, artists, etc.).",
                            "Creates unforgettable experiences with personalized photo/video filters for each event.",
                        ].map((item, i) => (
                            <Box key={i} sx={{ display: "flex", alignItems: "center", mb: 1.5 }}>
                                <CheckCircleIcon sx={{ color: "#2395d4", mr: 1 }} />
                                <Typography variant="body2" sx={{ color: "#000000" }}>
                                    {item}
                                </Typography>
                            </Box>
                        ))}

                        {/* CTA Button */}
                        <Button
                            variant="contained"
                            sx={{
                                mt: 3,
                                backgroundColor: "#0d2436",
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                py: 1.2,
                                "&:hover": { backgroundColor: "#102c44" },
                            }}
                             onClick={() => navigate("/sign-in")}
                        >
                            Get Started Now →
                        </Button>
                    </Grid>

                    {/* Right side image grid */}
                    <Grid item xs={12} md={5}>
                        <Grid container spacing={2} sx={{ maxWidth: 350, mx: "auto" }}>
                            {[
                                "/assets/images/about/our-mission/our-mission.png",
                                "/assets/images/about/our-mission/our-mission-1.png",
                                "/assets/images/about/our-mission/our-mission-2.png",
                                "/assets/images/about/our-mission/our-mission-3.png",
                            ].map((src, i) => (
                                <Grid item xs={6} key={i}>
                                    <Box
                                        sx={{
                                            width: "100%",
                                            aspectRatio: "1 / 1", 
                                            overflow: "hidden",
                                            borderRadius: "12px",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <Box
                                            component="img"
                                            src={src}
                                            alt={`Mission image ${i + 1}`}
                                            sx={{
                                                width: "100%",
                                                height: "100%",
                                                objectFit: "cover", 
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
            {/* <Box
                sx={{
                    bgcolor: "#2395d4",
                    py: { xs: 6, md: 6 },
                    textAlign: "center",
                    color: "#fff",
                }}
            >
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: {
                            xs: "1fr",
                            sm: "repeat(2, 1fr)",
                            md: "repeat(5, 1fr)",
                        },
                        gap: 1,
                        maxWidth: "1200px",
                        mx: "auto",
                    }}
                >
                    {[
                        { value: "45+", label: "Global Branches" },
                        { value: "29K", label: "Destinations Collaboration" },
                        { value: "20+", label: "Years Experience" },
                        { value: "168K", label: "Happy Customers" },
                        { value: "90M", label: "Visitors Per day" },
                    ].map((item, i) => (
                        <Box key={i}>
                            <Box sx={{ fontSize: "2rem", fontWeight: 700 }}>{item.value}</Box>
                            <Box sx={{ fontSize: "1rem", lineHeight: 1.3 }}>
                                {item.label}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box> */}
            <Box
                sx={{
                    py: { xs: 6, md: 10 },
                    px: { xs: 2, md: 4 },
                    maxWidth: "1050px",
                    mx: "auto",
                }}
            >
                <Grid container spacing={10} alignItems="center">
                    {/* Left Images */}
                    <Grid item xs={12} md={6}>
                        <Box
                            sx={{
                                position: "relative",
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                                minHeight: { xs: 300, md: 450 },
                            }}
                        >
                            {/* First Image with Play Button */}
                            <Box
                                sx={{
                                    position: "relative",
                                    width: "90%",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                    zIndex: 2,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/assets/images/about/img-2.png"
                                    alt="Video"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                               
                            </Box>

                            {/* Second Image (diagonal + overlapping) */}
                            {/* <Box
                                sx={{
                                    position: "absolute",
                                    bottom: { xs: "-30px", md: "-40px" },
                                    right: { xs: "-20px", md: "-40px" },
                                    width: "50%",
                                    borderRadius: 2,
                                    overflow: "hidden",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                                   
                                    zIndex: 9999,
                                }}
                            >
                                <Box
                                    component="img"
                                    src="/assets/images/about/img-2.png"
                                    alt="Support"
                                    sx={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}
                                />
                            </Box> */}
                        </Box>
                    </Grid>

                    {/* Right Text (same as before) */}
                    <Grid item xs={12} md={6}>
                        <Button
                            variant="contained"
                            sx={{
                                backgroundColor: "#0d2436",
                                textTransform: "none",
                                borderRadius: "10px",
                                px: 3,
                                py: 1,
                                fontWeight: 600,
                                fontSize: "0.9rem",
                                mb: 2,
                                "&:hover": { backgroundColor: "#102c44" },
                            }}
                        >
                            Our Commitment
                        </Button>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                lineHeight: 1.3,
                                mb: 2,
                                fontSize: { xs: "1.8rem", md: "2rem" },
                                color: "#000000",
                            }}
                        >
                            Tick-M Events offers full transparency <br />
                            and 24/7 dedicated support.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                color: "#737373",
                                mb: 3,
                                lineHeight: 1.7,
                                fontSize:'1rem'
                            }}
                        >
                           We are committed to providing clear pricing with no hidden fees, maximum security for all your payments, and continuous assistance so that every organizer, participant, and service provider enjoys a smooth and reliable experience. At Tick-M Events, your trust and satisfaction are our top priority
                        </Typography>

                        {[
                            "Easy and transparent ticketing, no hidden costs ",
                            "Verified and trusted service providers for your events ",
                            " 24/7 customer support, anytime, anywhere ",
                        ].map((item, index) => (
                            <Box
                                key={index}
                                sx={{ display: "flex", alignItems: "center", mb: 1.5 }}
                            >
                                <CheckCircleIcon sx={{ color: "#2395d4", mr: 1 }} />
                                <Typography variant="body2" sx={{ color: "#000" }}>
                                    {item}
                                </Typography>
                            </Box>
                        ))}
                         <Typography>Join us today and experience events differently. </Typography>
                        <Button
                            variant="contained"
                            sx={{
                                mt: 3,
                                backgroundColor: "#0d2436",
                                borderRadius: "12px",
                                textTransform: "none",
                                fontWeight: 600,
                                px: 3,
                                py: 1.2,
                                "&:hover": { backgroundColor: "#102c44" },
                            }}
                             onClick={() => navigate("/sign-in")}
                        >
                            Get Started Now →
                        </Button>
                    </Grid>
                </Grid>

            </Box>

        </>
    );
}
