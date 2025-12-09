import { Box, Button, Card, CardContent, Grid, Typography, Avatar } from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { formatEventDate, formatTimeTo12Hour } from 'src/hooks/formate-time';
import { AppDispatch, RootState } from 'src/redux/store';
import { eventAddToWishlist } from 'src/redux/actions/event.action';
import { Link, useNavigate } from 'react-router-dom';
import { PromotionBadge } from './promotionBadge';

interface ApiResult {
  status: number;
  type: string;
  message: any;
}

export function PopularEvent({ event, handleEventDetails, flag }: any) {

  const dispatch = useDispatch<AppDispatch>();
  const { authenticate } = useSelector((state: RootState) => state?.auth)
  const navigate = useNavigate();
  const handleViewEvent = (selectedViewEvent: any) => {
    handleEventDetails(selectedViewEvent)
  };

  const handleAddEventWishlist = async (selectedViewEvent: any) => {
    try {
      const result = await dispatch(eventAddToWishlist(selectedViewEvent))
      if ((result as ApiResult)?.status === 201) {
        toast.success(result?.message);
      } else {
        toast.error(result?.message);
      }
    } catch (error) {
      toast.error("Server maintenence");
    }
  };

  const handleBookNow = () => {
    const redirectUrl = `/ticket-purchase-process?eventId=${event._id}`

    if (!authenticate) {
      sessionStorage.setItem('pendingPurchase', JSON.stringify({
        eventId: event._id,
        eventName: event.eventName,
        redirectTo: redirectUrl
      }));
      navigate('/sign-in');
    } else {
      window.open(redirectUrl, '_blank');
    }
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        boxShadow: 3,
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url("${event?.coverImage?.url || './assets/images/event/image.png'}")`,
        backgroundSize: "cover",
        backgroundPosition: 'center',
        overflow: 'visible',
        position: 'relative',
        mt: 4

      }}
    >
      <Box sx={{ position: 'relative' }}>
        <PromotionBadge promotions={event?.promotion} />
      </Box>

      <CardContent sx={{ textAlign: 'center', position: 'relative' }}>
        <Link to={`/our-event/${event.urlSlug || event._id}`} target='__blank' style={{ textDecoration: 'none' }}>

          <Avatar
            src={event?.customization?.eventLogo?.url || `/assets/images/home-and-recommendations/${event.image}`}
            alt={event.title}
            sx={{
              width: { xs: '80px', sm: '90px', md: '97px' },
              height: { xs: '80px', sm: '90px', md: '97px' },
              position: 'absolute',
              top: -40,
              left: '50%',
              transform: 'translateX(-50%)',
            }}
          />
          <HeadingCommon title={event.eventName} weight={600} baseSize="25px" color="#2395D4" mt={6} />
          <HeadingCommon title={`${event.location} | ${event.date} | ${formatTimeTo12Hour(event.time)}`} color="white" weight={400} baseSize="16px" />


          <Typography
            variant="body2"
            fontWeight={700}
            textTransform="capitalize"
            fontSize={{ xs: '8px', sm: '12px', md: '18px' }}
            sx={{ color: event.payStatus === 'free' ? 'green' : 'pink', fontWeight: 700, mt: 1 }}
          >
            {event?.payStatus}
          </Typography>
          {/* Star Rating */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mt: 1,
            }}
          >
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                fontSize="small"
                sx={{
                  color: i < Math.floor(event.averageRating) ? '#fbc02d' : '#ddd',
                }}
              />
            ))}
            <Typography color="white" fontWeight="bold" ml={0.5} fontSize={{ xs: '12px', sm: '14px' }}>
              {event.averageRating || 0} / 5
            </Typography>

          </Box>
        </Link >

        <Grid container spacing={2} mt={2} justifyContent="center">
          <Grid item xs={12} sm={10} md={11}>
            <Grid container spacing={2}>
              {['Share'].concat(
                flag === "search" ? ["View Details", "Book Now"] :
                  flag === "singleCategory" ? ["Book Now"] :
                    ["Book Now", "Wishlist"]
              ).map((text) => (
                <Grid item xs={4} key={text}>
                  {text === "Book Now" ? (
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleBookNow}
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '14px' },
                        fontWeight: 500,
                      }}
                    >
                      {text}
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (text === "View Details") {
                          navigate(`/our-event/${event.urlSlug || event._id}`)

                          // handleViewEvent({ selectedViewEvent: event });
                        } else if (text === "Share") {
                          const stripHtml = (html: any) => {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = html;
                            return tempDiv.textContent || tempDiv.innerText || '';
                          };

                          // Get plain text description
                          const plainDescription = stripHtml(event?.description || '');
                          const eventUrl = `${import.meta.env.VITE_Live_URL || 'https://tick-m-events.vercel.app'}/our-event/${event?.urlSlug}`;
                          const eventTitle = `*${event?.eventName || "Exciting Event"}*`;
                          const eventDate = `*Date:* ${formatEventDate(event?.date)}`;
                          const eventTime = `*Time:* ${formatTimeTo12Hour(event?.time)}`;
                          const description = `*Description:* ${plainDescription}`;
                          const cover = `*Cover:* ${event?.coverImage?.url}`;
                          const message = `${eventTitle}\n${eventDate}\n${eventTime}\n${description}\n\n*Event Link:* ${eventUrl}\n${cover}\nCheck it out! 🎉`;
                          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
                          window.open(whatsappUrl, '_blank');
                        } else if (text === "Wishlist") {
                          handleAddEventWishlist({ selectedViewEvent: event });
                        }
                      }}
                      fullWidth
                      sx={{
                        fontSize: { xs: '12px', sm: '14px', md: '14px' },
                        fontWeight: 500,
                      }}
                    >
                      {text}
                    </Button>
                  )}
                </Grid>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </CardContent>

    </Card>
  )
}