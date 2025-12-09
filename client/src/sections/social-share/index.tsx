import { Box, Card, CardContent, CardMedia, Typography, Button } from "@mui/material";
import { Helmet } from "react-helmet";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

interface PostData {
    eventName?: string;
    description: string;
    imageUrl: string;
    platform: string;
    hashtag: string;
    reservationLink: string;
}

export function SocialShare() {
    const { id } = useParams();
    const [post, setPost] = useState<PostData | null>(null);

    useEffect(() => {
        if (id) {
            axios.get(`/api/v1/promotion/social-share/${id}`) 
                .then(res => {
                    console.log("res",res);
                    const data = res.data;
                    const postData: PostData = {
                        eventName: data.eventName || "Event",
                        description: data.description,
                        imageUrl: data.imageUrl,
                        platform: data.platform,
                        hashtag: data.hashtag || "#Event",
                        reservationLink: data.reservationLink
                    };
                    setPost(postData);
                })
                .catch(err => console.error("Failed to fetch post data", err));
        }
    }, [id]);

    if (!post) return <Typography textAlign="center">Loading...</Typography>;

    return (
        <>
            <Helmet>
                <title>{post.eventName}</title>
                <meta property="og:title" content={post.eventName} />
                <meta property="og:description" content={post.description} />
                <meta property="og:image" content={post.imageUrl} />
                <meta property="og:url" content={`http://localhost:3039/post/${id}`} />
                <meta property="og:type" content="website" />
            </Helmet>

            <Box display="flex" justifyContent="center" mt={4}>
                <Card sx={{ maxWidth: 600 }}>
                    <CardMedia
                        component="img"
                        height="300"
                        image={post.imageUrl}
                        alt="Event"
                    />
                    <CardContent>
                        <Typography variant="h6" color="text.secondary">
                            Platform: {post.platform}
                        </Typography>
                        <Typography variant="body1" my={2}>
                            {post.description}
                        </Typography>
                        <Typography variant="body2" color="primary">
                            {post.hashtag}
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            href={post.reservationLink}
                            target="_blank"
                            sx={{ mt: 2 }}
                        >
                            Reserve Now
                        </Button>
                    </CardContent>
                </Card>
            </Box>
        </>
    );
}
