import { useEffect, useState, useMemo } from 'react';
import { Box, Button, Card, Grid, Typography } from '@mui/material';
import { useSelector } from 'react-redux';

import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { MatrixThreeCard } from 'src/components/matrix-three-cards/matrix-three-cards';
import { RootState } from 'src/redux/store';

import axios from "../../../redux/helper/axios";
import { TicketHistoryCancelRefundCard } from '../t-h-c-r';
import { TicketCard } from '../ticket-card';
import { UpcomingQrTicket } from '../upcoming-qr-tickets';


interface EventDetails {
  _id: string;
  eventName: string;
  date: string;
}

interface TicketItem {
  ticketType: string;
}
interface RefundPolicy {
  fullRefund: boolean;
  fullRefundDaysBefore?: string;
  partialRefund: boolean;
  partialRefundPercent?: string;
  noRefundAfterDate: boolean;
  noRefundDate?: string | null;
  _id: string;
}

interface Ticket {
  eventDetails?: EventDetails;
  tickets: TicketItem[];
  qrCode: string;
  verifyEntry?: boolean;
  refundPolicy?: RefundPolicy;
  isRefundPolicyEnabled?: boolean;
  refundRequest?: any
}
interface RefundRequest {
  orderId: string;
  eventId: string;
  eventDate: string;
  refundStatus: string;
  refundAmount: number;
  tickets: { ticketType: string }[];
}
interface Props {
  items: any;
  index: number;
  type: string;
  onCancel?: () => void;
}


export function TicketManagementView() {
  const now = useMemo(() => new Date(), []);
  const [activeTab, setActiveTab] = useState('Active Tickets');
  const [visibleActiveCount, setVisibleActiveCount] = useState(2);
  const [tickets, setTickets] = useState<Ticket[]>([]);

  const { _id } = useSelector((state: RootState) => state?.auth?.user);
  const [upcomingQrTicket, setUpcomingQrTicket] = useState<Ticket | null>(null);
  const [refundRequests, setRefundRequests] = useState<RefundRequest[]>([]);
  const refundedOrderIds = refundRequests.map(req => req.orderId);
  const handleLoadMoreActive = () => {
    setVisibleActiveCount(prev => prev + 2);
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };
  const [visibleHistoryCount, setVisibleHistoryCount] = useState(3);
  const handleLoadMoreHistory = () => {
    setVisibleHistoryCount(prev => prev + 4);
  };
  useEffect(() => {
    async function fetchTickets() {
      try {
        const response = await axios.get(`/event-order/user/${_id}`);
        const allTickets: Ticket[] = response.data;

        // ✅ Only include tickets with confirmed payments
        const confirmedTickets = allTickets.filter(
          (ticket: any) => ticket.paymentStatus === 'confirmed'
        );

        // Filter out refunded tickets
        const nonRefundedTickets = confirmedTickets.filter(ticket => {
          if (!ticket.refundRequest) return true;
          return ticket.refundRequest.refundStatus !== 'refunded';
        });

        setTickets(nonRefundedTickets);

        const upcomingTicket = confirmedTickets
          .filter(ticket => {
            const dateStr = ticket.eventDetails?.date;
            const eventDate = dateStr ? new Date(dateStr) : null;
            return eventDate && eventDate > new Date() && ticket.qrCode;
          })
          .sort((a, b) => {
            const dateA = new Date(a.eventDetails?.date || '');
            const dateB = new Date(b.eventDetails?.date || '');
            return dateA.getTime() - dateB.getTime();
          })[0];

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
    async function fetchRefundRequests() {
      try {
        const refundRes = await axios.get(`/refund-request/user/${_id}`);
        console.log("refund", refundRes.data)
        setRefundRequests(refundRes.data);
      } catch (error) {
        console.error("Error fetching refund requests:", error);
      }
    }

    if (_id) {
      fetchRefundRequests();
    }
  }, [_id]);
  const handleCancelRefund = async (orderId: string) => {
    try {
      await axios.patch('/refund-request/cancel', { orderId });
      const refundRes = await axios.get(`/refund-request/user/${_id}`);
      setRefundRequests(refundRes.data);
    } catch (error: any) {
      const msg = error.response?.data?.message || 'Failed to cancel refund request';
      alert(msg);
      console.error('Error cancelling refund request:', error);
    }
  };

  const ticketHistoryItems = tickets.map(ticket => {
    const eventDate = ticket.eventDetails?.date ? new Date(ticket.eventDetails.date) : null;

    let status = '';
    let statusColor = '';
    const isRefunded = refundedOrderIds.includes((ticket as any)._id);

    if (isRefunded) {
      status = 'Refunded';
      statusColor = 'blue';
    } else if (ticket.verifyEntry === true) {
      status = 'Used';
      statusColor = 'green';
    } else if (eventDate && eventDate < now) {
      status = 'Expired';
      statusColor = 'red';
    } else {
      status = 'Active';
      statusColor = 'orange';
    }

    return {
      title: ticket.eventDetails?.eventName || 'Unknown Event',
      date: eventDate
        ? eventDate.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
        : 'Unknown Date',
      type: ticket.tickets?.[0]?.ticketType || 'Standard',
      status,
      statusColor,
      button: ['Download Invoice'],
    };
  });

  // const expiredTickets = tickets.filter(ticket => {
  //   const eventDate = ticket.eventDetails?.date ? new Date(ticket.eventDetails.date) : null;
  //   const isRefunded = refundedOrderIds.includes((ticket as any)._id);
  //   return eventDate && eventDate <= now && !isRefunded;
  // });

  const metrics = useMemo(() => {
    const refundedOrderIdss = refundRequests
      .filter(req => req.refundStatus !== 'cancelled')
      .map(req => req.orderId);
    const activeTickets = tickets.filter(ticket => {
      const eventDate = ticket.eventDetails?.date ? new Date(ticket.eventDetails.date) : null;
      const isRefunded = refundedOrderIdss.includes((ticket as any)._id); // Ensure ticket has _id
      return eventDate && eventDate > now && !isRefunded;
    });
    const expiredTicketsList = tickets.filter(ticket => {
      const eventDate = ticket.eventDetails?.date ? new Date(ticket.eventDetails.date) : null;
      const isRefunded = refundedOrderIdss.includes((ticket as any)._id);
      return eventDate && eventDate <= now && !isRefunded;
    });

    const refundedTickets = tickets.filter(ticket =>
      refundedOrderIdss.includes((ticket as any)._id)
    );

    return [
      {
        title: 'Total',
        value: (activeTickets.length + expiredTicketsList.length + refundedTickets.length).toString(),
      },
      { title: 'Active', value: activeTickets.length.toString() },
      { title: 'Refunded', value: refundedTickets.length.toString() },
      { title: 'Expired', value: expiredTicketsList.length.toString() },
    ];
  }, [tickets, refundRequests, now]);

  const handleDownloadInvoice = async (ticket: Ticket) => {
    try {
      const response = await axios.get(`/refund-request/invoice/${(ticket as any)._id}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${(ticket as any)._id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Invoice download failed:', error);
      alert('Failed to download invoice. Please try again later.');
    }
  };
  const tabNames = ['Active Tickets', 'History', 'Cancellations & Refunds'];

  const enrichedRefunds = refundRequests.map(refund => {
    const matchingTicket = tickets.find(
      ticket => ticket.eventDetails && ticket.eventDetails._id === refund.eventId
    );

    const eventDateObj = new Date(refund.eventDate);
    const isExpired = eventDateObj <= now;

    const statusRaw = refund.refundStatus || 'pending';
    const status = statusRaw.charAt(0).toUpperCase() + statusRaw.slice(1);

    // Show green for confirmed, red for denied or cancelled, orange for pending
    let statusColor = 'orange';
    if (statusRaw.toLowerCase() === 'confirmed') statusColor = 'green';
    else if (['denied', 'cancelled'].includes(statusRaw.toLowerCase())) statusColor = 'red';

    return {
      title: matchingTicket?.eventDetails?.eventName || 'Unknown Event',
      date: eventDateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      type: refund.tickets?.[0]?.ticketType || 'Standard',
      money: refund.refundAmount ? `${refund.refundAmount} XAF` : '',
      status,
      statusColor,
      button: refund.refundStatus === 'pending' && !isExpired ? ['Cancel Request'] : [],
    };
  });

  // Only consider tickets that have refundPolicy enabled
  const eventPoliciesMap: { [eventId: string]: Ticket } = {};

  tickets.forEach(ticket => {
    if (ticket.eventDetails && ticket.isRefundPolicyEnabled) {
      const eventId = ticket.eventDetails._id;
      // Save only the first ticket for each event
      if (!eventPoliciesMap[eventId]) {
        eventPoliciesMap[eventId] = ticket;
      }
    }
  });

  // Convert to array
  const eventPolicies = Object.values(eventPoliciesMap);

  return (
    <DashboardContent>
      <PageTitleSection title="Ticket Management" />

      {/* Tabs */}
      <Grid container spacing={2} justifyContent="center">
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: { md: 'center' },
              flexWrap: { xs: 'nowrap', sm: 'wrap' },
              overflowX: { xs: 'auto', sm: 'visible' },
              gap: 2,
              pb: 1,
            }}
          >
            {tabNames.map((text) => (
              <Button
                key={text}
                variant="contained"
                onClick={() => handleTabChange(text)}
                sx={{
                  backgroundColor: activeTab === text ? '#0B2E4C' : '#818181',
                  fontSize: { xs: '12px', sm: '14px', md: '16px' },
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  minWidth: '150px',
                  '&:hover': {
                    backgroundColor: activeTab === text ? '#0B2E4C' : '#818181',
                  },
                }}
              >
                {text}
              </Button>
            ))}
          </Box>
        </Grid>
      </Grid>

      <MatrixThreeCard metrics={metrics} sm={3} md={3} />

      {/* Conditionally Render Each Tab Section */}
      {activeTab === 'Active Tickets' && (
        <Box boxShadow={3} borderRadius={3} mt={3} p={{ xs: 1, md: 3 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={3}
            fontSize={{ xs: '20px', sm: '26px', md: '34px' }}
          >
            My Active Tickets
          </Typography>

          {tickets?.length > 0 ? (
            <>
              <Grid container spacing={3} mt={3}>
                {tickets
                  .filter(ticket => {
                    const dateStr = ticket.eventDetails?.date;
                    const eventDate = dateStr ? new Date(dateStr) : null;
                    return eventDate && eventDate > new Date();
                  })
                  .slice(0, visibleActiveCount)
                  .map((ticketc, index) => (
                    <Grid item xs={12} sm={6} md={6} key={index} mb={6}>
                      <TicketCard ticket={ticketc} />
                    </Grid>
                  ))}
              </Grid>

              {/* Load More button */}
              {visibleActiveCount <
                tickets.filter(ticket => {
                  const dateStr = ticket.eventDetails?.date;
                  const eventDate = dateStr ? new Date(dateStr) : null;
                  return eventDate && eventDate > new Date();
                }).length && (
                  <Box mt={3} display="flex" justifyContent="center">
                    <Button variant="outlined" onClick={handleLoadMoreActive}>
                      Load More
                    </Button>
                  </Box>
                )}
            </>
          ) : (
            <Typography variant="body1" color="textSecondary" mt={2}>
              You don&#39;t have any active tickets
            </Typography>
          )}
        </Box>
      )}

      {activeTab === 'History' && (
        <Box boxShadow={3} borderRadius={3} mt={3} p={{ xs: 1, md: 3 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={3}
            fontSize={{ xs: '20px', sm: '26px', md: '34px' }}
          >
            Ticket History
          </Typography>
          <Grid container spacing={3}>
            {ticketHistoryItems.length > 0 ? (
              ticketHistoryItems
                .slice() // Create a copy
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) // Sort by newest
                .slice(0, visibleHistoryCount) // Show only visible items
                .map((ticket, index) => (
                  <TicketHistoryCancelRefundCard
                    key={index}
                    items={ticket}
                    index={index}
                    type="History"
                    onDownloadInvoice={() => handleDownloadInvoice(tickets[index])}
                  />
                ))
            ) : (
              <Typography variant="body1" color="textSecondary">
                No ticket history available.
              </Typography>
            )}
          </Grid>

          {/* Load More Button */}
          {visibleHistoryCount < ticketHistoryItems.length && (
            <Box mt={3} display="flex" justifyContent="center">
              <Button variant="outlined" onClick={handleLoadMoreHistory}>
                Load More
              </Button>
            </Box>
          )}
        </Box>
      )}

      {activeTab === 'Cancellations & Refunds' && (
        <Box boxShadow={3} borderRadius={3} mt={3} p={{ xs: 1, md: 3 }}>
          <Typography
            variant="h5"
            fontWeight={600}
            mb={3}
            fontSize={{ xs: '20px', sm: '26px', md: '34px' }}
          >
            Cancellations & Refunds
          </Typography>

          <Grid container spacing={3}>
            {refundRequests.length > 0 ? (
              enrichedRefunds.map((refund, index) => (
                <TicketHistoryCancelRefundCard
                  key={index}
                  items={refund}
                  index={index}
                  type="Cancel"
                  onCancel={() => handleCancelRefund(refundRequests[index].orderId)}
                />
              ))

            ) : (
              <Grid item xs={12}>
                <Box display="flex" alignItems="center" height="100%">
                  <Typography variant="body1" color="textSecondary" sx={{ fontWeight: 'bold' }}>
                    No refund requests found.
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          <Grid container mt={3} spacing={2}>
            <Grid item xs={12}>
              <Card sx={{ borderRadius: 3, boxShadow: 3, p: 3 }}>
                <Typography variant="h5" fontWeight={600} mb={2}>
                  Refund Policy
                </Typography>

                {eventPolicies.length > 0 ? (
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {eventPolicies.map((ticket, idx) => {
                      const policy = ticket.refundPolicy;
                      const event = ticket.eventDetails;

                      const policies = [];
                      if (policy?.fullRefund) policies.push(`Full refund if canceled ${policy.fullRefundDaysBefore} days before`);
                      if (policy?.partialRefund) policies.push(`Partial refund (${policy.partialRefundPercent || 'N/A'}%)`);
                      if (policy?.noRefundAfterDate && policy.noRefundDate) {
                        const formattedDate = new Date(policy.noRefundDate).toISOString().split('T')[0]; // "2025-09-01"
                        policies.push(`No refund after ${formattedDate}.`);
                      }

                      return (
                        <li key={idx} style={{ marginBottom: '12px' }}>
                          <strong>{event?.eventName}:</strong> {policies.join(' | ')}
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <Typography variant="body1" color="textSecondary" mt={2}>
                    No refund policies available.
                  </Typography>
                )}
              </Card>
            </Grid>
          </Grid>

        </Box>
      )}

      {/* QR Code Section (Shown regardless of tab) */}
      {upcomingQrTicket && upcomingQrTicket.eventDetails && (
        <UpcomingQrTicket upcomingQrTicket={upcomingQrTicket} />
      )}
    </DashboardContent>
  );
}
