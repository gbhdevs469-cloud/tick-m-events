import { Card, MenuItem, Select } from "@mui/material";
import { useState } from "react";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

interface Event {
    _id: string;
    eventName: string;
    order: Order[];
    // Add other event properties as needed
}

export interface Order {
    _id: string;
    eventId: string;
    userId: string;
    tickets: Ticket[];
    totalAmount: number;
    paymentStatus: string;
    paymentMethod: string;
    transactionId: string;
    verifyEntry: boolean;
    ticketCode: string;
    createdAt: string;
    qrCode?: string | null;
    participantDetails?: any
}

interface Ticket {
    ticketId: string;
    ticketType: string;
    quantity: number;
    unitPrice: number;
    _id: string;
}

interface SelectTicketsProps {
    events: Event[];
    onEventSelectOrder: (order: Order | null) => void;
    selectedEventOrder: Order | null;
    selectedParticipant: any;
    onParticipantSelect: (participant: any) => void;
    onPaymentStatusCheck: (isConfirmed: boolean) => void; // New prop
}

interface Participant {
    _id: string;
    name: string;
    age: string;
    gender: string;
    validation: boolean;
    entryTime?: string;
}

export function SelectTickets({ 
    events, 
    onEventSelectOrder, 
    selectedParticipant, 
    selectedEventOrder, 
    onParticipantSelect,
    onPaymentStatusCheck 
}: SelectTicketsProps) {
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [orders, setOrders] = useState<Order[]>([]);
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState<boolean>(true);

    const handleEventChange = (eventId: string) => {
        const selected = events.find((e: any) => e._id === eventId) || null;
        setSelectedEvent(selected);
        setOrders(selected?.order || []);
        setParticipants([]);
        setIsPaymentConfirmed(true); // Reset payment status
        onEventSelectOrder(null); // Reset order selection when event changes
        onParticipantSelect?.(null); // Reset participant selection
        onPaymentStatusCheck?.(true); // Reset payment status check
    };

    const handleOrderChange = (orderId: string) => {
        const selected = orders.find(o => o._id === orderId) || null;
        onEventSelectOrder(selected);
        
        // Check payment status
        const paymentConfirmed = selected?.paymentStatus === 'confirmed';
        setIsPaymentConfirmed(paymentConfirmed);
        onPaymentStatusCheck?.(paymentConfirmed);
        
        if (paymentConfirmed) {
            setParticipants(selected?.participantDetails || []);
        } else {
            setParticipants([]);
        }
        onParticipantSelect?.(null); // Reset participant selection when order changes
    };

    const handleParticipantChange = (participantId: string) => {
        const selected = participants.find(p => p._id === participantId) || null;
        onParticipantSelect?.(selected);
    };

    return (
        <Card sx={{ p: 2, borderRadius: "12px", boxShadow: 3 }}>
            <HeadingCommon variant="body1" title="Select Event:" weight={600} />
            <Select
                fullWidth
                value={selectedEvent?._id || ''}
                onChange={(e) => handleEventChange(e.target.value as string)}
                sx={{
                    textTransform: 'capitalize',
                }}
            >
                <MenuItem value="" disabled>
                    Select an event
                </MenuItem>
                {events.map((event: Event) => (
                    <MenuItem
                        key={event._id}
                        value={event._id}
                        sx={{
                            fontSize: '0.8rem',
                            minHeight: '32px',
                            textTransform: 'capitalize',
                        }}
                    >
                        {event.eventName}
                    </MenuItem>
                ))}
            </Select>

            {selectedEvent && (
                <>
                    <HeadingCommon variant="body1" mt={2} title="Select Order:" weight={600} />

                    <Select
                        fullWidth
                        value={selectedEventOrder?._id || ''}
                        onChange={(e) => handleOrderChange(e.target.value as string)}
                        sx={{
                            textTransform: 'capitalize',
                        }}
                    >
                        <MenuItem value="" disabled>
                            Select an Order
                        </MenuItem>
                        {orders.map((order: Order) => (
                            <MenuItem
                                key={order._id}
                                value={order._id}
                                sx={{
                                    fontSize: '0.8rem',
                                    minHeight: '32px',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {`Order - #${order.ticketCode}`}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}

            {/* Only show participant selection if payment is confirmed */}
            {selectedEventOrder && isPaymentConfirmed && participants.length > 0 && (
                <>
                    <HeadingCommon variant="body1" mt={2} title="Select Participant:" weight={600} />

                    <Select
                        fullWidth
                        value={selectedParticipant?._id || ''}
                        onChange={(e) => handleParticipantChange(e.target.value as string)}
                        sx={{
                            textTransform: 'capitalize',
                        }}
                    >
                        <MenuItem value="" disabled>
                            Select a Participant
                        </MenuItem>
                        {participants.map((participant: Participant) => (
                            <MenuItem
                                key={participant._id}
                                value={participant._id}
                                sx={{
                                    fontSize: '0.8rem',
                                    minHeight: '32px',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {`${participant.name} (${participant.gender}, ${participant.age}) ${participant.validation ? '✓' : ''}`}
                            </MenuItem>
                        ))}
                    </Select>
                </>
            )}

            {/* Show payment denied message if payment is not confirmed */}
            {/* {selectedEventOrder && !isPaymentConfirmed && (
                <HeadingCommon 
                    variant="body2" 
                    mt={2} 
                    title="Payment not confirmed. Ticket validation denied." 
                    color="error" 
                    weight={600} 
                />
            )} */}
        </Card>
    );
}