import { Box, Button, Grid, Select, Paper, TextField, Typography, MenuItem, SelectChangeEvent } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, useCallback, useMemo } from "react";
import { useSearchParams } from 'react-router-dom';

import { eventByIdFetch, eventFetch } from "src/redux/actions/event.action";
import { ParticipantTable } from "src/components/tables/party-participant-table";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { AppDispatch, RootState } from "src/redux/store";
import { promotionValidate } from "src/redux/actions/promotionAndOffer";
import { HeadProcess } from "./head-process";
import { availablePromoCodes, PromoCode } from "../front-home/utill";
import { processOneTableHeaders } from "./utils";

interface Event {
    _id: string;
    eventName: string;
    date: string;
    time: string;
}

export function ProcessOne({ onTicketsSelected, onNext }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const { basicDetails, eventWithDetails } = useSelector((state: RootState) => state?.event);
    const [promoAppliedFromUrl, setPromoAppliedFromUrl] = useState(false);
    const [events, setEvents] = useState<Event[]>(basicDetails || []);
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
    const [promoError, setPromoError] = useState('');
    const [searchParams] = useSearchParams();
    const eventIdFromUrl = searchParams.get('eventId');

    const rawPaymentMethods = eventWithDetails?.tickets?.[0]?.paymentMethods;

    const eventId = useMemo(() => eventWithDetails?._id || '', [eventWithDetails]);
    const tickets = useMemo(() => eventWithDetails?.tickets || [], [eventWithDetails]);
    const totalTicketsSelected = useMemo(
        () => Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0),
        [ticketQuantities]
    );

    const selectedTicketsFromUrl = useMemo(() => {
        const raw = searchParams.get("selected");
        if (!raw) return [];
        try {
            return JSON.parse(raw);
        } catch {
            return [];
        }
    }, [searchParams]);
    const promoFromUrl = searchParams.get("promo");
    // Initialize ticket quantities
    useEffect(() => {
        if (tickets.length > 0) {
            const initialQuantities: Record<string, number> = {};
            tickets.forEach((ticket: any) => {
                ticket.tickets.forEach((item: any) => {
                    const found = selectedTicketsFromUrl.find(
                        (sel: any) => sel.ticketName === item.ticketType
                    );

                    initialQuantities[item._id] = found ? found.quantity : 0;
                });
            });
            setTicketQuantities(initialQuantities);
        }
    }, [tickets, selectedTicketsFromUrl]);

    const fetchEvents = useCallback(async () => {
        try {
            await dispatch(eventFetch());
        } catch (err) {
            console.log(err.message || 'Failed to fetch event data');
        }
    }, [dispatch]);

    const fetchEventById = useCallback(async (id: string) => {
        if (!id) return;
        try {
            await dispatch(eventByIdFetch(id));
        } catch (error) {
            console.error("Failed to fetch event:", error);
        }
    }, [dispatch]);

    // Initial data loading
    useEffect(() => {
        if (isInitialLoad && basicDetails.length === 0) {
            fetchEvents();
            setIsInitialLoad(false);
        }
    }, [basicDetails.length, fetchEvents, isInitialLoad]);

    // Set initial selected event
    useEffect(() => {
        if (basicDetails.length > 0 && !selectedEvent) {
            setEvents(basicDetails);
            setSelectedEvent(basicDetails[0]);
        }
    }, [basicDetails, selectedEvent]);

    // Fetch event details when selected
    useEffect(() => {
        if (selectedEvent?._id) {
            fetchEventById(selectedEvent._id);
        }
    }, [selectedEvent?._id, fetchEventById]);

    // Select event from URL
    useEffect(() => {
        if (eventIdFromUrl && events.length > 0) {
            const foundEvent = events.find(e => e._id === eventIdFromUrl);
            if (foundEvent) setSelectedEvent(foundEvent);
        }
    }, [eventIdFromUrl, events]);

    const handleEventChange = useCallback((event: SelectChangeEvent<string>) => {
        const event_id = event.target.value;
        const foundEvent = events.find(e => e._id === event_id);
        setSelectedEvent(foundEvent ?? null);
    }, [events]);

    const calculateSubtotal = useCallback(() => {
        let subtotal = 0;
        tickets.forEach((ticket: any) => {
            ticket.tickets.forEach((item: any) => {
                const quantity = ticketQuantities[item._id] || 0;
                const price = item.price === "Free" ? 0 : parseFloat(item.price);
                subtotal += quantity * price;
            });
        });
        return subtotal;
    }, [tickets, ticketQuantities]);

    const calculateDiscount = useCallback((): number => {
        if (!appliedPromo) return 0;

        // Backend-calculated discount
        if ("calculation" in appliedPromo && appliedPromo.calculation != null) {
            return Number(appliedPromo.calculation) || 0;
        }

        let discount = 0;

        // Percentage Discount (your promo AC123)
        if (
            appliedPromo.type === "percentage" ||
            appliedPromo.type === "percentageDiscount"
        ) {
            tickets.forEach((ticketGroup: any) => {
                ticketGroup.tickets.forEach((item: any) => {
                    const qty = ticketQuantities[item._id] || 0;
                    const price = item.price === "Free" ? 0 : Number(item.price);

                    // IMPORTANT FIX (your promo uses item.id not item._id)
                    const isApplicable =
                        appliedPromo.ticketSelection === item.id ||
                        (Array.isArray(appliedPromo.ticketSelection) &&
                            appliedPromo.ticketSelection.includes(item.id));

                    if (isApplicable) {
                        discount += qty * price * (appliedPromo.value / 100);
                    }
                });
            });

            return discount;
        }

        // Flat Value Discount 
        if (
            appliedPromo.type === "simple" ||
            appliedPromo.type === "fixedValueDiscount"
        ) {
            const subtotal = calculateSubtotal();
            return Math.min(appliedPromo.value, subtotal);
        }

        // Group Buy Discount
        if (appliedPromo.type === "group") {
            if (!("groupBuy" in appliedPromo) || !("groupGet" in appliedPromo))
                return 0;

            let totalFreeItems = 0;

            tickets.forEach((ticketGroup: any) => {
                ticketGroup.tickets.forEach((item: any) => {
                    const quantity = ticketQuantities[item._id] || 0;
                    const price = Number(item.price) || 0;

                    const freeItems =
                        Math.floor(quantity / appliedPromo.groupBuy) *
                        appliedPromo.groupGet;

                    totalFreeItems += freeItems * price;
                });
            });

            return totalFreeItems;
        }

        // Early Buyer
        if (appliedPromo.type === "earlyBuyer") {
            const subtotal = calculateSubtotal();

            if (appliedPromo.earlyBuyerDiscountType === "percentage") {
                return subtotal * (appliedPromo.value / 100);
            }

            if (appliedPromo.earlyBuyerDiscountType === "fixed") {
                return Math.min(appliedPromo.value, subtotal);
            }
        }

        return 0;
    }, [appliedPromo, tickets, ticketQuantities, calculateSubtotal]);


    const calculateTotal = useCallback(() =>
        Math.max(0, calculateSubtotal() - calculateDiscount()),
        [calculateSubtotal, calculateDiscount]
    );
    const getSelectedTickets = useCallback(() => {
        const selected: Array<{
            ticketType: string;
            quantity: number;
            unitPrice: number;
            ticketId: string;
        }> = [];

        tickets.forEach((ticket: any) => {
            ticket.tickets.forEach((item: any) => {
                const quantity = ticketQuantities[item._id] || 0;
                if (quantity > 0) {
                    selected.push({
                        ticketId: item.id,
                        ticketType: item.ticketType,
                        quantity,
                        unitPrice: item.price === "Free" ? 0 : parseFloat(item.price)
                    });
                }
            });
        });

        return selected;
    }, [tickets, ticketQuantities]);

    const applyPromoCode = useCallback(async () => {
        setPromoError('');

        const selectedTickets = getSelectedTickets();
        if (!promoInput) {
            setPromoError('Promo code required');
            return;
        }

        try {
            const result = await dispatch(promotionValidate(promoInput.toUpperCase(), eventId, selectedTickets));

            if (result.success) {

                console.log('✅ Promo details:', result.promo);

                setAppliedPromo(result.promo);
            } else {
                setPromoError(result.message || 'Invalid promo code');
            }
        } catch (error: any) {
            console.error("Error applying promo:", error);
            setPromoError('Something went wrong');
        }
    }, [promoInput, eventId, getSelectedTickets, dispatch]);

    // Auto apply promo if present in URL
    useEffect(() => {
        if (
            promoFromUrl &&
            !promoAppliedFromUrl &&
            eventId &&
            tickets.length > 0 &&
            Object.keys(ticketQuantities).length > 0 &&  // ensure initialized
            Object.values(ticketQuantities).some(q => q > 0) &&  // ensure actual quantities exist
            !appliedPromo
        ) {
            // Set promo input
            setPromoInput(promoFromUrl.toUpperCase());

            // Delay apply slightly to ensure quantities settle
            setTimeout(() => {
                applyPromoCode();
                setPromoAppliedFromUrl(true);
            }, 50);
        }
    }, [
        promoFromUrl,
        promoAppliedFromUrl,
        eventId,
        tickets,
        ticketQuantities,
        appliedPromo,
        applyPromoCode
    ]);

    const removePromoCode = useCallback(() => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoError('');
        setPromoAppliedFromUrl(true); // prevent auto re-apply even though URL still has promo
    }, []);

    const handleDecrement = useCallback((ticketId: string) => {
        setTicketQuantities(prev => (prev[ticketId] <= 0 ? prev : { ...prev, [ticketId]: prev[ticketId] - 1 }));
    }, []);

    const handleIncrement = useCallback((ticketId: string, maxTickets?: string) => {
        setTicketQuantities(prev => (maxTickets !== undefined && prev[ticketId] >= parseInt(maxTickets, 10) ? prev : { ...prev, [ticketId]: prev[ticketId] + 1 }));
    }, []);

    useEffect(() => {
        let parsedPaymentMethods: string[] = [];

        try {
            if (Array.isArray(rawPaymentMethods)) parsedPaymentMethods = rawPaymentMethods;
            else if (typeof rawPaymentMethods === "string") {
                parsedPaymentMethods = rawPaymentMethods.trim().startsWith("[") ? JSON.parse(rawPaymentMethods) : [rawPaymentMethods];
            }
        } catch (error) {
            console.warn("Failed to parse paymentMethods:", error);
        }

        const selection = {
            tickets: getSelectedTickets(),
            totalAmount: calculateTotal(),
            eventId,
            ticketCount: totalTicketsSelected,
            paymentMethods: parsedPaymentMethods,
        };

        onTicketsSelected(selection);
    }, [ticketQuantities, eventId, getSelectedTickets, calculateTotal, onTicketsSelected, totalTicketsSelected, rawPaymentMethods]);

    return (
        <Box sx={{ p: 3, boxShadow: 3, borderRadius: 3, position: "relative", mt: 3 }}>
            <HeadProcess title="Participant Details" step="1" />
            <Grid container spacing={3} mt={2} alignItems="center">
                {/* Event Selection */}
                <Grid item xs={12} sm={7} md={7}>
                    <Paper sx={{ p: 3, boxShadow: 3, borderRadius: 2, backdropFilter: "blur(14px)" }}>
                        <HeadingCommon weight={600} variant="h6" title="Select Event" baseSize="20px" />
                        <Select
                            value={selectedEvent?._id || ''}
                            onChange={handleEventChange}
                            sx={{ mt: 2, textTransform: "capitalize", width: "100%", '& .MuiOutlinedInput-root': { '& fieldset': { borderColor: 'black' }, '&:hover fieldset': { borderColor: 'black' }, '&.Mui-focused fieldset': { borderColor: 'black' } } }}
                            displayEmpty
                            inputProps={{ 'aria-label': 'Select Event' }}
                        >
                            {events.length === 0 ? (
                                <MenuItem disabled value="">
                                    <em>No events available</em>
                                </MenuItem>
                            ) : events.map((event) => (
                                <MenuItem key={event._id} value={event._id} sx={{ textTransform: "capitalize" }}>
                                    {event.eventName}
                                </MenuItem>
                            ))}
                        </Select>
                    </Paper>
                </Grid>

                {/* Summary */}
                <Grid item xs={12} sm={5} md={5}>
                    <Paper sx={{ height: "100%", p: 3, boxShadow: 4, borderRadius: 2, backdropFilter: "blur(14px)" }}>
                        <HeadingCommon weight={600} variant="h6" title="Summary" baseSize="20px" />
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mt: 1 }}>
                            <HeadingCommon title={`Tickets: ${totalTicketsSelected}`} baseSize="16px" />
                            <HeadingCommon title={`Discount: -${calculateDiscount().toLocaleString() || 0} XAF`} baseSize="16px" />
                            <HeadingCommon title={`Payment Method: ${eventWithDetails?.tickets?.[0]?.paymentMethods || 'Cash on Delivery'}`} baseSize="16px" />
                        </Box>
                        <Button variant="outlined" sx={{ borderRadius: 1, minWidth: "230px", flexGrow: 1, fontWeight: 500, color: "#0B2E4C", borderColor: "#0B2E4C", mt: 2 }}>
                            Net Amount To Be Paid :  {calculateTotal().toLocaleString()} XAF
                        </Button>
                    </Paper>
                </Grid>
            </Grid>

            <HeadingCommon variant="h6" title="Select Tickets" baseSize="26px" />
            <ParticipantTable headers={processOneTableHeaders} data={eventWithDetails?.tickets} ticketQuantities={ticketQuantities} handleDecrement={handleDecrement} handleIncrement={handleIncrement} />

            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                <HeadingCommon variant="h6" title={`Total: ${calculateSubtotal().toLocaleString()} XAF`} baseSize="26px" />
            </Box>

            {/* Promo Code */}
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={8} md={8}>
                    <TextField
                        fullWidth
                        required
                        variant="outlined"
                        size="small"
                        placeholder="Enter Promo Code"
                        value={promoInput}
                        onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                        disabled={!!appliedPromo}
                    />
                </Grid>
                <Grid item xs={12} sm={4} md={4}>
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            paddingY: "9px",
                            fontSize: { xs: "10px", sm: "11px", md: "12px" },
                            backgroundColor: "#0B2E4C", color: "#fff"
                        }}
                        onClick={appliedPromo ? removePromoCode : applyPromoCode}
                    >
                        {appliedPromo ? 'Remove' : 'Apply'} Promo Code
                    </Button>
                </Grid>
            </Grid>

            {/* Promo Display */}
            {appliedPromo && (
                <Box>
                    <Typography fontSize={{ xs: "0.9rem", md: "1rem" }} sx={{ color: "green" }}>
                        <strong>Promo Applied:</strong> {appliedPromo.code} (
                        {appliedPromo.type === 'percentage' && `${appliedPromo.value}% off`}
                        {appliedPromo.type === 'simple' && `${appliedPromo.value.toLocaleString()} XAF off`}
                        {appliedPromo.type === 'group' && `Buy ${appliedPromo.groupBuy} Get ${appliedPromo.groupGet} free`}
                        {appliedPromo.type === 'earlyBuyer' && `${appliedPromo.value}${appliedPromo.earlyBuyerDiscountType === 'percentage' ? '%' : ' XAF'} off (Early Buyer)`}
                        )
                    </Typography>
                    <Button size="small" onClick={removePromoCode} sx={{ color: 'red', fontSize: '0.7rem' }}>Remove Promo</Button>
                </Box>
            )}

            {promoError && <HeadingCommon color="error" title={promoError} baseSize="14px" />}

            <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                <HeadingCommon variant="h6" title={`Net Amount: ${calculateTotal().toLocaleString()} XAF`} baseSize="26px" />
            </Box>

            <Box mt={3} display="flex" justifyContent="center">
                <Button onClick={onNext} fullWidth variant="contained" sx={{ bgcolor: "#0B3558", mt: 2 }} disabled={!selectedEvent || totalTicketsSelected < 1}>
                    Proceed to Participant Details
                </Button>
            </Box>
        </Box>
    );
}
