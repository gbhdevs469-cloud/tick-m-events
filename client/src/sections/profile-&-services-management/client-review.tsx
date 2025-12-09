import {
    Box,
    Button,
    Grid,
    Typography,
    TextField,
    Stack,
    Paper,
    CircularProgress
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useEffect, useState } from "react";
import axios from "../../redux/helper/axios";

// Type definitions
interface User {
    _id: string;
    name: string;
    avatar?: string;
}

interface Reply {
    text: string;
    repliedBy: User;
    createdAt: string;
}

interface Review {
    _id: string;
    user: User;
    rating: number;
    comment: string;
    reply?: Reply;
    createdAt: string;
}

interface RatingStatistics {
    averageRating: number;
    totalReviews: number;
    ratingCounts: {
        1: number;
        2: number;
        3: number;
        4: number;
        5: number;
    };
}

interface ClientReviewProps {
    providerId: string;
}

export function ClientReview({ providerId }: ClientReviewProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [stats, setStats] = useState<RatingStatistics | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [replyText, setReplyText] = useState<string>("");
    const [activeReview, setActiveReview] = useState<string | null>(null);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                setLoading(true);
                const response = await axios.get<{
                    reviews: Review[];
                    ratingStatistics: RatingStatistics;
                }>(`/auth/reviews`);
                setReviews(response.data.reviews);
                setStats(response.data.ratingStatistics);
                setLoading(false);
            } catch (err) {
                console.log(err.message);
                setError(err instanceof Error ? err.message : "An unknown error occurred");
                setLoading(false);
            }
        };

        fetchReviews();
    }, [providerId]);

    const handleReplySubmit = async (reviewId: string) => {
        try {
            await axios.put(`/auth/reviews/${reviewId}/reply`, {
                replyText
            });
            // Refresh reviews after successful reply
            const response = await axios.get<{
                reviews: Review[];
                ratingStatistics: RatingStatistics;
            }>(`/auth/reviews`);
            setReviews(response.data.reviews);
            setReplyText("");
            setActiveReview(null);
        } catch (err) {
            console.error("Error submitting reply:", err);
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <Typography color="error">Error: {error}</Typography>;

    return (
        <Box p={3} borderRadius={3} boxShadow={3} bgcolor="#FFFFFF" mt={3}>
            {/* Header */}
            <Box
                sx={{
                    borderRadius: "20px",
                    border: "1px solid #00000066",
                    backgroundColor: "#FFFFFF",
                    p: 2,
                    mb: 3,
                }}
            >
                <Typography variant="subtitle1" fontWeight="bold">
                    Client Reviews & Reputation
                </Typography>
                {stats && (
                    <>
                        <Typography variant="body1" sx={{ mt: 0.5 }}>
                            <strong>{stats.averageRating.toFixed(1)}/5</strong> based on {stats.totalReviews} reviews
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 1, fontSize: "14px" }}>
                            {`★★★★★ - ${stats.ratingCounts[5]} | ★★★★☆ - ${stats.ratingCounts[4]} | ★★★☆☆ - ${stats.ratingCounts[3]} | ★★☆☆☆ - ${stats.ratingCounts[2]} | ★☆☆☆☆ - ${stats.ratingCounts[1]}`}
                        </Typography>
                    </>
                )}

                <Stack direction="row" spacing={1} mt={2}>
                    {["Recent", "Best", "Lowest Rated"].map((label) => (
                        <Button
                            key={label}
                            variant="outlined"
                            sx={{
                                borderRadius: "10px",
                                borderColor: "#00000066",
                                textTransform: "none",
                                px: 2,
                                py: 0.5,
                                fontSize: "14px",
                                backgroundColor: "#fff",
                                color: "#000",
                                "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                },
                            }}
                        >
                            {label}
                        </Button>
                    ))}
                </Stack>
            </Box>

            {/* Reviews */}
            <Box
                sx={{
                    background: "#FFFFFF",
                    border: "1px solid #00000066",
                    borderRadius: "20px",
                    p: 2,
                }}
            >
                {reviews?.length === 0 ? (
                    <Typography sx={{ p: 2 }}>No reviews yet</Typography>
                ) : (
                    reviews?.map((review) => (
                        <Paper
                            key={review._id}
                            elevation={0}
                            sx={{
                                border: "none",
                                borderBottom: "1px solid #D3D3D3",
                                background: "transparent",
                                borderRadius: 0,
                                px: 2,
                                py: 3,
                                "&:last-child": {
                                    borderBottom: "none",
                                },
                            }}
                        >
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={9}>
                                    <Typography
                                        sx={{ fontWeight: 600, fontSize: "14px", color: "#000" }}
                                    >
                                        {review.user?.name || "Anonymous"}
                                    </Typography>

                                    <Box sx={{ display: "flex", alignItems: "center", mt: 0.5 }}>
                                        {[...Array(review.rating)].map((_, i) => (
                                            <StarIcon
                                                key={i}
                                                fontSize="small"
                                                sx={{ color: "#FFB800", mr: 0.3 }}
                                            />
                                        ))}
                                    </Box>

                                    <Typography
                                        sx={{ fontSize: "12px", color: "#000", mt: 1, mb: 2 }}
                                    >
                                        {review.comment}
                                    </Typography>

                                    {review?.reply && (
                                        <Box sx={{ 
                                            backgroundColor: "#f5f5f5", 
                                            p: 2, 
                                            borderRadius: 1,
                                            mb: 2
                                        }}>
                                            <Typography variant="subtitle2">
                                                Response from provider:
                                            </Typography>
                                            <Typography>
                                                {review.reply.text}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {new Date(review.reply.createdAt).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    )}

                                    {activeReview === review?._id ? (
                                        <>
                                            <Grid item xs={12}>
                                                <Box sx={{ width: "calc(100%)" }}>
                                                    <TextField
                                                        multiline
                                                        minRows={3}
                                                        placeholder="Write a reply..."
                                                        fullWidth
                                                        value={replyText}
                                                        onChange={(e) => setReplyText(e.target.value)}
                                                    />
                                                </Box>
                                            </Grid>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleReplySubmit(review._id)}
                                                    sx={{
                                                        backgroundColor: "#0B2E4C",
                                                        color: "#fff",
                                                        textTransform: "none",
                                                        px: 3,
                                                        py: 0.7,
                                                        fontSize: "12px",
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    Submit Reply
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    onClick={() => {
                                                        setActiveReview(null);
                                                        setReplyText("");
                                                    }}
                                                    sx={{
                                                        textTransform: "none",
                                                        px: 3,
                                                        py: 0.7,
                                                        fontSize: "12px",
                                                        borderRadius: "10px",
                                                    }}
                                                >
                                                    Cancel
                                                </Button>
                                            </Box>
                                        </>
                                    ) : !review?.reply && (
                                        <Button
                                            startIcon={<ChatBubbleOutlineIcon />}
                                            sx={{
                                                mt: 2,
                                                backgroundColor: "#0B2E4C",
                                                color: "#fff",
                                                textTransform: "none",
                                                px: 3,
                                                py: 0.7,
                                                fontSize: "12px",
                                                borderRadius: "10px",
                                                "&:hover": {
                                                    backgroundColor: "#0B2E4C",
                                                },
                                            }}
                                            onClick={() => setActiveReview(review._id)}
                                        >
                                            Reply to Review
                                        </Button>
                                    )}
                                </Grid>

                                <Grid
                                    item
                                    xs={12}
                                    sm={3}
                                    textAlign={{ xs: "left", sm: "right" }}
                                    display="flex"
                                    justifyContent={{ xs: "flex-start", sm: "flex-end" }}
                                    alignItems="flex-start"
                                >
                                    <Typography sx={{ fontSize: "12px", color: "#888" }}>
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    );
}