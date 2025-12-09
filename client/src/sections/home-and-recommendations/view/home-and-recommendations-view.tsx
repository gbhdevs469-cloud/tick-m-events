import { Typography, Grid, Box, Paper, Button, IconButton, CircularProgress } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { AppDispatch, RootState } from 'src/redux/store';
import { fetchLatestEventCreatedActivity } from 'src/redux/actions/activityActions';

import { UpComingCard } from '../UpComingCard';
import { PopularEvent } from '../PopularEvent';
import { ExploreMoreSection } from '../ExploreMore';
import axios from "../../../redux/helper/axios";


interface EventDetails {
  eventName: string;
  date: string;
  time?: string;
}

interface TicketItem {
  ticketType: string;
}

interface ParticipantDetail {
  name: string;
  [key: string]: any;
}

interface Ticket {
  _id: string;
  eventId: string;
  eventDetails?: EventDetails;
  tickets: TicketItem[];
  qrCode: string;
  verifyEntry: string;
  eventDate?: string;
  refundRequest?: any;
  participantDetails?: ParticipantDetail[];
  paymentStatus?: string;
}

export function HomeAndRecommendationsView() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { popularEvents, recommendedEvents } = useSelector((state: RootState) => state?.homeRecom);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const { _id } = useSelector((state: RootState) => state?.auth?.user);
  const user = useSelector((state: RootState) => state?.auth?.user);
  const notifications = user?.notifications || [];
  const [upcomingQrTicket, setUpcomingQrTicket] = useState<Ticket | null>(null);
  const [upcomingTickets, setUpcomingTickets] = useState<Ticket[]>([]);
  const [latestEventActivity, setLatestEventActivity] = useState<any>(null);
  const [hiddenNotifIds, setHiddenNotifIds] = useState<string[]>([]);
  const [selectedTicketForTransfer, setSelectedTicketForTransfer] = useState<Ticket | null>(null);
  const [beneficiaryId, setBeneficiaryId] = useState('');
  const [beneficiaryNames, setBeneficiaryNames] = useState<string[]>([]);

  const handleViewEvent = (eventId?: string) => {
    if (eventId) {
      navigate(`/our-event/${eventId}`);
    }
  };

 useEffect(() => {
  async function fetchTickets() {
    try {
      const response = await axios.get(`/event-order/user/${_id}`);
      const allTickets: Ticket[] = response.data;

      console.log("res", response.data); // Your log shows the data is coming correctly

      // Filter out refunded tickets AND only confirmed payments
      const confirmedNonRefundedTickets = allTickets.filter(ticket => {
        // Check payment status first - ONLY include confirmed payments
        if (ticket.paymentStatus !== "confirmed") return false;
        
        // Then check refund status
        if (!ticket.refundRequest) return true;
        return ticket.refundRequest.refundStatus !== 'refunded';
      });

      console.log("Confirmed non-refunded tickets:", confirmedNonRefundedTickets);
      setTickets(confirmedNonRefundedTickets);

      // Filter for upcoming confirmed tickets (for QR ticket and time left notification)
      const upcomingConfirmedTickets = confirmedNonRefundedTickets.filter(ticket => {
        const dateStr = ticket.eventDetails?.date;
        const eventDate = dateStr ? new Date(dateStr) : null;
        return eventDate !== null &&
          !Number.isNaN(eventDate.getTime()) &&
          eventDate > new Date();
      });

      console.log("Upcoming confirmed tickets:", upcomingConfirmedTickets);
      setUpcomingTickets(upcomingConfirmedTickets);

      // Find the next upcoming QR ticket from confirmed tickets
      const upcomingTicket = upcomingConfirmedTickets
        .filter(ticket => ticket.qrCode) // Only tickets with QR code
        .sort((a, b) => {
          const dateA = new Date(a.eventDetails?.date || '');
          const dateB = new Date(b.eventDetails?.date || '');
          return dateA.getTime() - dateB.getTime();
        })[0];
      
      console.log("Next upcoming QR ticket:", upcomingTicket);
      setUpcomingQrTicket(upcomingTicket || null);

    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  if (_id) {
    fetchTickets();
  }
}, [_id]);

  useEffect(() => {
    async function fetchLatestEventActivity() {
      try {
        const response = await dispatch(fetchLatestEventCreatedActivity()) as any;
        if (response?.payload) {
          setLatestEventActivity(response.payload);
        }
      } catch (err) {
        console.error("Failed to fetch latest event_created activity:", err);
      }
    }

    fetchLatestEventActivity();
  }, [dispatch]);

  const latestEventText = latestEventActivity
    ? `${latestEventActivity.userId?.name || 'Someone'} created a new event: "${latestEventActivity.eventName || 'Untitled'}"`
    : 'A new event was just created!';

  // Pull ALL unread notifications
  const unreadNotifications = notifications
    ?.slice()
    ?.reverse()
    ?.filter((n: any) => !n.read)
    ?.map((n: any) => ({
      _id: n._id,
      text: n.message,
      eventId: n.eventId,
      disabled: false,
    }));

  function parseEventDate(ticket: Ticket): Date | null {
    if (!ticket.eventDetails?.date) return null;
    const date = ticket.eventDetails.date;   // "2025-09-03"
    const time = ticket.eventDetails.time ?? "00:00"; // fallback
    return new Date(`${date}T${time}:00`);
  }

  function getTimeLeft(ticketList: Ticket[]): string {
    if (!tickets || tickets.length === 0) return "No upcoming events";

    const now = new Date();
    const nextEvent = tickets.find(ticket => {
      const date = parseEventDate(ticket);
      return date && date > now;
    });

    if (!nextEvent) return "No upcoming events";

    const eventDate = parseEventDate(nextEvent)!;
    const diffMs = eventDate.getTime() - now.getTime();

    if (diffMs <= 0) return "Your concert is live now!";

    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `Your concert starts in ${days}d ${hours}h ${minutes}m!`;
    if (hours > 0) return `Your concert starts in ${hours}h ${minutes}m!`;
    if (minutes > 0) return `Your concert starts in ${minutes}m!`;
    return "Your concert is about to start!";
  }

  const markAsRead = async (notifId?: string, index?: number) => {
    if (!notifId) {
      // Non-ID notification → just hide locally
      setHiddenNotifIds(prev => [...prev, String(index)]);
      return;
    }

    try {
      await axios.patch(`/auth/users/${_id}/notifications/${notifId}/read`);

      const updatedNotifications = notifications.map((n: any) =>
        n._id === notifId ? { ...n, read: true } : n
      );

      dispatch({
        type: "auth/updateUser",
        payload: { ...user, notifications: updatedNotifications }
      });

      // Hide after marking
      setHiddenNotifIds(prev => [...prev, notifId]);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

    // Only show time left notification if there are confirmed upcoming tickets
  const timeLeftNotification = upcomingTickets.length > 0 && upcomingQrTicket
    ? [{ text: getTimeLeft(upcomingTickets), eventId: upcomingQrTicket.eventId }]
    : [];

  const visibleNotifications = [
    ...unreadNotifications,
    ...timeLeftNotification,
    { text: latestEventText, eventId: latestEventActivity?.metadata?.params?.eventId },
  ].filter((item, index) => !hiddenNotifIds.includes(item._id || String(index)));

  return (
    <DashboardContent>
      <PageTitleSection title="Home & Recommendations" />
      <Box sx={{ width: '100%', overflowX: 'auto' }}>
        <HeadingCommon title="My Active Tickets" weight={600} baseSize="34px" variant="h5" />

        {tickets?.length ? (
          <Grid
            container
            spacing={3}
            sx={{
              flexWrap: 'nowrap',
              paddingBottom: '16px',
              width: 'max-content',
              direction: 'rtl',
              '& > *': {
                direction: 'ltr'
              }
            }}
          >
            {tickets
              ?.filter(ticket => ticket.paymentStatus === "confirmed")  // ⬅️ Filter here
              ?.slice()
              ?.reverse()
              ?.map((ticket, index) => (
                <Grid item key={index} sx={{ minWidth: 400 }}>
                  <UpComingCard
                    ticket={ticket}
                    onShareClick={() => {
                      setSelectedTicketForTransfer(ticket);
                      setBeneficiaryId('');
                      setBeneficiaryNames(ticket.participantDetails?.map((p: any) => p.name || "") || []);
                    }}
                  />

                </Grid>
              ))}
          </Grid>
        ) : (
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              py: 8,
              px: 2,
              textAlign: 'center',
              border: '2px dashed',
              borderColor: 'grey.300',
              borderRadius: 2,
              backgroundColor: 'grey.50'
            }}
          >
            {/* Text */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'text.secondary',
                mb: 1
              }}
            >
              No Active Tickets
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                maxWidth: 400,
                lineHeight: 1.5
              }}
            >
              You don&apos;t have any upcoming events. Explore events to book your next experience!
            </Typography>

            {/* Optional: Add a button to browse events */}
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: 'primary.main',
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              }}
              onClick={() => {
                navigate('/our-event');
              }}
            >
              Browse Events
            </Button>
          </Box>
        )}
      </Box>

      {/* EventCard component */}
      <Box mt={3}>
        <HeadingCommon title="Recommended Events for You" weight={600} baseSize="34px" variant="h5" />
        {/* Main Grid Layout */}
        <Grid container spacing={3} mt={3}>
          {
            recommendedEvents?.length > 0 ? (
              recommendedEvents?.slice(0, 2).map((ticketc: any, index: any) => (
                <Grid item xs={12} sm={6} md={6} key={ticketc._id || index}>
                  <PopularEvent event={ticketc} key={index} />
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: 50
              }}>
                <CircularProgress color="primary" size={50} />
              </Grid>
            )
          }
        </Grid>
      </Box>

      {/* PopularEvent component */}
      <Box mt={3}>
        <HeadingCommon title="Popular & Trending Events" weight={600} baseSize="34px" variant="h5" />
        {/* Main Grid Layout */}
        <Grid container spacing={3} mt={3}>
          {popularEvents?.length > 0 ? (
            popularEvents?.slice(0, 2).map((ticketc: any, index: any) => (
              <Grid item xs={12} sm={6} md={6} key={ticketc._id || index}>
                <PopularEvent event={ticketc} key={index} />
              </Grid>
            ))
          ) : (
            <Grid item xs={12} sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: 100
            }}>
              <CircularProgress color="primary" />
            </Grid>
          )}
        </Grid>
      </Box>

      <Box boxShadow={3} borderRadius={3} mt={3}>
        <Paper
          sx={{
            width: '100%',
            p: { xs: 2, sm: 3 },
            maxWidth: { xs: '100%', sm: '800px', md: '100%' },
            borderRadius: 2,
          }}
        >
          {/* Section Title */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <HeadingCommon title="Notifications & Personalized Alerts" weight={600} baseSize="34px" variant="h5" />
            <IconButton
              sx={{
                backgroundColor: '#2196f3',
                color: '#fff',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: '#1976d2',
                },
              }}
            >
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Scrollable List */}
          <Box
            sx={{
              maxHeight: { xs: '250px', sm: '300px' },
              overflowY: 'auto',
              pr: 1,
              scrollbarWidth: 'thin', // Firefox
              '&::-webkit-scrollbar': {
                width: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#c1c1c1',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <Box
              sx={{
                maxHeight: { xs: '250px', sm: '300px' },
                overflowY: 'auto',
              }}
            >
              {visibleNotifications.length > 0 ? (
                visibleNotifications.map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', sm: 'row' },
                      justifyContent: 'space-between',
                      alignItems: { xs: 'flex-start', sm: 'center' },
                      borderRadius: 1,
                      backgroundColor: item.disabled ? '#f9f9f9' : '#F3F3F3',
                      color: item.disabled ? 'text.disabled' : 'text.primary',
                      p: 2,
                      mb: 2,
                      opacity: item.disabled ? 0.5 : 1,
                    }}
                  >
                    {/* Text on the LEFT side */}
                    <Box sx={{ flexGrow: 1, mb: { xs: 1, sm: 0 } }} width={{ md: '60%' }}>
                      <Typography sx={{ fontWeight: 500 }} fontSize={{ xs: 12, sm: 14, md: 16 }}>{item.text}</Typography>
                    </Box>

                    {/* Buttons on the RIGHT side */}
                    <Box
                      sx={{
                        width: { xs: '100%', sm: 'auto', md: '40%' },
                        display: 'flex',
                        justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                      }}
                    >
                      <Grid container spacing={1} sx={{ maxWidth: { sm: 360, md: 400 } }}>
                        {[{ text: 'View Event', color: 'primary' as const }, { text: 'Mark as Read', custom: true }].map(
                          ({ text: buttonText, color, custom }) => (
                            <Grid item xs={6} sm={4} md={6} key={buttonText}>
                              <Button
                                fullWidth
                                size="small"
                                variant="contained"
                                color={color || undefined}
                                disabled={item.disabled || (!item.eventId && buttonText === 'View Event')}
                                onClick={() => {
                                  if (buttonText === 'View Event') {
                                    handleViewEvent(item.eventId);
                                  } else if (buttonText === 'Mark as Read') {
                                    markAsRead(item._id, index);
                                  }
                                }}
                                sx={{
                                  fontSize: { xs: '10px', sm: '12px' },
                                  fontWeight: 500,
                                  textTransform: 'none',
                                  backgroundColor: custom ? '#0b2e4c' : undefined,
                                  '&:hover': {
                                    backgroundColor: custom ? '#093047' : undefined,
                                  },
                                }}
                              >
                                {buttonText}
                              </Button>
                            </Grid>
                          )
                        )}
                      </Grid>
                    </Box>
                  </Box>
                ))
              ) : (
                <Typography
                  variant="body1"
                  sx={{
                    textAlign: 'center',
                    color: 'text.secondary',
                    p: 2,
                  }}
                >
                  No notifications at the moment.
                </Typography>
              )}
            </Box>
          </Box>
        </Paper>
      </Box>
      <ExploreMoreSection />
      {selectedTicketForTransfer && (
        <Box
          onClick={() => setSelectedTicketForTransfer(null)}
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1300, // HIGH z-index to overlay all
            p: 2,
          }}
        >
          <Box
            onClick={(e) => e.stopPropagation()}
            sx={{
              backgroundColor: "#fff",
              borderRadius: 6,
              boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              p: 4,
              width: { xs: "95%", sm: "80%", md: "60%" },
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <Typography
              variant="h6"
              mb={3}
              fontWeight={700}
              sx={{ color: "#0B2E4C", fontSize: "1.6rem" }}
            >
              🎟 Transfer Ticket
            </Typography>

            <input
              type="text"
              placeholder="Beneficiary Account ID"
              value={beneficiaryId}
              onChange={(e) => setBeneficiaryId(e.target.value)}
              style={{
                marginBottom: "15px",
                width: "100%",
                padding: "14px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                fontSize: "15px",
              }}
            />

            {beneficiaryNames.map((name, idx) => (
              <input
                key={idx}
                type="text"
                placeholder={`Beneficiary Name ${idx + 1}`}
                value={name}
                onChange={(e) => {
                  const updated = [...beneficiaryNames];
                  updated[idx] = e.target.value;
                  setBeneficiaryNames(updated);
                }}
                style={{
                  marginBottom: "12px",
                  width: "100%",
                  padding: "14px",
                  borderRadius: "8px",
                  border: "1px solid #ccc",
                  fontSize: "15px",
                }}
              />
            ))}

            <Button
              variant="contained"
              sx={{
                backgroundColor: "#0B2E4C",
                color: "#fff",
                width: "100%",
                py: 1.6,
                fontWeight: 600,
                borderRadius: "8px",
              }}
              onClick={async () => {
                if (!beneficiaryId) {
                  toast.error("⚠️ Please enter a beneficiary ID");
                  return;
                }

                try {
                  const payload = {
                    orderId: selectedTicketForTransfer._id,
                    beneficiaryId,
                    participantDetails: beneficiaryNames.map((name, idx) => ({
                      ...(selectedTicketForTransfer.participantDetails?.[idx] || {}),
                      name,
                    })),
                  };

                  const response = await axios.post("/event-order/transfer-ticket", payload);

                  if (response.data.success) {
                    toast.success(response.data.message || "✅ Ticket transferred successfully!");
                    setSelectedTicketForTransfer(null);
                    setTimeout(() => window.location.reload(), 1500);
                  } else {
                    toast.error(response.data.message || "❌ Transfer failed");
                  }
                } catch (error: any) {
                  console.error("Transfer failed:", error);
                  toast.error(error.response?.data?.message || "❌ Transfer failed");
                }
              }}
            >
              Confirm Transfer
            </Button>

            <Button
              onClick={() => setSelectedTicketForTransfer(null)}
              variant="outlined"
              sx={{
                mt: 2,
                width: "100%",
                py: 1.6,
                borderRadius: "8px",
              }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}

    </DashboardContent>
  );
}


