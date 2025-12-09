import { Box, Grid } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import axios from "src/redux/helper/axios";

import { eventFetch, todayEventFetch } from "src/redux/actions/event.action";
import { PageTitleSection } from "src/components/page-title-section";
import { AppDispatch, RootState } from "src/redux/store";
import { orderBasedUserEventFetch } from "src/redux/actions/participant/tickt-validation";

import { Order, SelectTickets } from "../select-event";
import { TicketsStatus } from "../ticket-status";
import { TicketQRDisplay } from "../ticket-qr-display";
import { ScannedTickets } from "../scanned-tickets";

interface Ticket {
    _id: string;
    qrCode: string;
    eventDetails?: {
        date?: string;
        eventName?: string;
    };

}
interface Event {
    _id: string;
    eventName: string;
    order: Order[];
}

export function TicketValidationAtEntryView() {
    const dispatch = useDispatch<AppDispatch>();
    const [selectedEventOrder, setSelectedEventOrder] = useState<Order | null>(null);
    const [tickets, setTickets] = useState<Event[]>([]);
    const [upcomingQrTicket, setUpcomingQrTicket] = useState<Ticket | null>(null);
    const _id = useSelector((state: RootState) => state.auth.user?._id);
    const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean>(true);

    const handleEventSelectOrder = (order: Order | null) => {
        setSelectedEventOrder(order);
        // Reset participant when order changes
        setSelectedParticipant(null);
    };

    const handlePaymentStatusCheck = (isConfirmed: boolean) => {
        setIsPaymentConfirmed(isConfirmed);
        // If payment is not confirmed, clear participant selection
        if (!isConfirmed) {
            setSelectedParticipant(null);
        }
    };

    useEffect(() => {
        dispatch(todayEventFetch());
        dispatch(orderBasedUserEventFetch())
    }, [dispatch]);

    useEffect(() => {
        async function fetchTickets() {
            try {
                const response = await axios.get(`/event-order/user/${_id}`);
                const orders: any[] = response.data;
                const groupedEvents: Event[] = orders.reduce((acc: Event[], order) => {
                    const eventId = order.eventDetails?._id;
                    if (!eventId) return acc;

                    const existingEvent = acc.find(e => e._id === eventId);
                    const orderData: Order = {
                        _id: order._id,
                        eventId: order.eventId,
                        userId: order.userId,
                        tickets: order.tickets,
                        participantDetails: order.participantDetails,
                        totalAmount: order.totalAmount,
                        paymentStatus: order.paymentStatus,
                        paymentMethod: order.paymentMethod,
                        transactionId: order.transactionId,
                        verifyEntry: order.verifyEntry,
                        ticketCode: order.ticketCode,
                        createdAt: order.createdAt,
                        qrCode: order.qrCode || null
                    };

                    if (existingEvent) {
                        existingEvent.order.push(orderData);
                    } else {
                        acc.push({
                            _id: eventId,
                            eventName: order.eventDetails?.eventName || "Untitled Event",
                            order: [orderData]
                        });
                    }

                    return acc;
                }, []);
                setTickets(groupedEvents);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            }
        }

        if (_id) {
            fetchTickets();
        }
    }, [_id]);


    return (
        <Box p={3}>
            <PageTitleSection title="Entry Validation" />

            <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
                <Grid item xs={12} md={6} sx={{ display: "flex" }}>
                    <Box sx={{ display: "flex", flexDirection: "column", width: "100%" }}>
                        {/* Select Event and Order */}
                        <SelectTickets
                            events={tickets}
                            onEventSelectOrder={handleEventSelectOrder}
                            selectedEventOrder={selectedEventOrder}
                            onParticipantSelect={setSelectedParticipant}
                            selectedParticipant={selectedParticipant}
                            onPaymentStatusCheck={handlePaymentStatusCheck}
                        />

                        {/* Ticket Status */}
                        <TicketsStatus 
                            participant={selectedParticipant} 
                            order={selectedEventOrder}
                            isPaymentConfirmed={isPaymentConfirmed}
                        />
                    </Box>
                </Grid>

                {/* Ticket QR Code */}
                <TicketQRDisplay selectedOrder={selectedEventOrder} />

                {/* Scanned Tickets */}
                <ScannedTickets />

                {/* Example: show upcoming ticket if available */}
                {upcomingQrTicket && (
                    <Grid item xs={12}>
                        <Box mt={2} p={2} border="1px solid #ddd" borderRadius="8px">
                            <strong>Upcoming Ticket:</strong> {upcomingQrTicket.eventDetails?.eventName} -{" "}
                            {upcomingQrTicket.eventDetails?.date}
                        </Box>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
}