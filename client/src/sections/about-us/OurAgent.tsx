import { Typography, Box, Grid, CardContent, Avatar, IconButton, Card, Divider } from "@mui/material";
import Facebook from '@mui/icons-material/Facebook';
import Instagram from '@mui/icons-material/Instagram';
import YouTube from '@mui/icons-material/YouTube';
import Twitter from '@mui/icons-material/Twitter';

interface SocialIconProps {
    type: string;
}

const agents = [
    {
        name: "Samuel DIMOU",
        role: "CEO (Co-founder))",
        img: "/assets/images/about/teams/team-2.jpg",
        socials: ["instagram", "facebook", "x", "youtube"],
    },
    {

        name: "Yannick Cabrel TEGUEBOUG",
        role: "COO (Co-founder)",
        img: "/assets/images/about/teams/team-1.png",
        socials: ["instagram", "facebook", "x", "youtube"],
    },

];

const features = [
    {
        img: "/assets/images/about/fi_5035167.png",
        alt: "Online Ticketing",
        title: "Online Ticketing:",
        desc: "  Buy, sell, and manage tickets with ease.",
    },
    {
        img: "/assets/images/about/fi_9099392.png",
        alt: "Organizer Tools",
        title: "Organizer Tools:",
        desc: "Ticket management, promotions, notifications, payments, and real-time analytics.",
    },
    {
        img: "/assets/images/about/fi_15305191.png",
        alt: "B2B Marketplace",
        title: "B2B Marketplace:",
        desc: "Easily find trusted and verified service providers for your events.",
    },
    {
        img: "/assets/images/about/fi_9723160.png",
        alt: "Custom Photo/Video Filters",
        title: "Custom Photo/Video Filters: ",
        desc: "Capture memories with the unique style of each event.",
    },
    {
        img: "/assets/images/about/security.png",
        alt: "Security & Trust",
        title: "Security & Trust: ",
        desc: "Verified providers (KYC) & secure payments (Mobile Money, Credit Card, etc.).",
    },

];

function SocialIcon({ type }: SocialIconProps) {
    switch (type) {
        case "facebook":
            return <Facebook fontSize="small" />;
        case "instagram":
            return <Instagram fontSize="small" />;
        case "youtube":
            return <YouTube fontSize="small" />;
        case "x":
            return <Twitter fontSize="small" />;
        default:
            return null;
    }
}
export function OurAgent() {
    return (
        <>
            <Box
                sx={{
                    py: { xs: 1, md: 1 },
                    px: { xs: 2, md: 4 },
                    mx: "auto",
                }}
            >
                <Grid container spacing={4} sx={{ maxWidth: "1050px", mx: 'auto' }}>
                    {/* Left: Image with overlay text */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                position: "relative",
                                height: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                },
                                transition: "box-shadow 0.3s ease",
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/images/about/about-2.png"
                                alt="Team discussing"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>

                    </Grid>

                    {/* Center: Portrait image */}
                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                height: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                },
                                transition: "box-shadow 0.3s ease",
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/images/about/about-1.png"
                                alt="Portrait"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Box
                            sx={{
                                height: "100%",
                                borderRadius: "12px",
                                overflow: "hidden",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                "&:hover": {
                                    boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                                },
                                transition: "box-shadow 0.3s ease",
                            }}
                        >
                            <Box
                                component="img"
                                src="/assets/images/about/about.png"
                                alt="Portrait"
                                sx={{
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                }}
                            />
                        </Box>
                    </Grid>
                </Grid>
                {/* Features Section */}
                <Box
                    sx={{
                        px: { xs: 1, md: 2 },
                        py: { xs: 4, md: 8 },
                        mx: "auto",
                        maxWidth: "1050px"
                    }}
                >
                    <Grid container spacing={2}>
                        {features.map((feature, index) => (
                            <Grid item xs={12} sm={6} md={2.4} key={index}>
                                <Box>
                                    <Box
                                        component="img"
                                        src={feature.img}
                                        alt={feature.alt}
                                        sx={{ width: 40, height: 40, mb: 2 }}

                                    />
                                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: { xs: "0.95rem", md: "1.1rem" } }}>
                                        {feature.title}
                                    </Typography>
                                    <Typography variant="body2" sx={{ color: "#666" }}>
                                        {feature.desc}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 6 }}>
                    {/* Top Divider */}
                    <Divider sx={{ mb: 4 }} />

                    {/* Title Section */}
                    <Box sx={{ mb: 6 }}>
                        <Typography
                            variant="subtitle1"
                            sx={{ color: "text.secondary", mb: 1, textAlign: "left" }}
                        >
                            Awesome Teams
                        </Typography>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                fontSize: { xs: "1.8rem", md: "2.4rem" },
                                textAlign: "left",
                            }}
                        >
                            Meet Our Agents
                        </Typography>
                    </Box>

                    {/* Agent Cards */}
                    <Grid container spacing={2} justifyContent="center">
                        {agents.map((agent, index) => (
                            <Grid item xs={12} sm={6} md={3} lg={6} key={index}>
                                <Card
                                    sx={{
                                        borderRadius: 3,
                                        overflow: "hidden",
                                        boxShadow: 2,
                                        transition: "box-shadow 0.3s ease",
                                        "&:hover": {
                                            boxShadow: 4,
                                        },
                                        height: "100%", 
                                        display: "flex",
                                        flexDirection: "column",
                                    }}
                                >
                                    <Box sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        backgroundColor: "#f8f9fa", 
                                        p: 2 
                                    }}>
                                        <Avatar
                                            src={agent.img}
                                            alt={agent.name}
                                            sx={{
                                                width: "100%",
                                                maxWidth: 200, 
                                                height: 250, 
                                                objectFit: "cover",
                                                objectPosition: "center",
                                                borderRadius: 2, 
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{
                                        flexGrow: 1, 
                                        display: "flex",
                                        flexDirection: "column",
                                        p: 2
                                    }}>
                                        <Typography
                                            variant="h6"
                                            sx={{
                                                fontWeight: 700,
                                                color: "text.primary",
                                                textAlign: "center",
                                                mb: 1
                                            }}
                                        >
                                            {agent.name}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "text.secondary",
                                                textAlign: "center",
                                                mb: 2
                                            }}
                                        >
                                            {agent.role}
                                        </Typography>
                                        <Box sx={{
                                            display: "flex",
                                            gap: 1,
                                            justifyContent: "center",
                                            mt: "auto" 
                                        }}>
                                            {agent.socials.map((social, i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        backgroundColor: "#F2F4F6",
                                                        borderRadius: "50%",
                                                        width: 36,
                                                        height: 36,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <IconButton
                                                        size="small"
                                                        sx={{
                                                            color: "black",
                                                            p: 0,
                                                            "&:hover": {
                                                                backgroundColor: "rgba(0,0,0,0.1)"
                                                            }
                                                        }}
                                                    >
                                                        <SocialIcon type={social} />
                                                    </IconButton>
                                                </Box>
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>


                    {/* Bottom Divider */}
                    <Divider sx={{ mt: 8, mb: 4 }} />
                </Box>
            </Box>
        </>

    );
}
