
import {
    Box,
    Typography,
    Avatar,
    Stack,
    Grid, Paper, Rating
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

const testimonials = [
    {
        name: ". Léa T. –",
        location: "Douala",
        image: "/assets/images/about/teams/testimonial.png",
        rating: 5,
        heading: "Event Planner",
        text: "TICK-M has made my life easier. I was able to create and promote my event, sell my tickets online and find the service providers I needed, all on a single interface. A real time saver!",
    },
    {
        name: "Julien N.",
        location: "Yaoundé",
        image: "/assets/images/about/teams/testimonial-1.png",
        rating: 5,
        heading: "DJ service provider!",
        text: "Thanks to the marketplace, I found my first customers in 48 hours. And what I love is the security of payments and clear contracts. I recommend it 100%.",
    },
    {
        name: "Stéphanie A.",
        location: "Douala",
        image: "/assets/images/about/teams/testimonial-2.png",
        rating: 5,
        heading: "Participant in a concert",
        text: "I bought my ticket online in a few clicks, and I received it directly on my phone with a QR code. It's simple, fast and secure.",
    },
    {
        name: "Emmanuel B.",
        location: "Bafoussam",
        image: "/assets/images/about/teams/testimonial.png",
        rating: 5,
        heading: "Wedding planner",
        text: "I had a small budget and yet I found a caterer, a photographer and even a quality tent on TICK-M. Everything was clear, well rated, and stress-free.",
    },
    {
        name: "Carine M.",
        location: "Yaoundé",
        image: "/assets/images/about/teams/testimonial-1.png",
        rating: 5,
        heading: "Participant at a conference",
        text: "The photo filter of the event was amazing! I took a lot of personalized photos with my friends, and it really made the experience unique.",
    },
    {
        name: "Bertrand S.",
        location: "Dubai",
        image: "/assets/images/about/teams/testimonial-2.png",
        rating: 5,
        heading: "Master of Ceremonies and Independent Service Provider",
        text: "I am visible everywhere in Cameroon thanks to TICK-M EVENTS. Customers can see my profile, my rates, my photos and videos, and contact me directly. I've never had so many reservations.",
    },
];

export default function Testimonial() {
    return (
        <Box sx={{ maxWidth: 1200, mx: "auto", px: 2, py: 6 }}>
            {/* Section Titles */}
            <Typography
                variant="subtitle1"
                sx={{ color: "text.secondary", mb: 1, textAlign: "left" }}
            >
                What they say about us?
            </Typography>
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    fontSize: { xs: "1.8rem", md: "2.4rem" },
                    mb: 6,
                    textAlign: "left",
                }}
            >
                Testimonial
            </Typography>

            {/* Testimonials Grid */}
            <Grid container spacing={4} justifyContent="flex-start">
                {testimonials.map((testimonial, index) => (
                    <Grid item xs={12} md={4} key={index}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 3,
                                borderRadius: 3,
                                height: "100%",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
                            }}
                        >
                            {/* Top Text Section */}
                            <Box sx={{ textAlign: "left" }}>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 700, mb: 2, color: "#101010", textAlign: "left" }}
                                >
                                    The best booking system
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{ color: "#101010", textAlign: "left" }}
                                >
                                    {testimonial.text}
                                </Typography>
                            </Box>

                            {/* Bottom - Author Section */}
                            <Box sx={{ mt: 4, display: "flex", alignItems: "center", gap: 2 }}>
                                <Avatar
                                    src={testimonial.image}
                                    alt={testimonial.name}
                                    sx={{ width: 48, height: 48 }}
                                />
                                <Box sx={{ flex: 1, textAlign: "left" }}>
                                    <Typography
                                        variant="body1"
                                        fontWeight={600}
                                        sx={{ color: "#101010", textAlign: "left" }}
                                    >
                                        {testimonial.name}
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#101010", textAlign: "left" }}
                                    >
                                        {testimonial.location}
                                    </Typography>
                                </Box>
                                <Rating
                                    value={testimonial.rating}
                                    readOnly
                                    size="small"
                                    sx={{ color: "#007AFF" }}
                                />
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

        </Box>
    )
}