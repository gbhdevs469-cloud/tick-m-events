import { Grid, Box, Fade, Typography, CircularProgress } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';

import { AppDispatch, RootState } from 'src/redux/store';
import { PopularEvent } from 'src/sections/home-and-recommendations/PopularEvent';
import { eventFetch } from 'src/redux/actions/event.action';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import Header from 'src/components/Header';

export function EventsView() {
  const { fullData } = useSelector((state: RootState) => state?.event);
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(true);
  const [showEvents, setShowEvents] = useState(false);

  const approvedEvents = useMemo(() =>
    fullData?.filter((event: any) => event.status === 'approved' && event.eventType!=="Private") || []
    , [fullData]);


  useEffect(() => {
    dispatch(eventFetch());
  }, [dispatch]);

  useEffect(() => {
    if (approvedEvents && approvedEvents.length > 0) {
      const timer = setTimeout(() => {
        setLoading(false);
        setShowEvents(true);
      }, 1000);

      return () => clearTimeout(timer);
    }

    setLoading(false);
    return () => { }; // Explicit empty cleanup
  }, [approvedEvents]);

  return (
    <>
      <Header />
      <Box
        sx={{
          px: { xs: 2, md: 6 },
          py: { xs: 4, md: 8 },
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          minHeight: '100vh',
        }}
      >
        <HeadingCommon
          title="🎉 Upcoming Events"
          weight={700}
          baseSize="38px"
          variant="h4"
        />
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            color: '#555',
            mt: 1,
            mb: 4,
          }}
          fontSize={{ xs: '16px', md: '18px' }}
        >
          Discover the most exciting events happening around you.
        </Typography>

        {/* Main content area */}
        {!fullData ? (
          // Initial loading state while waiting for data
          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}>
            <CircularProgress size={60} />
          </Box>
        ) : approvedEvents.length === 0 ? (
          // No events found state
          <Box sx={{
            textAlign: 'center',
            p: 4,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '50vh'
          }}>
            <Typography variant="h5" color="textSecondary">
              No upcoming events found
            </Typography>
          </Box>
        ) : (
          // Data loaded state with 5-second loading delay
          <>
            {loading ? (
              <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '50vh'
              }}>
                <CircularProgress size={60} />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {approvedEvents.map((event: any, index: number) => (
                  <Fade in={showEvents} timeout={500 + index * 200} key={event._id || index}>
                    <Grid item xs={12} sm={6} md={4}>
                      <PopularEvent event={event} />
                    </Grid>
                  </Fade>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </>
  );
}