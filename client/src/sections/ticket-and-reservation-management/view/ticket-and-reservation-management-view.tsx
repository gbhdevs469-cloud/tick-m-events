import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { useLocation } from 'react-router-dom';
import { PageTitleSection } from "src/components/page-title-section";
import { DashboardContent } from "src/layouts/dashboard";
import { AppDispatch, RootState } from "src/redux/store";
import { fetchTicketType } from "src/redux/actions/ticket-&-reservation-management.action";
import { EventBreadCrum } from "src/sections/entry-validation/event-status";
import { eventFetch } from "src/redux/actions/event.action";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";

import { TicketManagement } from "../ticket-management";
import { SalesAndStockTracking } from "../sales-&-stock-tracking";
import { ReservationManagement } from "../reservation-management";
import { RefundAndCancellationManangement } from "../refund-&-cancellation-management";

import("../style.css")

interface Event {
  _id: string;
  eventName: string;
}

export function TicketAndReservationManagementView() {
  const location = useLocation();
  const locationSelectedEvent = location.state?.selectedEvent;
  const { tickets,ticketWiseRevenue } = useSelector((state: RootState) => state?.ticketReservationMang);
  const { fullData } = useSelector((state: RootState) => state?.event);
  const { __events } = useSelector((state: RootState) => state?.organizer);

  const dispatch = useDispatch<AppDispatch>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  
  const handleEventSelect = (event: Event | null) => {
    setSelectedEvent(event);
  };

  useEffect(() => {
    dispatch(fatchOrgEvents());
    dispatch(eventFetch());
  }, [dispatch]);
 
  useEffect(() => {
  if (selectedEvent?._id) {
    dispatch(fetchTicketType(selectedEvent._id));
  }
}, [dispatch, selectedEvent]);

  useEffect(() => {
    if (locationSelectedEvent) {
      setSelectedEvent(locationSelectedEvent);
    }
  }, [locationSelectedEvent]);


  useEffect(() => {
    if (locationSelectedEvent && fullData?.length > 0) {
      const matchedEvent = fullData.find(
        (event: any) => event._id === locationSelectedEvent._id
      );
      if (matchedEvent) {
        setSelectedEvent(matchedEvent);
      }
    }
  }, [locationSelectedEvent, fullData]);

  return (
    <>
      <EventBreadCrum events={__events} onEventSelect={handleEventSelect} eventInformation={selectedEvent} />

      <DashboardContent>

        <PageTitleSection
          title="Ticket & Reservation Management"
          desc=""
        />
        <TicketManagement tickets={tickets} selectedEvent={selectedEvent}/>
        <SalesAndStockTracking 
        tickets={tickets} 
        selectedEvent={selectedEvent}
        ticketWiseRevenue={ticketWiseRevenue}

        />
        {selectedEvent ? (
          <ReservationManagement orderList={selectedEvent}/>
        ) : (
          <Box
            sx={{
              width: '100%',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              p: 3,
              mt: 3,
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Event Selected
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please select an event to view reservation details
            </Typography>
            {/* <EventIcon sx={{ fontSize: 60, color: '#bdbdbd' }} /> */}
          </Box>
        )}
        {selectedEvent ? (
          <RefundAndCancellationManangement orderList={selectedEvent} />
        ) : (
          <Box
            sx={{
              width: '100%',
              border: '1px solid #e0e0e0',
              borderRadius: 3,
              p: 3,
              mt: 3,
              textAlign: 'center',
              backgroundColor: '#fafafa'
            }}
          >
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Event Selected
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Please select an event to view reservation details
            </Typography>
          </Box>
        )}
      </DashboardContent>
    </>
  )
}