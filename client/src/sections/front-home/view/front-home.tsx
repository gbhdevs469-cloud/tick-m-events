import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Divider, Button, Box, Typography, Card, useMediaQuery, useTheme, } from "@mui/material";

import MenuIcon from '@mui/icons-material/Menu';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShareIcon from '@mui/icons-material/Share'; // Import the Share icon
import { styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';

// import { NavHomeTwo } from "../nav-two";
import { Breadcrumb } from "src/components/breadcrumb/breadcrumb";
import { AppDispatch, RootState } from "src/redux/store";
import { eventByIdFetch, eventAddToWishlist } from "src/redux/actions/event.action";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import Header from "src/components/Header";
import { getPromotionLogo } from "src/redux/actions/customization/promotion-logo";
import { PromotionLogoBar } from "src/components/brands-logo";

import { BannerGallery } from "../banner-gallery";
import { TrackingSystem } from "../tracking-system";
import { ContactAndSharing } from "../contact-and-sharing";
import { CountDownCounter } from "../count-down-counter";
import { RateAndReview } from "../rate-and-review";
import { FriendWhoBooked } from "../friend-who-booked";
import { LiveChat } from "../live-chat";



export function FrontHome() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { authenticate } = useSelector((state: RootState) => state?.auth)
    const { promotionLogos, loading } = useSelector((state: RootState) => state.customization);

    const { eventId } = useParams();
    const { _id, eventName, date, time, portraitImage, coverImage, location, formate, description,
        organizer, customization, tickets, averageRating, reviewCount, review
    } = useSelector((state: RootState) => state?.event?.eventWithDetails);

    const wishlist = useSelector((state: RootState) => state.event.wishlist);
    const isWishlisted = wishlist?.some((item: any) => item?.eventId?._id === _id);
    useEffect(() => {
        const fetchEvent = async () => {
            await dispatch(eventByIdFetch(eventId));
        };
        fetchEvent();
    }, [dispatch, eventId]);
    useEffect(() => {
        dispatch(getPromotionLogo())
    }, [dispatch]);


    const handleAddToWishlist = async () => {
        const redirectUrl = `/our-event/${eventId}`
        if (!authenticate) {
            sessionStorage.setItem('redirectAfterLogin', JSON.stringify({
                type: 'wishlist',
                eventId: _id,
                redirectTo: redirectUrl
            }));
            navigate("/sign-in", { state: { from: redirectUrl } });
            return;
        }

        try {
            const result = await dispatch(eventAddToWishlist({
                selectedViewEvent: {
                    _id,
                    eventName,
                    date,
                    time,
                    coverImage,
                    location,
                    formate,
                    customization,
                    averageRating,
                },
            }));

            if (result?.status === 201) {
                toast.success("Added to wishlist");
            } else {
                toast.error(result.message);
            }
        } catch (error) {
            toast.error("Server maintenance");
        }
    };

    return (
        <>
            <Header />
            <Box sx={{ p: 3 }} key={_id}>
                {/* Breadcrumb */}
                <Breadcrumb eventName={eventName} date={date} time={time} />


                {/* Main Event Banner */}
                <BannerGallery portraitImage={portraitImage} coverImage={coverImage} eventName={eventName} description={description} date={date} time={time} />

                {/* Event Description */}
                <Card sx={{ mt: 3, p: 3, borderRadius: "15px", backgroundColor: "#2296D4", color: "white" }}>
                    <Box maxWidth={900}>
                        <HeadingCommon title='Event Description' variant="h5" color="white" baseSize="40px" mb={0} weight={600} />
                        {ReactHtmlParser(description)}

                        {/* <Typography mt={2}>
                            Registration is required before November 10, 2025. Don’t miss out on this incredible event!
                        </Typography> */}
                    </Box>
                    {/* Action Buttons */}
                    <Box display="flex" justifyContent="end" gap={2} mt={2}>
                        {/* <Button
                            variant="outlined"
                            sx={{
                                color: "white",
                                borderColor: "white",
                                borderRadius: 8,
                                "&:hover": {
                                    borderColor: "white", // Ensures border stays white on hover
                                    backgroundColor: "rgba(255, 255, 255, 0.1)" // Optional: subtle hover effect
                                }
                            }}
                            startIcon={<ShareIcon />} // Add icon to the left of text
                        >
                            Share
                        </Button> */}
                        <Button
                            variant="outlined"
                            onClick={handleAddToWishlist}
                            sx={{
                                color: "white",
                                borderColor: "white",
                                borderRadius: 8,
                                "&:hover": {
                                    borderColor: "white",
                                    backgroundColor: "rgba(255, 255, 255, 0.1)"
                                }
                            }}
                            startIcon={isWishlisted ? <FavoriteIcon sx={{ color: "white" }} /> : <FavoriteBorderIcon sx={{ color: "white" }} />}
                        >
                            Wishlist
                        </Button>
                    </Box>
                </Card>

                {/* Tracking system */}
                <TrackingSystem
                    eventName={eventName}
                    eventId={_id}
                    tickets={tickets}
                    location={location}
                    date={date}
                    time={time}
                />

                {/* Contact and Sharing Section */}
                <ContactAndSharing organizer={organizer} />

                {/* Count Down System */}
                <CountDownCounter date={date} time={time} />

                {/* Rate and Review */}
                <RateAndReview reviews={review} reviewCount={reviewCount} rating={averageRating} />

                {/* Rate and Review */}
                <PromotionLogoBar
                    brands={promotionLogos}
                    mainHead="Premium Brands"
                    subHead="Unveil the Finest Selection of High-End Vehicles"
                />
                {/* Rate and Review */}
                {/* <FriendWhoBooked /> */}

                {/* Rate and Review */}
                {/* <LiveChat /> */}
            </Box>
        </>
    );
}