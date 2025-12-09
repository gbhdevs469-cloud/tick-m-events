import { Box, Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "src/redux/store";
import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

import { publicHomeEventsFetch } from "src/redux/actions/home-recommendation.action";
import Header from "src/components/Header";
import Footer from "src/components/Footer";
import { getPromotionLogo } from "src/redux/actions/customization/promotion-logo";

import UpcomingEvents from "./upcoming-events";
import HeroSection from "./hero";
import LiveEventPromo from "./live-events";
import BrowseByType from "./browse-by-type";
import HowItWorks from "./how-it-work";
import EventsBlog from "./event-blog";
import TrustedExpertise from "./trusted-experties";
import Testimonial from "./testimonial";


export function GlobalHome() {
    const dispatch = useDispatch<AppDispatch>();
    const { upcomingHomeEvents, loading } = useSelector((state: any) => state.homeRecom);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const faqSectionRef = useRef<HTMLDivElement>(null);
    const location = useLocation();

    const approvedEvents = useMemo(() =>
        filteredEvents?.filter((event: any) => event.status === 'approved' && event.eventType!=="Private") || []
        , [filteredEvents]);

    useEffect(() => {
        dispatch(getPromotionLogo())
        dispatch(publicHomeEventsFetch());
    }, [dispatch]);

    // Initialize filtered events with all events when data loads
    useEffect(() => {
        if (upcomingHomeEvents && upcomingHomeEvents.length > 0) {
            setFilteredEvents(upcomingHomeEvents);
        }
    }, [upcomingHomeEvents]);

    const handleEventsFiltered = (events: any) => {
        setFilteredEvents(events);
    };

    useEffect(() => {
        if (location.state?.scrollTo === 'blog' && faqSectionRef.current) {
            faqSectionRef.current.scrollIntoView({ behavior: 'smooth' });
            // Clear the state to prevent scrolling on every render
            window.history.replaceState({}, document.title);
        }
    }, [location]);

    return (
        <Box>
            <Header />

            <HeroSection
                events={upcomingHomeEvents}
                onEventsFiltered={handleEventsFiltered}
            />
            <UpcomingEvents
                title="Upcoming Events"
                des="The world's leading car brands"
                filterdEvent={approvedEvents}
                loading={loading}
            />
            <LiveEventPromo />
            <BrowseByType />
            <HowItWorks />
            <Testimonial />
            <UpcomingEvents
                title="Events Listings" des="Find the perfect events for any occasion" />
            <TrustedExpertise />
            <div ref={faqSectionRef}>
                <EventsBlog />

            </div>
            <Footer />
        </Box>
    )
}