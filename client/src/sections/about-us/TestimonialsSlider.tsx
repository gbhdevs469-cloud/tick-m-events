import Carousel from "react-material-ui-carousel";
import {
    Box,
    Typography,
    Avatar,
    Stack,
    Grid
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

function chunkArray(array: any[], size: number) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
        result.push(array.slice(i, i + size));
    }
    return result;
}

export function TestimonialsSlider() {
    const groupedTestimonials = chunkArray(testimonials, 3);

    return (
        <Box
            sx={{
                py: { xs: 6, md: 10 },
                px: { xs: 2, md: 4 },
                maxWidth: "1200px",
                textAlign: "center",
            }}
        >
            <Typography
                variant="h4"
                sx={{
                    fontWeight: 700,
                    mb: 6,
                    fontSize: { xs: "1.8rem", md: "2.4rem" },
                    color: "#111",
                }}
            >
                What they say about us?
            </Typography>

            <Carousel
                autoPlay
                interval={5000}
                animation="slide"
                indicators
                navButtonsAlwaysInvisible
                duration={600}
                sx={{ overflow: "hidden" }}
            >
                {groupedTestimonials.map((group, groupIndex) => (
                    <Grid
                        container
                        spacing={3}
                        key={groupIndex}
                        justifyContent="center"
                        alignItems="stretch"
                    >
                        {group.map((testimonial, index) => (
                            <Grid item xs={12} sm={6} md={4} key={index}>
                                <Box
                                    sx={{
                                        p: 4,
                                        borderRadius: 3,
                                        border: "1px solid #e0e0e0",
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        textAlign: "left",
                                        bgcolor: "#fff",
                                    }}
                                >
                                    {/* Heading */}
                                    <Typography
                                        variant="h6"
                                        sx={{ color: "#000", fontWeight: 700, mb: 1 }}
                                    >
                                        {testimonial.heading}
                                    </Typography>

                                    {/* Description */}
                                    <Typography
                                        variant="body2"
                                        sx={{ color: "#101010", mb: 3, lineHeight: 1.6 }}
                                    >
                                        {testimonial.text}
                                    </Typography>

                                    <Stack direction="row" spacing={2} alignItems="center">
                                        <Avatar src={testimonial.image} alt={testimonial.name} />
                                        <Box>
                                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                                {testimonial.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {testimonial.location}
                                            </Typography>
                                        </Box>

                                        <Box sx={{ flexGrow: 1 }} />
                                        <Stack direction="row" spacing={0.5}>
                                            {Array.from({ length: testimonial.rating }).map((_, i) => (
                                                <Box
                                                    key={i}
                                                    sx={{
                                                        bgcolor: "#2296D4",
                                                        width: 24,
                                                        height: 24,
                                                        borderRadius: 1,
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                    }}
                                                >
                                                    <StarIcon sx={{ fontSize: 16, color: "#fff" }} />
                                                </Box>
                                            ))}
                                        </Stack>

                                    </Stack>
                                </Box>
                            </Grid>
                        ))}
                    </Grid>
                ))}
            </Carousel>
          
        </Box>
    );
}
