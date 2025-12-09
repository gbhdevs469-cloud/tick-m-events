import React, { useState, useEffect, useRef } from 'react';
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
    IconButton,
} from '@mui/material';
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import { useSelector } from 'react-redux';
import { useNavigate,Link} from 'react-router-dom';

import { RootState } from 'src/redux/store';
import { PromotionLogoBar } from 'src/components/brands-logo';
import { eventTypes, pricingOptions } from './utills';

interface HeroSectionProps {
    events: any[];
    onEventsFiltered?: (events: any[]) => void;
}

export default function HeroSection({ events, onEventsFiltered }: HeroSectionProps) {
    const { promotionLogos } = useSelector((state: RootState) => state.customization);
    const navigate = useNavigate();
    const [tab, setTab] = useState(0);
    const [filters, setFilters] = useState({
        eventType: '',
        location: '',
        date: '',
        pricing: ''
    });

    const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
    const [locations, setLocations] = useState<string[]>(['All']);

    useEffect(() => {
        if (onEventsFiltered) {
            onEventsFiltered(filteredEvents);
        }
    }, [filteredEvents, onEventsFiltered]);

    // Extract unique locations from events
    useEffect(() => {
        if (events && events.length > 0) {
            const uniqueLocations = [...new Set(events.map((event: any) => {
                const locationParts = event.location.split(',');
                return locationParts[0]?.trim() || event.location;
            }))];
            setLocations(['All', ...uniqueLocations]);
        }
    }, [events]);

    // Apply filters whenever filters or tab change
    useEffect(() => {
        if (!events) return;

        let result = [...events];

        // Tab filter (Online vs Live events)
        if (tab === 1) {
            result = result.filter(event => event.format === 'Online');
        } else if (tab === 2) {
            result = result.filter(event => event.format === 'In-person');
        }

        // Event Type filter
        if (filters.eventType && filters.eventType !== 'All') {
            result = result.filter(event => event.eventType === filters.eventType);
        }

        // Location filter
        if (filters.location && filters.location !== 'All') {
            result = result.filter(event => {
                const eventLocation = event.location.split(',')[0]?.trim();
                return eventLocation === filters.location;
            });
        }

        // Date filter
        if (filters.date) {
            result = result.filter(event => event.date === filters.date);
        }

        // Pricing filter
        if (filters.pricing && filters.pricing !== 'All') {
            if (filters.pricing === 'Free') {
                result = result.filter(event => event.payStatus === 'free');
            } else if (filters.pricing === 'Paid') {
                result = result.filter(event => event.payStatus === 'paid');
            }
        }

        setFilteredEvents(result);
    }, [events, tab, filters]);

    const handleFilterChange = (filterType: any, value: any) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    const handleSearch = () => {
        console.log('Search triggered with filters:', filters);
    };

    const clearFilters = () => {
        setFilters({
            eventType: '',
            location: '',
            date: '',
            pricing: ''
        });
        setTab(0);
    };
    const handleButtonClick = (path: string) => {
        navigate(path);
    };

    return (
        <Box>
            {/* HERO SECTION WITH VIDEO/CAROUSEL BACKGROUND */}
            <Box
                sx={{
                    position: 'relative',
                    height: {
                        xs: '80vh', // Smaller height for mobile
                        sm: '85vh', // Slightly taller for small devices
                        md: '90vh', // Original height for medium
                        lg: '90vh', // Maintain for large
                        xl: '95vh'  // Taller for extra large screens
                    },
                    minHeight: {
                        xs: '400px', // Smaller min-height for mobile
                        sm: '450px',
                        md: '500px', // Original
                        lg: '550px',
                        xl: '600px'
                    },
                    overflow: 'hidden',
                    color: '#fff',
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 0,
                    }}
                >
                    <Box
                        component="img"
                        src='/assets/home-banner/01.png'
                        alt='banner_01'
                        sx={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            opacity: 0.9
                        }}
                    />
                </Box>

                {/* Content */}
                <Box
                    position="relative"
                    zIndex={2}
                    sx={{
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        textAlign: 'center',
                        px: {
                            xs: 1, // Less padding on mobile
                            sm: 2, // Standard padding for small
                            md: 3, // More padding for medium and up
                            lg: 4
                        },
                    }}
                >
                    {/* Main Title */}
                    <Typography
                        variant="h3"
                        fontWeight="bold"
                        sx={{
                            fontSize: {
                                xs: '1.5rem', // Smaller for mobile
                                sm: '2rem',   // Medium for small devices
                                md: '2.5rem', // Original size
                                lg: '3rem',   // Larger for desktop
                                xl: '3.5rem'  // Even larger for big screens
                            },
                            mb: {
                                xs: 1, // Less margin on mobile
                                sm: 1.5,
                                md: 2, // Original
                                lg: 2.5
                            },
                            textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                            px: {
                                xs: 1, // Horizontal padding for very small screens
                                sm: 0
                            }
                        }}
                    >
                        Organize. Book. Save time. TICK-M EVENTS is revolutionizing events in Africa
                    </Typography>

                    {/* Subtitle */}
                    <Typography
                        variant="h6"
                        fontWeight="medium"
                        sx={{
                            mb: {
                                xs: 2, // Less margin on mobile
                                sm: 3,
                                md: 4, // Original
                                lg: 4
                            },
                            maxWidth: {
                                xs: '90%', // Use more width on mobile
                                sm: '85%',
                                md: '800px', // Original
                                lg: '900px',
                                xl: '1000px'
                            },
                            fontSize: {
                                xs: '0.9rem', // Smaller text on mobile
                                sm: '1rem',   // Standard for small
                                md: '1.1rem', // Slightly larger for medium
                                lg: '1.2rem'  // Larger for desktop
                            },
                            textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
                            px: {
                                xs: 1, // Horizontal padding for very small screens
                                sm: 0
                            }
                        }}
                    >
                        A single platform to manage your events, sell your tickets, find quality service providers and live unforgettable experiences.
                    </Typography>

                    {/* Three Action Buttons in Rounded Rectangle */}
                    <Paper
                        elevation={6}
                        sx={{
                            borderRadius: {
                                xs: 2, // Smaller border radius on mobile
                                sm: 3,
                                md: 4  // Original
                            },
                            p: {
                                xs: 2, // Less padding on mobile
                                sm: 2.5,
                                md: 3  // Original
                            },
                            bgcolor: 'rgba(255, 255, 255, 0.15)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.2)',
                            mb: {
                                xs: 2, // Less margin on mobile
                                sm: 3,
                                md: 4  // Original
                            },
                            mx: {
                                xs: 1, // Horizontal margin on mobile
                                sm: 2,
                                md: 0
                            },
                            width: {
                                xs: '95%', // Full width with small margins on mobile
                                sm: '90%',
                                md: '78%' // Auto width for larger screens
                            }
                        }}
                    >
                        <Grid
                            container
                            justifyContent="center"
                            spacing={{
                                xs: 2, // Smaller spacing on mobile
                                sm: 2.5,
                                md: 3   // Original
                            }}
                        >
                            {[
                                { text: "Create my event", path: "/register" },
                                { text: "I'm looking for an event", path: "/sign-in" },
                                { text: "I find a service provider", path: "/sign-in" },
                            ].map((item, index) => (
                                <Grid item
                                    key={index}
                                    xs={12} // Full width on extra small screens
                                    sm={6}  // 2 columns on small screens
                                    md={4}  // 3 columns on medium and up
                                >
                                    <Button
                                        variant="contained"
                                        startIcon={<CheckCircleIcon sx={{ color: "white" }} />}
                                        onClick={() => handleButtonClick(item.path)}
                                        // component={Link}    
                                        // to={item.path}
                                        sx={{
                                            bgcolor: '#00AEEF',
                                            color: 'white',
                                            borderRadius: {
                                                xs: 2, // Smaller on mobile
                                                sm: 2.5,
                                                md: 3   // Original
                                            },
                                            px: {
                                                xs: 3, // Less horizontal padding on mobile
                                                sm: 3.5,
                                                md: 4   // Original
                                            },
                                            py: {
                                                xs: 1, // Less vertical padding on mobile
                                                sm: 1.25,
                                                md: 1.5 // Original
                                            },
                                            fontWeight: 'bold',
                                            textTransform: 'none',
                                            minWidth: {
                                                xs: '100%', // Full width on mobile
                                                sm: '200px', // Fixed width on small and up
                                                md: '220px'  // Original
                                            },
                                            width: {
                                                xs: '100%', // Full width on mobile
                                                sm: 'auto'   // Auto width on larger screens
                                            },
                                            fontSize: {
                                                xs: '0.8rem', // Smaller text on mobile
                                                sm: '0.9rem',
                                                md: '1rem'    // Original
                                            },
                                            '&:hover': {
                                                bgcolor: '#0088cc',
                                                transform: {
                                                    xs: 'translateY(-1px)', // Smaller transform on mobile
                                                    sm: 'translateY(-2px)'  // Original
                                                },
                                                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                                            },
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {item.text}
                                    </Button>
                                </Grid>
                            ))}
                        </Grid>
                    </Paper>
                </Box>
            </Box>

            {/* SEARCH BOX */}
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 4,
                    p: 3,
                    mt: -8,
                    maxWidth: 1050,
                    mx: 'auto',
                    position: 'relative',
                    zIndex: 2,
                    bgcolor: '#fff',
                    color: '#000',
                }}
            >
                <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ xs: "flex-start", sm: "center" }}
                    flexWrap="wrap"
                    mb={2}
                    gap={2}
                >
                    <Box sx={{ width: "100%", overflowX: "auto" }}>
                        <Tabs
                            value={tab}
                            onChange={(e, val) => setTab(val)}
                            textColor="inherit"
                            variant="scrollable"
                            scrollButtons="auto"
                            TabIndicatorProps={{ style: { display: "none" } }}
                            sx={{
                                minHeight: "40px",
                                "& .MuiTabs-flexContainer": {
                                    gap: 1,
                                },
                            }}
                        >
                            <Tab
                                label="All Events"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    px: { xs: 1, sm: 2, md: 3 },
                                    py: 1,
                                    mr: 1,
                                    backgroundColor: tab === 0 ? '#00AEEF' : 'transparent',
                                    color: tab === 0 ? '#fff' : '#000',
                                }}
                            />
                            <Tab
                                label="Online Events"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    px: { xs: 1, sm: 2, md: 3 },
                                    py: 1,
                                    mr: 1,
                                    backgroundColor: tab === 1 ? '#00AEEF' : 'transparent',
                                    color: tab === 1 ? '#fff' : '#000',
                                }}
                            />
                            <Tab
                                label="Live Events"
                                sx={{
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    px: { xs: 1, sm: 2, md: 3 },
                                    py: 1,
                                    backgroundColor: tab === 2 ? '#00AEEF' : 'transparent',
                                    color: tab === 2 ? '#fff' : '#000',
                                }}
                            />
                        </Tabs>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                        <PersonIcon fontSize="small" sx={{ color: '#000' }} />
                        <Typography variant="body2" color="text.primary">
                            {filteredEvents.length} events found
                        </Typography>
                    </Box>
                </Box>


                {/* Search Form */}
                <Box
                    display="flex"
                    flexDirection={{ xs: 'column', md: 'row' }}
                    alignItems="center"
                    justifyContent="space-between"
                    p={2}
                    border="1px solid #e0e0e0"
                    borderRadius={3}
                    gap={2}
                >
                    {/* Event Type */}
                    <TextField
                        select
                        fullWidth
                        label="Event Type"
                        value={filters.eventType}
                        onChange={(e) => handleFilterChange('eventType', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true, style: { color: '#000' } }}
                        InputLabelProps={{ style: { color: '#000' } }}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">All Types</MenuItem>
                        {eventTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                                {type}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Event Location */}
                    <TextField
                        select
                        fullWidth
                        label="Event Location"
                        value={filters.location}
                        onChange={(e) => handleFilterChange('location', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true, style: { color: '#000' } }}
                        InputLabelProps={{ style: { color: '#000' } }}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">All Locations</MenuItem>
                        {locations.map((loc) => (
                            <MenuItem key={loc} value={loc}>
                                {loc}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Event Date */}
                    <TextField
                        fullWidth
                        type="date"
                        label="Event Date"
                        value={filters.date}
                        onChange={(e) => handleFilterChange('date', e.target.value)}
                        variant="standard"
                        InputLabelProps={{ shrink: true, style: { color: '#000' } }}
                        InputProps={{ disableUnderline: true, style: { color: '#000' } }}
                        sx={{ minWidth: 150 }}
                    />

                    {/* Pricing */}
                    <TextField
                        select
                        fullWidth
                        label="Pricing"
                        value={filters.pricing}
                        onChange={(e) => handleFilterChange('pricing', e.target.value)}
                        variant="standard"
                        InputProps={{ disableUnderline: true, style: { color: '#000' } }}
                        InputLabelProps={{ style: { color: '#000' } }}
                        sx={{ minWidth: 150 }}
                    >
                        <MenuItem value="">All Pricing</MenuItem>
                        {pricingOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>

                    {/* Action Buttons */}
                    <Box display="flex" gap={1}>
                        <Button
                            variant="outlined"
                            onClick={clearFilters}
                            sx={{
                                textTransform: 'none',
                                borderRadius: 2,
                                px: 2,
                            }}
                        >
                            Clear
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SearchIcon />}
                            onClick={handleSearch}
                            sx={{
                                minWidth: 160,
                                bgcolor: '#002d72',
                                color: '#fff',
                                fontWeight: 'bold',
                                textTransform: 'none',
                                px: 3,
                                py: 1.5,
                                borderRadius: 2,
                                '&:hover': {
                                    bgcolor: '#001f4f',
                                },
                            }}
                        >
                            Find Events
                        </Button>
                    </Box>
                </Box>
            </Paper>

            {/* BRANDS SECTION */}
            <PromotionLogoBar
                brands={promotionLogos}
                mainHead="Premium Brands"
                subHead="Unveil the Finest Selection of High-End Vehicles"
            />
        </Box>
    );
}