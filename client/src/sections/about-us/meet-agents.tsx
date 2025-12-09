import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Avatar,
    IconButton,
} from "@mui/material";
import { Facebook, Instagram, YouTube, X } from "@mui/icons-material";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

const agents = [
    {
        name: "Cody Fisher",
        role: "CFO (Chief Financial Officer)",
        img: "/assets/team1.png",
    },
    {
        name: "Darrell Steward",
        role: "CEO (Chief Executive Officer)",
        img: "/assets/team2.png",
    },
    {
        name: "Ronald Richards",
        role: "COO (Chief Operating Officer)",
        img: "/assets/team3.png",
    },
    {
        name: "Jerome Bell",
        role: "CMO (Chief Marketing Officer)",
        img: "/assets/team4.png",
    },
];

export default function AgentsSection() {
    return (
        <Box sx={{ px: { xs: 2, sm: 4, md: 3 }, py: 6 }}>
            {/* Section Heading */}
            <Box textAlign="center" mb={4}>
                <Typography variant="subtitle1" color="text.secondary">
                    Awesome Teams
                </Typography>
                <Typography variant="h4" fontWeight={700}>
                    Meet Our Agents
                </Typography>
            </Box>

            {/* Responsive Grid */}
            <Grid container spacing={3} justifyContent="center">
                {agents.map((agent, i) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                        <Card
                            sx={{
                                borderRadius: 3,
                                boxShadow: 3,
                            }}
                        >
                            <Avatar
                                src={agent.img}
                                alt={agent.name}
                                sx={{
                                    width: "100%",
                                    height: 280,
                                    borderRadius: 3,
                                    mb: 2,
                                }}
                                variant="square"
                            />
                            <CardContent>
                                <Typography variant="h6" fontWeight={600}>
                                    {agent.name}
                                </Typography>
                                <Typography variant="body2" mb={2}>
                                    {agent.role}
                                </Typography>

                                {/* Social Icons */}
                                <Box display="flex" justifyContent="space-between" gap={1} mb={1}>
                                    <Box>
                                        <IconButton size="small">
                                            <Facebook fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small">
                                            <Instagram fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small">
                                            <X fontSize="small" />
                                        </IconButton>
                                        <IconButton size="small">
                                            <YouTube fontSize="small" />
                                        </IconButton>
                                    </Box>
                                    {/* Arrow Button */}
                                    <Box>
                                        <IconButton size="small">
                                            <ArrowOutwardIcon fontSize="small" />
                                        </IconButton>
                                    </Box>
                                </Box>


                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
