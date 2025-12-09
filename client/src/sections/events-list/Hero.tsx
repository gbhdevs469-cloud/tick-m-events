import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Tabs,
    Tab,
    TextField,
    MenuItem,
    Button,
    Grid,
    Paper,
    InputAdornment,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import PersonIcon from "@mui/icons-material/Person";
import SearchIcon from '@mui/icons-material/Search';
import CategoryIcon from "@mui/icons-material/Category";
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined';

interface Event {
    _id: string;
    eventName?: string;
    location?: string;
    status?: string;
    date?: string;
    eventType?: string;
    tickets?: any[];
    category: string;
    averageRating?: number;
}

interface HeroSectionProps {
    approvedEvents: Event[];
    loading: boolean;
    onFilterChange?: (filters: {
        eventType: string;
        eventLocation: string;
        eventDate: string;
        eventPricing: string;
    }) => void;
}

export default function HeroSection({ approvedEvents, loading, onFilterChange }: HeroSectionProps) {
    const [tab, setTab] = useState(0);
    const [eventType, setEventType] = useState('');
    const [eventLocation, setEventLocation] = useState('');
    const [eventDate, setEventDate] = useState('');
    const [eventPricing, setEventPricing] = useState('');

    // Get unique event locations
    const eventLocations = useMemo(() => {
        const locations = approvedEvents
            .map((event) => event.location?.trim() || "")
            .filter((loc) => loc !== "");
        return Array.from(new Set(locations));
    }, [approvedEvents]);

    // Apply filters callback
    const applyFilters = useCallback(() => {
        const filters = { eventType, eventLocation, eventDate, eventPricing };
        if (onFilterChange) onFilterChange(filters);
    }, [eventType, eventLocation, eventDate, eventPricing, onFilterChange]);

    // Clear filters
    const clearFilters = useCallback(() => {
        setEventType('');
        setEventLocation('');
        setEventDate('');
        setEventPricing('');
        if (onFilterChange) onFilterChange({ eventType: '', eventLocation: '', eventDate: '', eventPricing: '' });
    }, [onFilterChange]);

    // Auto-apply filters when values change
    useEffect(() => {
        applyFilters();
    }, [applyFilters]);

    return (
        <Box mt={4}>
            {/* HERO SECTION */}
            <Box
                sx={{
                    maxWidth: 1100,
                    mx: "auto",
                    px: 2,
                    borderRadius: 1,
                    overflow: "hidden",
                    backgroundImage: 'url(/assets/images/event/eventList-hero.jpg)',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    color: '#fff',
                    py: { xs: 8, md: 12 },
                    textAlign: 'center',
                    position: 'relative',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        background: '#0C2E4EE5',
                        opacity: 0.91,
                        zIndex: 0,
                    },
                }}
            >
                <Box position="relative" zIndex={1} px={2}>
                    <Button
                        variant="contained"
                        sx={{
                            bgcolor: "#2296D4",
                            color: "#fff",
                            fontWeight: "medium",
                            textTransform: "none",
                            px: 3,
                            py: 1.5,
                            fontSize: "1rem",
                            borderRadius: 2,
                            '&:hover': { bgcolor: "#1a7cb3" },
                        }}
                    >
                        Find The Best Event Near You
                    </Button>

                    <Typography variant="h3" fontWeight="bold" sx={{ fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' } }}>
                        Uncover Your Dream Events
                    </Typography>
                    <Typography variant="h6" fontWeight="medium" gutterBottom>
                        Search and find your best event with easy way
                    </Typography>
                </Box>
            </Box>

            {/* SEARCH BOX */}
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    p: 3,
                    mt: -6,
                    maxWidth: 1000,
                    mx: "auto",
                    position: "relative",
                    zIndex: 2,
                    bgcolor: "#fff",
                    color: "#000",
                    border: "1px solid #e0e0e0",
                }}
            >
                {/* Tabs + Info */}
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} flexWrap="wrap">
                    <Tabs
                        value={tab}
                        onChange={(e, val) => setTab(val)}
                        textColor="inherit"
                        TabIndicatorProps={{ style: { display: "none" } }}
                    >
                        {["All Events", "Online Events", "Live Events"].map((label, i) => (
                            <Tab
                                key={label}
                                label={label}
                                sx={{
                                    textTransform: "none",
                                    fontWeight: "bold",
                                    borderRadius: 2,
                                    px: 3,
                                    py: 1,
                                    mr: 1,
                                    backgroundColor: tab === i ? "#00AEEF" : "transparent",
                                    color: tab === i ? "#fff" : "#000",
                                    minHeight: "auto",
                                }}
                            />
                        ))}
                    </Tabs>

                    <Box display="flex" alignItems="center" gap={1} mt={{ xs: 2, md: 0 }}>
                        <PersonIcon fontSize="small" sx={{ color: "#000" }} />
                        <Typography variant="body2" color="text.primary">
                            Need more information?
                        </Typography>
                    </Box>
                </Box>

                {/* Filters Grid */}
                <Grid container spacing={2} alignItems="center">
                    {/* Event Type */}
                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth size="small">
                            <InputLabel shrink sx={{ fontWeight: "bold", color: "#555" }}>Event Type</InputLabel>
                            <Select
                                displayEmpty
                                value={eventType}
                                onChange={(e) => setEventType(e.target.value)}
                                renderValue={(selected) => selected || <Box display="flex" alignItems="center" gap={1}><CategoryIcon fontSize="small" sx={{ color: "#777" }} /><Typography variant="body2" color="#777">Select Event Type</Typography></Box>}
                            >
                                <MenuItem value="Public">Public</MenuItem>
                                <MenuItem value="Private">Private</MenuItem>
                                <MenuItem value="Online">Online</MenuItem>
                                <MenuItem value="Live">Live</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Event Location */}
                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth size="small">
                            <InputLabel shrink sx={{ fontWeight: "bold", color: "#555" }}>Event Location</InputLabel>
                            <Select
                                displayEmpty
                                value={eventLocation}
                                onChange={(e) => setEventLocation(e.target.value)}
                                renderValue={(selected) => selected || <Box display="flex" alignItems="center" gap={1}><LocationOnOutlinedIcon fontSize="small" sx={{ color: "#777" }} /><Typography variant="body2" color="#777">Select Location</Typography></Box>}
                            >
                                {eventLocations.map((loc) => <MenuItem key={loc} value={loc}>{loc}</MenuItem>)}
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Event Date */}
                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth size="small">
                            <TextField
                                type="date"
                                label="Event Date"
                                value={eventDate}
                                onChange={(e) => setEventDate(e.target.value)}
                                InputLabelProps={{ shrink: true, sx: { fontWeight: "bold", color: "#555" } }}
                                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarTodayIcon fontSize="small" sx={{ color: "#777" }} /></InputAdornment> }}
                                sx={{ '& .MuiInputBase-input': { padding: '8.5px 14px' } }}
                            />
                        </FormControl>
                    </Grid>

                    {/* Event Pricing */}
                    <Grid item xs={12} sm={6} md={2.4}>
                        <FormControl fullWidth size="small">
                            <InputLabel shrink sx={{ fontWeight: "bold", color: "#555" }}>Event Pricing</InputLabel>
                            <Select
                                displayEmpty
                                value={eventPricing}
                                onChange={(e) => setEventPricing(e.target.value)}
                                renderValue={(selected) => selected || <Box display="flex" alignItems="center" gap={1}><MonetizationOnOutlinedIcon fontSize="small" sx={{ color: "#777" }} /><Typography variant="body2" color="#777">Select Pricing</Typography></Box>}
                            >
                                <MenuItem value="Free">Free</MenuItem>
                                <MenuItem value="Paid">Paid</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    {/* Action Buttons */}
                    <Grid item xs={12} sm={12} md={2.4}>
                        <Box display="flex" gap={1}>
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<SearchIcon />}
                                sx={{
                                    bgcolor: "#002d72",
                                    color: "#fff",
                                    fontWeight: "bold",
                                    textTransform: "none",
                                    px: 2,
                                    py: 1.2,
                                    borderRadius: 2,
                                    height: "40px",
                                    "&:hover": { bgcolor: "#001f4f" },
                                }}
                                onClick={applyFilters}
                            >
                                Find Event
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
}
