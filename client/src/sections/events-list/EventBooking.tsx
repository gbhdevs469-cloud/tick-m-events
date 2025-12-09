import React, { useState, useEffect, useMemo, useRef, useCallback } from "react";
import {
  Container, Grid, Typography, Card, CardContent, CardMedia, Button, Box, Slider, Checkbox, FormControlLabel, Rating, Pagination,
  useTheme,
  useMediaQuery,
  Paper,
  Divider, IconButton,
  Collapse, Tabs, Tab, FormControl,
  InputLabel,
  Select,
  MenuItem, Stack, TextField, InputAdornment,
  Drawer
} from "@mui/material";
import {
  Star as StarIcon,
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  Event as EventIcon,
  ExpandMore as ExpandMoreIcon,
  ExpandLess as ExpandLessIcon,
  LocationOn as LocationOnOutlinedIcon,
  CalendarToday as CalendarTodayOutlinedIcon,
  MonetizationOn as MonetizationOnOutlinedIcon,
  ArrowForward as ArrowForwardIcon,
  PhoneIphone as PhoneIphoneOutlinedIcon,
  Email as EmailOutlinedIcon,
  WhatsApp as WhatsAppIcon,
  Print as FaxOutlinedIcon,
  Search as SearchIcon,
  Category as CategoryIcon,
  FilterList as FilterListIcon,
  Close as CloseIcon
} from "@mui/icons-material";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from 'src/redux/store';
import { eventFetch, fetchAllCategories } from 'src/redux/actions/event.action';
import { useNavigate } from "react-router-dom";
import axios from 'src/redux/helper/axios';

type EventTicketDetail = {
  ticketType?: string;
  id?: string;
  price?: string | number;
  totalTickets?: string;
  description?: string;
  isLimitedSeat?: boolean;
  isLinkPramotion?: boolean;
};

type EventTicketGroup = {
  _id?: string;
  eventId?: string;
  payStatus?: "free" | "paid";
  tickets?: EventTicketDetail[];
};

type Event = {
  _id: string;
  eventName?: string;
  coverImage?: { url?: string };
  portraitImage?: { url?: string };
  averageRating?: number;
  reviewCount?: number;
  location?: string;
  date?: string;
  time?: string;
  eventType?: string;
  tickets?: EventTicketGroup[];
  category: string;
  status?: string;
  urlSlug?:string;
};

interface EventBookingProps {
  filteredEvents: Event[];
  onFilterChange?: (filters: {
    eventType: string;
    eventLocation: string;
    eventDate: string;
    eventPricing: string;
    tabValue: string;
  }) => void;
}

const EventBooking: React.FC<EventBookingProps> = ({
  filteredEvents: propFilteredEvents,
  onFilterChange
}) => {
  // Theme & utilities
  const theme = useTheme();
  const eventsRef = useRef<HTMLDivElement | null>(null);
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  // UI state toggles
  const [showMap, setShowMap] = useState(true);
  const [eventTypeOpen, setEventTypeOpen] = useState(true);
  const [eventLocationOpen, setEventLocationOpen] = useState(true);
  const [reviewOpen, setReviewOpen] = useState(true);

  // Filters state (for sidebar filters only)
  const [tabValue, setTabValue] = useState(0);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [price, setPrice] = useState<number>(5000);
  const [showPrice, setShowPrice] = useState<boolean>(false);

  // Mobile drawer state - ADD THIS
  const [mobileOpen, setMobileOpen] = useState(false);

  // "BOOK THIS EVENT" SECTION STATE VARIABLES
  const [eventType, setEventType] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventPricing, setEventPricing] = useState("");

  // Book Event Filters state
  const [bookEventFilters, setBookEventFilters] = useState({
    eventType: "",
    eventLocation: "",
    eventDate: "",
    eventPricing: "",
    tabValue: "All Events"
  });

  // Data state
  const { fullData } = useSelector((state: RootState) => state.event);
  const { categories, loading: categoriesLoading } = useSelector((state: RootState) => state.event);
  const [loading, setLoading] = useState(true);
  const [showEvents, setShowEvents] = useState(false);

  // Extract only approved events
  const approvedEvents = useMemo(
    () => fullData?.filter((event: any) => event.status === "approved"&& event.eventType !== "Private") || [],
    [fullData]
  );

  // Unique event locations for sidebar filters
  const eventLocations: string[] = useMemo(() => {
    if (!approvedEvents.length) return [];
    const locations = approvedEvents
      .map((event: Event) => event.location?.trim() || "")
      .filter((loc: string) => loc !== "");
    return Array.from(new Set(locations)) as string[];
  }, [approvedEvents]);

  // Events to display - use prop events as base, apply sidebar filters on top
  const [finalFilteredEvents, setFinalFilteredEvents] = useState<Event[]>([]);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;
  const totalPages = Math.ceil(finalFilteredEvents.length / eventsPerPage);
  const startIndex = (currentPage - 1) * eventsPerPage;
  const currentEvents = finalFilteredEvents.slice(startIndex, startIndex + eventsPerPage);

  // Fetch categories & events
  useEffect(() => {
    dispatch(fetchAllCategories() as any);
    dispatch(eventFetch());
  }, [dispatch]);

  // Comprehensive filtering function
  const applyAllFilters = useCallback(() => {
    let filtered = propFilteredEvents;

    // ✅ Category filter
    if (selectedCategories.length > 0) {
      filtered = filtered.filter((event: Event) =>
        selectedCategories.includes(event.category || "")
      );
    }

    // ✅ Location filter (from sidebar checkboxes)
    if (selectedLocations.length > 0) {
      filtered = filtered.filter((event: Event) =>
        selectedLocations.some((loc) =>
          event.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    // ✅ Price filter
    filtered = filtered.filter((event: Event) => {
      const mainTicketGroup = event.tickets?.[0];
      if (!mainTicketGroup) return true;

      if (mainTicketGroup.payStatus === "free") return price >= 0;

      if (mainTicketGroup.payStatus === "paid" && Array.isArray(mainTicketGroup.tickets)) {
        const prices = mainTicketGroup.tickets
          .map((t: any) => parseFloat(String(t.price).replace(/[^\d.]/g, "")))
          .filter((p: number) => !Number.isNaN(p));

        if (prices.length === 0) return true;

        const minPrice = Math.min(...prices);
        return minPrice <= price;
      }

      return true;
    });

    // ✅ Rating filter
    if (selectedRatings.length > 0) {
      filtered = filtered.filter((event: Event) => {
        const rating = event.averageRating || 0;
        return selectedRatings.some((selected) => {
          const lowerBound = selected;
          const upperBound = selected + 1;
          return selected === 5
            ? rating === 5
            : rating >= lowerBound && rating < upperBound;
        });
      });
    }

    // ✅ "Book This Event" Filters
    if (bookEventFilters.eventType) {
      filtered = filtered.filter((event: Event) =>
        event.eventType?.toLowerCase() === bookEventFilters.eventType.toLowerCase()
      );
    }

    if (bookEventFilters.eventLocation) {
      filtered = filtered.filter((event: Event) =>
        event.location?.toLowerCase().includes(bookEventFilters.eventLocation.toLowerCase())
      );
    }

    if (bookEventFilters.eventDate) {
      filtered = filtered.filter((event: Event) =>
        event.date === bookEventFilters.eventDate
      );
    }

    if (bookEventFilters.eventPricing) {
      if (bookEventFilters.eventPricing === "Free") {
        filtered = filtered.filter((event: Event) =>
          event.tickets?.[0]?.payStatus === "free"
        );
      } else if (bookEventFilters.eventPricing === "Paid") {
        filtered = filtered.filter((event: Event) =>
          event.tickets?.[0]?.payStatus === "paid"
        );
      }
    }

    // ✅ Tab filter
    if (bookEventFilters.tabValue === "Online Events") {
      filtered = filtered.filter((event: Event) =>
        event.eventType?.toLowerCase().includes("online") ||
        event.location?.toLowerCase().includes("online")
      );
    } else if (bookEventFilters.tabValue === "Live Events") {
      filtered = filtered.filter((event: Event) =>
        !event.eventType?.toLowerCase().includes("online") &&
        !event.location?.toLowerCase().includes("online")
      );
    }

    setFinalFilteredEvents(filtered);
    setCurrentPage(1);
  }, [propFilteredEvents, selectedCategories, selectedLocations, price, selectedRatings, bookEventFilters]);

  // Apply "Book This Event" filters
  const applyBookEventFilters = useCallback(() => {
    const newFilters = {
      eventType,
      eventLocation,
      eventDate,
      eventPricing,
      tabValue: ["All Events", "Online Events", "Live Events"][tabValue]
    };

    console.log("Applying Book Event Filters:", newFilters);

    // Update the book event filters state
    setBookEventFilters(newFilters);

    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [eventType, eventLocation, eventDate, eventPricing, tabValue, onFilterChange]);

  // Clear "Book This Event" filters
  const clearBookEventFilters = useCallback(() => {
    setEventType("");
    setEventLocation("");
    setEventDate("");
    setEventPricing("");
    setTabValue(0);

    const clearedFilters = {
      eventType: "",
      eventLocation: "",
      eventDate: "",
      eventPricing: "",
      tabValue: "All Events"
    };

    // Clear the book event filters state
    setBookEventFilters(clearedFilters);

    if (onFilterChange) {
      onFilterChange(clearedFilters);
    }
  }, [onFilterChange]);

  // Apply all filters when dependencies change
  useEffect(() => {
    applyAllFilters();
  }, [applyAllFilters]);

  // Update final events when prop events change
  useEffect(() => {
    setFinalFilteredEvents(propFilteredEvents);
    setCurrentPage(1);
  }, [propFilteredEvents]);

  // Delay loading for UI smoothness
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setShowEvents(true);
    }, 1000);

    return () => clearTimeout(timer);
  }, [approvedEvents]);

  // Debug useEffect to see filtering in action
  useEffect(() => {
    console.log("Current Book Event Filters:", bookEventFilters);
    console.log("Final Filtered Events Count:", finalFilteredEvents.length);
  }, [bookEventFilters, finalFilteredEvents]);

  // Mobile drawer handler - ADD THIS
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Clear sidebar filters
  const clearSidebarFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedRatings([]);
    setPrice(5000);
  };

  // Clear price filter
  const clearPriceFilter = () => {
    setPrice(5000);
  };

  // Pagination page change handler
  const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    eventsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Toggle category accordion
  const toggleCategory = (categoryId: string) => {
    setExpandedCategory((prev) => (prev === categoryId ? null : categoryId));
  };

  // Add this state with your other state declarations
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Add these functions with your other functions
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const response = await axios.post('/contact', formData);
      setSubmitStatus({
        success: true,
        message: response.data.message || 'Message sent successfully!'
      });
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error: any) {
      console.log(error);
      setSubmitStatus({
        success: false,
        message: error.response?.data?.message || 'Failed to send message. Please try again.'
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Sidebar content component (extracted for reuse) - ADD THIS
  const sidebarContent = (
    <>
      {/* Show on Map */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Show on map
          </Typography>
          <IconButton size="small" onClick={() => setShowMap(!showMap)}>
            {showMap ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={showMap}>
          <Box
            component="img"
            src="https://cdn.images.express.co.uk/img/dynamic/25/590x/secondary/google-maps-street-view-dead-body-1129572.jpg?r=1686998680160"
            alt="Map"
            sx={{ width: "100%", height: 150, borderRadius: 1, objectFit: "cover" }}
          />
        </Collapse>
      </Paper>

      {/* Filter Price */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="subtitle1" fontWeight="bold">
            Filter Price
          </Typography>
          <IconButton size="small" onClick={() => setShowPrice(!showPrice)}>
            {showPrice ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={showPrice}>
          <Slider
            value={price}
            min={0}
            max={5000}
            step={10}
            onChange={(e, val) => setPrice(val as number)}
            valueLabelDisplay="auto"
            sx={{ mt: 2 }}
          />

          <Box display="flex" justifyContent="space-between">
            <Typography variant="body2">XAF {0}</Typography>
            <Typography variant="body2">XAF {price}</Typography>
          </Box>

          <Box mt={2} display="flex" justifyContent="space-between">
            <Button variant="outlined" size="small" onClick={clearPriceFilter}>
              Clear
            </Button>
            <Button
              variant="contained"
              size="small"
              sx={{ bgcolor: "#0A2647", color: "#fff" }}
              onClick={() => {
                applyAllFilters();
                if (isMobile) handleDrawerToggle(); // Close drawer on mobile after applying
              }}
            >
              Apply
            </Button>
          </Box>
        </Collapse>
      </Paper>

      {/* Event Type */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Event Type
          </Typography>
          <IconButton size="small" onClick={() => setEventTypeOpen(!eventTypeOpen)}>
            {eventTypeOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={eventTypeOpen}>
          <Box sx={{ maxHeight: 300, overflowY: 'auto', mt: 1, pr: 1 }}>
            {loading ? (
              <Typography variant="body2">Loading categories...</Typography>
            ) : categories.length > 0 ? (
              categories.map((category: any) =>
                category.subcategories.length > 0 ? (
                  <Box key={category._id} sx={{ mb: 1 }}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      onClick={() => toggleCategory(category._id)}
                      sx={{
                        cursor: 'pointer',
                        bgcolor: expandedCategory === category._id ? 'action.hover' : 'transparent',
                        px: 1,
                        py: 0.5,
                        borderRadius: 1,
                      }}
                    >
                      <Typography variant="subtitle2" fontWeight="bold">
                        {category.name}
                      </Typography>
                      <IconButton size="small">
                        {expandedCategory === category._id ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                      </IconButton>
                    </Box>

                    <Collapse in={expandedCategory === category._id}>
                      <Box sx={{ pl: 2, pt: 1 }}>
                        {category.subcategories.map((subcategory: any) => (
                          <FormControlLabel
                            key={subcategory._id}
                            control={
                              <Checkbox
                                size="small"
                                checked={selectedCategories.includes(subcategory._id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedCategories([...selectedCategories, subcategory._id]);
                                  } else {
                                    setSelectedCategories(
                                      selectedCategories.filter((c) => c !== subcategory._id)
                                    );
                                  }
                                }}
                              />
                            }
                            label={subcategory.name}
                          />
                        ))}
                      </Box>
                    </Collapse>
                  </Box>
                ) : null
              )
            ) : (
              <Typography variant="body2">No categories available.</Typography>
            )}
          </Box>
        </Collapse>
      </Paper>

      {/* Events Location */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Events Location
          </Typography>
          <IconButton size="small" onClick={() => setEventLocationOpen(!eventLocationOpen)}>
            {eventLocationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>

        <Collapse in={eventLocationOpen}>
          {eventLocations.length > 0 ? (
            eventLocations.map((loc) => (
              <FormControlLabel
                key={loc}
                control={
                  <Checkbox
                    size="small"
                    checked={selectedLocations.includes(loc)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLocations((prev) => [...prev, loc]);
                      } else {
                        setSelectedLocations((prev) => prev.filter((l) => l !== loc));
                      }
                    }}
                  />
                }
                label={loc}
              />
            ))
          ) : (
            <Typography variant="body2" sx={{ mt: 1 }}>
              No locations available.
            </Typography>
          )}
        </Collapse>
      </Paper>

      {/* Review Score */}
      <Paper elevation={1} sx={{ p: 2, borderRadius: 2, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle1" fontWeight="bold">
            Review Score
          </Typography>
          <IconButton size="small" onClick={() => setReviewOpen(!reviewOpen)}>
            {reviewOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </IconButton>
        </Box>
        <Collapse in={reviewOpen}>
          {[5, 4, 3, 2, 1].map((val) => (
            <FormControlLabel
              key={val}
              control={
                <Checkbox
                  size="small"
                  checked={selectedRatings.includes(val)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedRatings((prev) => [...prev, val]);
                    } else {
                      setSelectedRatings((prev) => prev.filter((r) => r !== val));
                    }
                  }}
                />
              }
              label={<Rating value={val} readOnly size="small" />}
            />
          ))}
        </Collapse>
      </Paper>

      {/* Book This Event Section */}
      <Paper elevation={1} sx={{
        borderRadius: 3,
        overflow: "hidden",
        mb: 2
      }}
      >
        {/* Header */}
        <Box sx={{ bgcolor: "#2296D4", p: 2 }}>
          <Typography variant="subtitle1" color="#fff" fontWeight="bold">
            Book This Event
          </Typography>
        </Box>

        {/* Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", pt: 1, mt: 2 }}>
          <Tabs
            value={tabValue}
            onChange={(e, val) => setTabValue(val)}
            variant="fullWidth"
            TabIndicatorProps={{ style: { display: "none" } }}
            sx={{
              "& .MuiTab-root": {
                textTransform: "none",
                fontSize: "0.7rem",
                fontWeight: "bold",
                color: "#555",
                borderRadius: "20px",
                minHeight: "32px",
                margin: "0 4px",
                padding: "6px 12px",
                transition: "all 0.3s ease",
                backgroundColor: "#f5f5f5",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              },
              "& .Mui-selected": {
                backgroundColor: "#2296D4",
                color: "#fff !important",
              },
            }}
          >
            <Tab label="All Events" />
            <Tab label="Online Events" />
            <Tab label="Live Events" />
          </Tabs>
        </Box>

        {/* Form Fields */}
        <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {/* Event Type */}
          <FormControl fullWidth size="small">
            <InputLabel shrink sx={{ fontWeight: "bold", color: "#555" }}>
              Event Type
            </InputLabel>
            <Select
              displayEmpty
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
              renderValue={(selected) =>
                selected || (
                  <Box display="flex" alignItems="center" gap={1}>
                    <CategoryIcon fontSize="small" sx={{ color: "#777" }} />
                    <Typography variant="body2" color="#777">
                      Select Event Type
                    </Typography>
                  </Box>
                )
              }
            >
              <MenuItem value="Public">Public</MenuItem>
              <MenuItem value="Private">Private</MenuItem>
              <MenuItem value="Online">Online</MenuItem>
              <MenuItem value="Live">Live</MenuItem>
            </Select>
          </FormControl>

          {/* Event Location */}
          <FormControl fullWidth size="small">
            <InputLabel shrink sx={{ fontWeight: "bold", color: "#555" }}>
              Event Location
            </InputLabel>
            <Select
              displayEmpty
              value={eventLocation}
              onChange={(e) => setEventLocation(e.target.value)}
              renderValue={(selected) =>
                selected || (
                  <Box display="flex" alignItems="center" gap={1}>
                    <LocationOnOutlinedIcon fontSize="small" sx={{ color: "#777" }} />
                    <Typography variant="body2" color="#777">
                      Select Location
                    </Typography>
                  </Box>
                )
              }
            >
              {eventLocations.map((loc) => (
                <MenuItem key={loc} value={loc}>
                  {loc}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Event Date */}
          <FormControl fullWidth size="small">
            <TextField
              type="date"
              label="Event Date"
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              InputLabelProps={{
                shrink: true,
                sx: { fontWeight: "bold", color: "#555" }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <CalendarTodayOutlinedIcon fontSize="small" sx={{ color: "#777", mr: 1 }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                '& .MuiInputBase-input': {
                  padding: '8.5px 14px',
                }
              }}
            />
          </FormControl>

          {/* Event Pricing */}
          <FormControl fullWidth size="small">
            <InputLabel shrink sx={{ fontWeight: "bold", color: "#555" }}>
              Event Pricing
            </InputLabel>
            <Select
              displayEmpty
              value={eventPricing}
              onChange={(e) => setEventPricing(e.target.value)}
              renderValue={(selected) =>
                selected || (
                  <Box display="flex" alignItems="center" gap={1}>
                    <MonetizationOnOutlinedIcon fontSize="small" sx={{ color: "#777" }} />
                    <Typography variant="body2" color="#777">
                      Select Pricing
                    </Typography>
                  </Box>
                )
              }
            >
              <MenuItem value="Free">Free</MenuItem>
              <MenuItem value="Paid">Paid</MenuItem>
            </Select>
          </FormControl>

          {/* Action Buttons */}
          <Box display="flex" gap={1} mt={1}>
            <Button
              variant="outlined"
              sx={{
                textTransform: "none",
                fontWeight: "bold",
                py: 1,
                borderRadius: 1,
              }}
              onClick={clearBookEventFilters}
            >
              Clear
            </Button>
            <Button
              variant="contained"
              sx={{
                bgcolor: "#0A2647",
                textTransform: "none",
                fontWeight: "bold",
                py: 1,
                borderRadius: 1,
                "&:hover": { bgcolor: "#073366" },
              }}
              startIcon={<SearchIcon />}
              onClick={() => {
                applyBookEventFilters();
                if (isMobile) handleDrawerToggle(); // Close drawer on mobile after applying
              }}
            >
              Find Event
            </Button>
          </Box>
        </Box>
      </Paper>

      {/* Contact Form */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 3,
          border: "1px solid #eee",
          width: "100%",
          mb: 2
        }}
      >
        {/* Heading */}
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Get in touch
        </Typography>

        {/* Form Fields */}
        <Box component="form" noValidate onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              fullWidth
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your name"
              variant="outlined"
              InputProps={{
                sx: { borderRadius: 1, fontSize: "0.9rem" },
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#888" }}>
                    <i className="ri-user-line" />
                  </Box>
                ),
              }}
              required
            />
            <TextField
              fullWidth
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your email"
              variant="outlined"
              type="email"
              InputProps={{
                sx: { borderRadius: 1, fontSize: "0.9rem" },
                startAdornment: (
                  <Box component="span" sx={{ mr: 1, color: "#888" }}>
                    <i className="ri-mail-line" />
                  </Box>
                ),
              }}
              required
            />
            <TextField
              fullWidth
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Message"
              variant="outlined"
              multiline
              rows={4}
              InputProps={{
                sx: { borderRadius: 1, fontSize: "0.9rem" },
              }}
              required
            />

            {/* Submit Status Message */}
            {submitStatus && (
              <Box sx={{
                color: submitStatus.success ? 'success.main' : 'error.main',
                fontSize: '0.875rem',
                textAlign: 'center'
              }}>
                {submitStatus.message}
              </Box>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={submitting}
              endIcon={<ArrowForwardIcon />}
              sx={{
                backgroundColor: "#0A2647",
                borderRadius: 1,
                textTransform: "none",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#073362" },
                "&:disabled": {
                  backgroundColor: '#cccccc',
                },
              }}
            >
              {submitting ? 'Submitting...' : 'Send message'}
            </Button>
          </Stack>
        </Box>

        {/* Contact Info */}
        <Box mt={3}>
          <Stack spacing={1.5}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PhoneIphoneOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                <strong>Mobile:</strong> +237 697 182 551
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <EmailOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                <strong>Email:</strong> tickmevents@gmail.com
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <WhatsAppIcon fontSize="small" />
              <Typography variant="body2">
                <strong>WhatsApp:</strong> +237 697 182 551
              </Typography>
            </Stack>

            <Stack direction="row" alignItems="center" spacing={1}>
              <FaxOutlinedIcon fontSize="small" />
              <Typography variant="body2">
                <strong>Fax:</strong> +237 652 590 797
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </Paper>
    </>
  );

  return (
    <Container maxWidth={false} sx={{ maxWidth: 1180, py: 4 }}>
      {/* Mobile Filter Button */}
      {isMobile && (
        <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h4" component="h1" color="#000" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Our events list
            </Typography>
            <Typography color="#737373" gutterBottom sx={{ fontSize: { xs: '0.875rem', sm: '1rem' } }}>
              Turning dreams into reality with versatile events.
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<FilterListIcon />}
            onClick={handleDrawerToggle}
            sx={{
              backgroundColor: '#0A2647',
              '&:hover': { backgroundColor: '#073362' },
              minWidth: 'auto',
              px: 2
            }}
          >
            Filters
          </Button>
        </Box>
      )}

      {/* Desktop Heading */}
      {!isMobile && (
        <Box sx={{ mb: 4, textAlign: "left" }}>
          <Typography variant="h2" component="h1" color="#000">
            Our events list
          </Typography>
          <Typography color="#737373" gutterBottom>
            Turning dreams into reality with versatile events.
          </Typography>
        </Box>
      )}

      <Grid container spacing={3}>
        {/* Sidebar - Hidden on mobile, shown in drawer */}
        <Grid item xs={12} md={3} sx={{ display: { xs: 'none', md: 'block' } }}>
          {sidebarContent}
        </Grid>

        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { 
              boxSizing: 'border-box', 
              width: { xs: '100vw', sm: 400 },
              p: 2,
              overflowY: 'auto'
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">
              Filters & Options
            </Typography>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>
          {sidebarContent}
        </Drawer>

        {/* Main Content */}
        <Grid item xs={12} md={9}>
          <Grid container spacing={3} ref={eventsRef}>
            {loading ? (
              <Typography>Loading events...</Typography>
            ) : showEvents && finalFilteredEvents.length > 0 ? (
              currentEvents.map((event: Event, index: number) => {
                const isHighlighted = index === 0;
                const image = event.coverImage?.url || event.portraitImage?.url;
                const artist = event.eventName || "Untitled Event";
                const rating = event.averageRating || 0;
                const reviews = event.reviewCount || 0;

                const venue = event.location || "Venue not available";
                const date = event.date || "Date not available";
                const time = event.time || "Time not available";
                const audience = event.eventType || "General";
                let priceLabel = "Free";

                const mainTicketGroup = event.tickets?.[0];
                if (mainTicketGroup) {
                  if (mainTicketGroup.payStatus === "free") {
                    priceLabel = "Free";
                  } else if (mainTicketGroup.payStatus === "paid" && Array.isArray(mainTicketGroup.tickets)) {
                    const prices = mainTicketGroup.tickets
                      .map((t: any) => {
                        const numericPrice = parseFloat(String(t.price).replace(/[^\d.]/g, ""));
                        return Number.isNaN(numericPrice) ? null : numericPrice;
                      })
                      .filter((p: number | null): p is number => p !== null);

                    if (prices.length > 0) {
                      const minPrice = Math.min(...prices);
                      priceLabel = `${minPrice} XAF`;
                    }
                  }
                }

                return (
                  <Grid item xs={12} key={event._id}>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        borderRadius: 2,
                        overflow: "hidden",
                        boxShadow: { xs: 1, md: 3 },
                        backgroundColor: isHighlighted ? "#2296D4" : "#fff",
                        color: isHighlighted ? "#fff" : "#000",
                        mx: { xs: 0, md: 0 },
                      }}
                    >
                      <CardMedia
                        component="img"
                        image={image}
                        alt={artist}
                        sx={{
                          width: { xs: "100%", md: 300 },
                          height: { xs: 200, md: 325 },
                          objectFit: "cover",
                          p: { xs: 2, md: 3 },
                        }}
                      />
                      <CardContent
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "space-between",
                          p: 3,
                          borderRadius: 2,
                          flex: 1,
                        }}
                      >
                        {/* Rating */}
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            px: 1.5,
                            py: 0.25,
                            borderRadius: "20px",
                            backgroundColor: isHighlighted ? "#1E81C3" : "#F6F9FF",
                            fontSize: "0.875rem",
                            fontWeight: 500,
                            color: isHighlighted ? "#fff" : "#1E1E1E",
                            width: "fit-content",
                            mb: 1.5,
                          }}
                        >
                          <StarIcon sx={{ fontSize: 18, color: isHighlighted ? "#fff" : "#007AFF", mr: 0.5 }} />
                          <Typography component="span" sx={{ fontWeight: 600, color: isHighlighted ? "#fff" : "#1E1E1E", mr: 0.5 }}>
                            {rating.toFixed(2)}
                          </Typography>
                          <Typography component="span" sx={{ color: isHighlighted ? "#E0E0E0" : "#777", fontWeight: 400 }}>
                            ({reviews} reviews)
                          </Typography>
                        </Box>

                        {/* Event Name */}
                        <Typography variant="h6" fontWeight="bold" sx={{ mb: 0.5, color: isHighlighted ? "#fff" : "#1E1E1E", fontSize: { xs: '1rem', md: '1.25rem' } }}>
                          {artist}
                        </Typography>

                        {/* Location */}
                        <Typography variant="body2" sx={{ mb: 2, color: isHighlighted ? "#fff" : "text.secondary" }}>
                          📍 {venue}
                        </Typography>

                        {/* Details */}
                        <Grid container spacing={2} sx={{ mb: 2 }}>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <AccessTimeIcon sx={{ fontSize: 18, color: isHighlighted ? "#fff" : "#1E1E1E" }} />
                              <Typography variant="body2" sx={{ color: isHighlighted ? "#fff" : "#1E1E1E" }}>
                                {time}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <PersonIcon sx={{ fontSize: 18, color: isHighlighted ? "#fff" : "#1E1E1E" }} />
                              <Typography variant="body2" sx={{ color: isHighlighted ? "#fff" : "#1E1E1E" }}>
                                {audience}
                              </Typography>
                            </Box>
                          </Grid>
                          <Grid item xs={12} md={6}>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <EventIcon sx={{ fontSize: 18, color: isHighlighted ? "#fff" : "#1E1E1E" }} />
                              <Typography variant="body2" sx={{ color: isHighlighted ? "#fff" : "#1E1E1E" }}>
                                {date}
                              </Typography>
                            </Box>
                          </Grid>
                        </Grid>

                        <Divider sx={{ borderColor: isHighlighted ? "#ffffff44" : "#DDE1DE", my: 2 }} />

                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2, flexDirection: { xs: "column", md: "row" }, gap: { xs: 2, md: 0 } }}>
                          <Typography variant="h6" fontWeight="bold" sx={{ color: isHighlighted ? "#fff" : "#000", fontSize: { xs: '1rem', md: '1.25rem' } }}>
                            From: {priceLabel}
                          </Typography>
                          <Button
                            variant="contained"
                            sx={{
                              backgroundColor: isHighlighted ? "#fff" : "#002E66",
                              color: isHighlighted ? "#2296D4" : "#fff",
                              textTransform: "none",
                              fontWeight: 500,
                              px: 3,
                              py: 1,
                              borderRadius: "8px",
                              "&:hover": {
                                backgroundColor: isHighlighted ? "#e0e0e0" : "#001f47",
                              },
                              width: { xs: '100%', md: 'auto' }
                            }}
                            onClick={() => navigate(`/our-event/${event.urlSlug ||event._id}`)}
                          >
                            Book Now
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })
            ) : (
              <Typography>No events available.</Typography>
            )}
          </Grid>

          {/* Pagination */}
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
              size={isMobile ? "small" : "medium"}
              siblingCount={isMobile ? 0 : 1}
            />
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default EventBooking;