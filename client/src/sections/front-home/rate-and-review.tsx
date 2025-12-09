import { Box, Button, Divider, Grid, Typography, LinearProgress, TextField, Select, MenuItem, Card, CardContent, Avatar, Collapse } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarHalfIcon from "@mui/icons-material/StarHalf";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import SendIcon from '@mui/icons-material/Send';
import { eventAddReview } from "src/redux/actions/reviewOnEvent.action";
import { AppDispatch } from "src/redux/store";
import { useParams } from "react-router-dom";
import { eventByIdFetch, eventSubmitRating } from "src/redux/actions/event.action";

interface ApiResult {
    status: number;
    type: string;
    message: any;
    // Add other properties if needed
}

function renderStars(rating: any) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 !== 0;
    return (
        <>
            {[...Array(fullStars)].map((_, i) => (
                <StarIcon key={i} sx={{ color: "#EEC617", fontSize: { md: "3rem" } }} />
            ))}
            {halfStar && <StarHalfIcon sx={{ color: "#EEC617", fontSize: { md: "3rem" } }} />}
            {[...Array(5 - fullStars - (halfStar ? 1 : 0))].map((_, i) => (
                <StarBorderIcon key={i} sx={{ color: "#EEC617", fontSize: { md: "3rem" } }} />
            ))}
        </>
    );
};


const ReviewCard = ({ name, rating, comment, createdAt }: any) => {
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

    const handleReplySubmit = () => {
        // Here you would typically send the reply to your API
        setReplyText('');
        setIsReplying(false);
    };


    return (
        <Card elevation={0} sx={{ borderRadius: 3, border: "1px solid #ddd", mb: 2 }}>
            <CardContent>
                {/* Review Header */}
                <Grid container alignItems="center" justifyContent="space-between">
                    <Grid item>
                        <Box display="flex" alignItems="center">
                            <Avatar sx={{ bgcolor: "black", color: "white", mr: 1 }}>{name[0]}</Avatar>
                            <Box>
                                <Typography fontWeight="bold">{name}</Typography>
                                <Box display="flex" alignItems="center">
                                    {[...Array(rating)].map((_, i) => (
                                        <StarIcon key={i} sx={{ color: "gold", fontSize: 18 }} />
                                    ))}
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                    <Grid item>
                        <Typography fontSize="14px" color="gray">
                            {new Date(createdAt).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>

                {/* Review Comment */}
                <Typography mt={1}>{comment}</Typography>

                {/* Reply Section */}
                <Box mt={2} textAlign="right">
                    {/* <Button
                        variant="outlined"
                        startIcon={<ChatBubbleOutlineIcon />}
                        sx={{ textTransform: "none" }}
                        onClick={() => setIsReplying(!isReplying)}
                    >
                        {isReplying ? 'Cancel Reply' : 'Reply to Review'}
                    </Button> */}

                    <Collapse in={isReplying}>
                        <Box mt={2} display="flex" alignItems="flex-end">
                            <TextField
                                fullWidth
                                multiline
                                rows={2}
                                variant="outlined"
                                placeholder="Write your reply..."
                                value={replyText}
                                onChange={(e) => setReplyText(e.target.value)}
                                sx={{ mr: 1 }}
                            />
                            <Button
                                variant="contained"
                                endIcon={<SendIcon />}
                                onClick={handleReplySubmit}
                                disabled={!replyText.trim()}
                            >
                                Send
                            </Button>
                        </Box>
                    </Collapse>
                </Box>
            </CardContent>
        </Card>
    );
};

export function RateAndReview({ reviews, reviewCount, rating }: any) {
    const [filter, setFilter] = useState("date");
    const dispatch = useDispatch<AppDispatch>()
    const { eventId } = useParams();
    const [userRating, setUserRating] = useState(rating || 0);
    const [hoverRating, setHoverRating] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        comment: ''
    });

    // Handle form submission
    const handleSubmit = useCallback(async (e: React.FormEvent) => {
        e.preventDefault();
        const reviewFormData = new FormData();
        reviewFormData.append("name", formData.name);
        reviewFormData.append("eventId", eventId!);
        reviewFormData.append("email", formData.email);
        reviewFormData.append("comment", formData.comment);

        const result = await dispatch(eventAddReview(reviewFormData));
        if ((result as ApiResult)?.status === 201) {
            toast.success(result?.message);
            await dispatch(eventByIdFetch(eventId));
            setFormData({
                name: '',
                email: '',
                comment: ''
            })
        } else {
            toast.error(result?.message);
        }
        // Here you would typically send the data to an API
    }, [formData, dispatch, eventId]);

    // Handle input changes
    const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    }, []);



    // Function to handle rating click
    const handleRatingClick = async (ratingValue: any) => {
        setUserRating(ratingValue);
        const participantRating = {
            ratingValue,
            eventId
        }
        const result = await dispatch(eventSubmitRating(participantRating))
        console.log(result);
        
        if ((result as ApiResult)?.status === 200) {
            await dispatch(eventByIdFetch(eventId));
        }
    };

    // Function to render interactive stars
    function renderInteractiveStars(averageRating: any) {
        return (
            <Box display="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                        key={star}
                        sx={{ cursor: 'pointer' }}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => handleRatingClick(star)}
                    >
                        {(hoverRating || userRating) >= star ? (
                            <StarIcon sx={{ color: '#FFD700', fontSize: '1.5rem' }} />
                        ) : (
                            <StarBorderIcon sx={{ color: '#FFD700', fontSize: '1.5rem' }} />
                        )}
                    </Box>
                ))}
            </Box>
        );
    };
    return (
        <>
            <Box p={3} m={3} alignItems="center">
                {/* Title */}
                <Typography
                    fontSize={{ xs: "24px", sm: "26px", md: "28px" }}
                    fontWeight="bold"
                    textAlign={{ xs: "center", sm: "start", md: "start", lg: "start" }}
                    mb={2}
                    ml={{ xs: 0, sm: 0, md: 12 }}
                >
                    Rate & Reviews
                </Typography>

                <Grid container justifyContent="center" spacing={2}>
                    {/* Overall Rating */}
                    <Grid item xs={12} sm={12} md={5} p={3}>
                        <Typography fontSize={{ xs: "14px", sm: "16px", md: "20px" }} fontWeight="bold">
                            Overall Rating
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            textAlign="center"
                        >
                            <Box alignItems="center" mt={1}>
                                <Typography fontSize={{ xs: "28px", sm: "32px", md: "40px" }} fontWeight="bold">
                                    {userRating > 0 ? `${userRating} / 5` : '0 / 5'}
                                </Typography>

                                <Box ml={1}>
                                    {userRating > 0 ? renderInteractiveStars(userRating) : renderInteractiveStars(4.7)}
                                </Box>
                            </Box>
                            <Typography fontSize="0.9rem" mt={1} color="black">
                                {`Based on ${reviewCount} reviews`}
                                {/* {userRating > 0 ? 'Thanks for your rating!' : `based on ${reviewCount} reviews`} */}
                            </Typography>
                        </Box>
                    </Grid>

                    {/* Divider (visible only on md and larger screens) */}
                    <Divider
                        orientation="vertical"
                        flexItem
                        sx={{
                            display: { xs: "none", sm: "none", md: "block" },
                            border: "1px solid black",
                        }}
                    />

                    {/* Review Summary */}
                    <Grid item xs={12} sm={12} md={5} p={3}>
                        <Typography fontSize={{ xs: "14px", sm: "16px", md: "20px" }} fontWeight="bold">
                            Review Summary
                        </Typography>
                        <Box
                            display="flex"
                            flexDirection="column"
                            justifyContent="center"
                            alignItems="center"
                            height="100%"
                            textAlign="center"
                        >
                            {[
                                { label: "Price", value: 4.8 },
                                { label: "Service", value: 4.7 },
                                { label: "Safety", value: 4.8 },
                                { label: "Guide", value: 4.9 },
                            ].map((item) => (
                                <Box key={item.label} display="flex" alignItems="center" mt={1} width="100%">
                                    <Typography sx={{ width: "80px", textAlign: "left" }}>{item.label}</Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={(item.value / 5) * 100}
                                        sx={{
                                            width: "100%",
                                            mx: 1,
                                            height: 8,
                                            borderRadius: 5,
                                            backgroundColor: "#ddd",
                                        }}
                                    />
                                    <Typography>{item.value}/5</Typography>
                                </Box>
                            ))}
                        </Box>
                    </Grid>
                </Grid>
            </Box>

            <Box p={3}>
                {
                    reviews?.length ?
                        <Box>
                            {/* Header & Filter */}
                            <Grid container justifyContent="space-between" alignItems="center">
                                <Typography variant="h6" fontWeight="bold">Reviews</Typography>
                                <Select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    size="small"
                                    sx={{ minWidth: 150, borderRadius: 3 }}
                                >
                                    <MenuItem value="date">Filter by Date</MenuItem>
                                    <MenuItem value="rating">Filter by Rating</MenuItem>
                                </Select>

                            </Grid>

                            {/* Reviews List */}
                            <Box mt={2}>
                                {reviews.map((item: any, index: any) => (
                                    <ReviewCard key={item._id || index} {...item} />
                                ))}
                            </Box>
                        </Box>
                        : <Box
                            sx={{
                                p: 3,
                                border: '1px dashed #ddd',
                                borderRadius: 2,
                                textAlign: 'center',
                                backgroundColor: 'background.paper'
                            }}
                        >
                            <Typography variant="body1" color="text.secondary" gutterBottom>
                                No reviews yet
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Be the first to share your experience!
                            </Typography>
                        </Box>
                }

                {/* Add Review */}
                <Box mt={4} p={3} sx={{ border: "1px solid #ddd", borderRadius: 3 }}>
                    <Typography variant="h6" fontWeight="bold">Add a review</Typography>
                    <Typography color="gray" mb={2}>Leave a review</Typography>

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    placeholder="Your name"
                                    variant="outlined"
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Email Address"
                                    variant="outlined"
                                    type="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    required
                                    fullWidth
                                    name="comment"
                                    value={formData.comment}
                                    onChange={handleInputChange}
                                    placeholder="Your comment"
                                    variant="outlined"
                                    multiline
                                    rows={3}
                                />
                            </Grid>
                        </Grid>

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ mt: 2, bgcolor: "#0C2E4E", "&:hover": { bgcolor: "#011627d9" } }}
                        >
                            Submit review
                        </Button>
                    </form>
                </Box>
            </Box>
        </>
    )
}