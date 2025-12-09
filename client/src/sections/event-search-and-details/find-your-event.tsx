import {
  Checkbox, FormControlLabel, MenuItem, Select, Grid, FormControl,
  InputLabel, IconButton, Box, ListSubheader, TextField, Button, Collapse,
  Drawer, Typography, Divider
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'src/redux/store';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { fetchAllCategories } from 'src/redux/actions/event.action';

import { PopularEvent } from '../home-and-recommendations/PopularEvent';

export function FindYourEvent({ handleEventDetails }: any) {
  const { fullData } = useSelector((state: RootState) => state?.event);
  const dispatch = useDispatch<AppDispatch>();

  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    date: '',
    location: '',
    payStatus: '',
    popularity: '',
    availableTickets: false,
  });
  const { categories } = useSelector((state: RootState) => state.event);

  const [filteredEvents, setFilteredEvents] = useState(fullData || []);
  const [visibleEvents, setVisibleEvents] = useState(6);

  // Combined filter function
  const applyFilters = useCallback(() => {
    if (!fullData || fullData.length === 0) {
      setFilteredEvents([]);
      return;
    }

    let results = [...fullData];
    const today = new Date();

    // Search filter
    if (searchTerm) {
      results = results.filter(
        (event) =>
          event.eventName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (event.description &&
            event.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setHasSearched(true);
    } else {
      setHasSearched(false);
    }

    // Apply category filter
    if (filters.category) {
      results = results.filter(
        (event) => event.category === filters.category
      );
    }

    // Apply location filter
    if (filters.location) {
      results = results.filter((event) =>
        event.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply price filter
    if (filters.payStatus === 'paid') {
      results = results.filter((event) => event.payStatus === 'paid');
    } else if (filters.payStatus === 'free') {
      results = results.filter((event) => event.payStatus === 'free');
    }

    // Apply date filter
    if (filters.date) {
      results = results.filter((event) => {
        if (!event.date) return false;
        const eventDate = new Date(event.date);

        switch (filters.date) {
          case 'today': {
            return eventDate.toDateString() === today.toDateString();
          }
          case 'this_week': {
            const nextWeek = new Date(today);
            nextWeek.setDate(today.getDate() + 7);
            return eventDate >= today && eventDate <= nextWeek;
          }
          case 'this_month': {
            return (
              eventDate.getMonth() === today.getMonth() &&
              eventDate.getFullYear() === today.getFullYear()
            );
          }
          default: {
            return true;
          }
        }
      });
    }

    // Apply available tickets filter
    if (filters.availableTickets) {
      results = results.filter((event) => {
        const totalTickets = parseInt(event.ticketQuantity || '0', 10);
        return totalTickets > 0;
      });
    }

    // Apply popularity/sorting filter
    if (filters.popularity) {
      switch (filters.popularity) {
        case 'tickets_sold':
          // Assuming you have a ticketsSold field in your data
          results.sort((a, b) => (b.ticketsSold || 0) - (a.ticketsSold || 0));
          break;
        case 'ratings':
          results.sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));
          break;
        case 'date_asc':
          results.sort((a, b) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime());
          break;
        case 'date_desc':
          results.sort((a, b) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime());
          break;
        default:
          break;
      }
    }

    setFilteredEvents(results);
    setVisibleEvents(6); // Reset visible events when filters change
  }, [fullData, searchTerm, filters]);

  // Update filters when they change
  const handleFilterChange = (filterName: string, value: string | boolean) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }));
  };

  // Apply filters when either search term or filters change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // Load more events
  const loadMoreEvents = () => {
    setVisibleEvents((prev) => prev + 2); // Show 2 more events
  };
  
  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      date: '',
      location: '',
      payStatus: '',
      popularity: '',
      availableTickets: false,
    });
  };

  return (
    <Box boxShadow={3} borderRadius={3} mt={3}>
      {/* Event Search Bar */}
      <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        bgcolor="#002244"
        p={1}
        sx={{ px: 3, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      >
        <Box display="flex" alignItems="center" bgcolor="#fff" borderRadius={1} px={2} flex={1}>
          <SearchIcon color="action" />
          <TextField
            variant="standard"
            placeholder="Search Event"
            InputProps={{ disableUnderline: true }}
            fullWidth
            sx={{ ml: 1 }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Box>
        <IconButton sx={{ ml: 1, color: '#fff' }} onClick={toggleFilters}>
          <FilterListIcon />
        </IconButton>
      </Box>

      {/* Filter Drawer */}
      <Drawer
        anchor="right"
        open={showFilters}
        onClose={toggleFilters}
        sx={{
          '& .MuiDrawer-paper': {
            width: { xs: '100%', sm: 400 },
            p: 2,
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6" fontWeight="bold">
            Filters
          </Typography>
          <IconButton onClick={toggleFilters}>
            <CloseIcon />
          </IconButton>
        </Box>
        
        <Divider sx={{ mb: 2 }} />
        
        <Box sx={{ overflowY: 'auto', height: 'calc(100% - 100px)' }}>
          <Grid container spacing={2}>
            {/* Category Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="event-category-label">Event Category</InputLabel>
                <Select
                  labelId="event-category-label"
                  value={filters.category}
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                  label="Event Category"
                >
                  <MenuItem value="">All Categories</MenuItem>
                  {categories.map((parent: any) => (
                    parent.subcategories?.length > 0 && [
                      <ListSubheader key={`header-${parent._id}`}>{parent.name}</ListSubheader>,
                      ...parent.subcategories.map((child: any) => (
                        <MenuItem key={child._id} value={child._id}>
                          {child.name}
                        </MenuItem>
                      ))
                    ]
                  ))}
                </Select>
              </FormControl>
            </Grid>
            
            {/* Date Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="date-label">Date</InputLabel>
                <Select
                  labelId="date-label"
                  value={filters.date}
                  onChange={(e) => handleFilterChange('date', e.target.value)}
                >
                  <MenuItem value="">All Dates</MenuItem>
                  <MenuItem value="today">Today</MenuItem>
                  <MenuItem value="this_week">This Week</MenuItem>
                  <MenuItem value="this_month">This Month</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Location Filter */}
            <Grid item xs={12}>
              <TextField
                label="Location"
                placeholder="Enter City"
                variant="outlined"
                fullWidth
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
              />
            </Grid>

            {/* Price Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="price-label">Price</InputLabel>
                <Select
                  labelId="price-label"
                  value={filters.payStatus}
                  onChange={(e) => handleFilterChange('payStatus', e.target.value)}
                >
                  <MenuItem value="">All Prices</MenuItem>
                  <MenuItem value="free">Free</MenuItem>
                  <MenuItem value="paid">Paid</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Popularity Filter */}
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="popularity-label">Sort By</InputLabel>
                <Select
                  labelId="popularity-label"
                  value={filters.popularity}
                  onChange={(e) => handleFilterChange('popularity', e.target.value)}
                >
                  <MenuItem value="">Default</MenuItem>
                  <MenuItem value="tickets_sold">Tickets Sold</MenuItem>
                  <MenuItem value="ratings">Ratings</MenuItem>
                  <MenuItem value="date_asc">Date (Oldest First)</MenuItem>
                  <MenuItem value="date_desc">Date (Newest First)</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Available Tickets Checkbox */}
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={filters.availableTickets}
                    onChange={(e) => handleFilterChange('availableTickets', e.target.checked)}
                  />
                }
                label="Only show available tickets"
              />
            </Grid>
          </Grid>
        </Box>
        
        <Box sx={{ mt: 'auto', pt: 2 }}>
          <Button 
            variant="outlined" 
            fullWidth 
            onClick={clearFilters}
            sx={{ mb: 1 }}
          >
            Clear Filters
          </Button>
          <Button 
            variant="contained" 
            fullWidth 
            onClick={toggleFilters}
            sx={{ backgroundColor: '#002244', '&:hover': { backgroundColor: '#003366' } }}
          >
            Apply Filters
          </Button>
        </Box>
      </Drawer>

      {/* Events Grid */}
      <Box mt={2} p={{ xs: 1, md: 1, lg: 2 }}>
        <Grid container spacing={3}>
          {filteredEvents.slice(0, visibleEvents).map((item: any) => (
            <Grid item xs={12} sm={6} md={6} key={item._id}>
              <PopularEvent event={item} handleEventDetails={handleEventDetails} flag="search" />
            </Grid>
          ))}
        </Grid>
        {filteredEvents.length > visibleEvents && (
          <Box display="flex" justifyContent="center" mt={3}>
            <Button
              variant="contained"
              onClick={loadMoreEvents}
              sx={{
                backgroundColor: '#002244',
                color: 'white',
                '&:hover': {
                  backgroundColor: '#003366',
                },
              }}
            >
              Load More
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  );
}