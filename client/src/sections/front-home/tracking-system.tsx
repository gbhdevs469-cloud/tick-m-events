import { useState } from 'react';
import { Box, Button, Card, Divider, Grid, IconButton, TextField, Typography } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { formatEventDate, formatTimeTo12Hour } from "src/hooks/formate-time";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'; // Added
import { promotionValidate } from "src/redux/actions/promotionAndOffer"; // Added
import { AppDispatch } from "src/redux/store"; // Added
import { PurchaseModal } from './tickte-purchase-modal';

export function TrackingSystem({ tickets, location, date, time, eventId, eventName }: any) {
    const dispatch = useDispatch<AppDispatch>(); // Added
    const navigate = useNavigate();

    // Initialize state for ticket quantities
    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>(() => {
        const initialQuantities: Record<string, number> = {};
        tickets?.forEach((ticket: any) => {
            ticket.tickets.forEach((item: any) => {
                initialQuantities[item._id] = 0;
            });
        });
        return initialQuantities;
    });

    const [modalOpen, setModalOpen] = useState(false);

    // Promo code state
    const [promoInput, setPromoInput] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<any>(null); // Changed to any
    const [promoError, setPromoError] = useState('');
    const [isValidatingPromo, setIsValidatingPromo] = useState(false); // Added loading state

    // Check if event has passed
    const eventDateTime = new Date(`${date}T${time}`);
    const currentDateTime = new Date();
    const isEventPassed = currentDateTime > eventDateTime;

    // Handle increment
    const handleIncrement = (ticketId: string, maxTickets: number | null) => {
        setTicketQuantities(prev => {
            if (maxTickets !== null && prev[ticketId] >= maxTickets) {
                return prev;
            }
            return {
                ...prev,
                [ticketId]: prev[ticketId] + 1
            };
        });
    };

    // Handle decrement
    const handleDecrement = (ticketId: string) => {
        setTicketQuantities(prev => {
            if (prev[ticketId] <= 0) {
                return prev;
            }
            return {
                ...prev,
                [ticketId]: prev[ticketId] - 1
            };
        });
    };

    // Helper function to safely get price as number
    const getPriceAsNumber = (price: any): number => {
        if (typeof price === 'number') {
            return price;
        }
        if (typeof price === 'string') {
            return parseFloat(price.replace(/[^0-9.]/g, '')) || 0;
        }
        return 0;
    };

    // Helper function to safely get total tickets as number
    const getTotalTicketsAsNumber = (totalTickets: any): number => {
        if (typeof totalTickets === 'number') {
            return totalTickets;
        }
        if (typeof totalTickets === 'string') {
            return parseInt(totalTickets, 10) || 0;
        }
        return 0;
    };

    // Calculate subtotal before any discounts
    const calculateSubtotal = () => {
        let subtotal = 0;
        tickets?.forEach((ticket: any) => {
            ticket.tickets.forEach((item: any) => {
                const quantity = ticketQuantities[item._id] || 0;
                const price = getPriceAsNumber(item.price);
                subtotal += quantity * price;
            });
        });
        return subtotal;
    };

    // Get selected tickets for promo validation - UPDATED to match ProcessOne format
    const getSelectedTicketsForPromoValidation = () => {
        const selected: Array<{
            ticketId: string;
            ticketType: string;
            quantity: number;
            unitPrice: number;
        }> = [];

        tickets?.forEach((ticket: any) => {
            ticket.tickets.forEach((item: any) => {
                const quantity = ticketQuantities[item._id] || 0;
                if (quantity > 0) {
                    selected.push({
                        ticketId: item.id || item._id, // Use item.id to match ProcessOne
                        ticketType: item.ticketType,
                        quantity,
                        unitPrice: getPriceAsNumber(item.price)
                    });
                }
            });
        });

        return selected;
    };

    // Apply promo code with backend validation - EXACT SAME as ProcessOne
    const applyPromoCode = async () => {
        setPromoError('');

        const selectedTickets = getSelectedTicketsForPromoValidation();
        if (!promoInput || !eventId) {
            setPromoError('Promo code and Event ID are required');
            return;
        }

        // Check if any tickets are selected
        if (selectedTickets.length === 0) {
            setPromoError('Please select tickets first');
            return;
        }

        // Check if subtotal is valid
        if (calculateSubtotal() <= 0) {
            setPromoError('Please select tickets with price > 0');
            return;
        }

        setIsValidatingPromo(true);

        try {
            // EXACT SAME API CALL as ProcessOne
            const result = await dispatch(promotionValidate(
                promoInput.toUpperCase(),
                eventId,
                selectedTickets
            ));

            if (result.success) {
                console.log('✅ Promo details:', result.promo);
                setAppliedPromo(result.promo);
            } else {
                setPromoError(result.message || 'Invalid promo code');
                setAppliedPromo(null);
            }
        } catch (error: any) {
            console.error("Error applying promo:", error);
            setPromoError('Something went wrong');
            setAppliedPromo(null);
        } finally {
            setIsValidatingPromo(false);
        }
    };

    // Remove promo code
    const removePromoCode = () => {
        setAppliedPromo(null);
        setPromoInput('');
        setPromoError('');
    };

    // Calculate discount based on applied promo - UPDATED to match ProcessOne logic
    const calculateDiscount = () => {
        if (!appliedPromo) return 0;

        // Backend-calculated discount
        if ("calculation" in appliedPromo && appliedPromo.calculation != null) {
            return Number(appliedPromo.calculation) || 0;
        }

        let discount = 0;

        // Percentage Discount
        if (
            appliedPromo.type === "percentage" ||
            appliedPromo.type === "percentageDiscount"
        ) {
            tickets?.forEach((ticketGroup: any) => {
                ticketGroup.tickets.forEach((item: any) => {
                    const qty = ticketQuantities[item._id] || 0;
                    const price = getPriceAsNumber(item.price);

                    // Check if promo applies to specific tickets
                    const isApplicable =
                        appliedPromo.ticketSelection === item.id ||
                        (Array.isArray(appliedPromo.ticketSelection) &&
                            appliedPromo.ticketSelection.includes(item.id)) ||
                        appliedPromo.ticketSelection === item._id ||
                        (Array.isArray(appliedPromo.ticketSelection) &&
                            appliedPromo.ticketSelection.includes(item._id));

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

            tickets?.forEach((ticketGroup: any) => {
                ticketGroup.tickets.forEach((item: any) => {
                    const quantity = ticketQuantities[item._id] || 0;
                    const price = getPriceAsNumber(item.price);

                    const freeItems =
                        Math.floor(quantity / appliedPromo.groupBuy) *
                        appliedPromo.groupGet;

                    totalFreeItems += freeItems * price;
                });
            });

            return totalFreeItems;
        }

        // Early Buyer Discount
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
    };

    // Calculate total after discount
    const calculateTotal = () => {
        const subtotal = calculateSubtotal();
        const discount = calculateDiscount();
        return Math.max(0, subtotal - discount);
    };

    // Get selected tickets for purchase (kept original format)
    const getSelectedTicketsForPurchase = () => {
        const selected: Array<{
            ticketName: string;
            quantity: number;
            price: number;
        }> = [];

        tickets?.forEach((ticket: any) => {
            ticket.tickets.forEach((item: any) => {
                const quantity = ticketQuantities[item._id] || 0;
                if (quantity > 0) {
                    selected.push({
                        ticketName: item.ticketType,
                        quantity,
                        price: getPriceAsNumber(item.price)
                    });
                }
            });
        });

        return selected;
    };

    const handleBuyClick = () => {
        if (calculateSubtotal() <= 0) return;
        const selectedTickets = getSelectedTicketsForPurchase();
        const queryParams = new URLSearchParams({
            eventId,
            eventName,
            selected: JSON.stringify(selectedTickets),
            total: calculateTotal().toString(),
            promo: appliedPromo ? appliedPromo.code : ""
        });

        // Check if user is logged in
        const redirectUrl = `/ticket-purchase-process?${queryParams.toString()}`;
        const isLoggedIn = localStorage.getItem("token");

        if (!isLoggedIn) {
            navigate(`/sign-in?redirect=${encodeURIComponent(redirectUrl)}`);
            return;
        }

        navigate(redirectUrl);
        setModalOpen(true);
    };

    // Format price for display
    const formatPriceForDisplay = (price: any): string => {
        const priceNumber = getPriceAsNumber(price);
        return `${priceNumber.toLocaleString()} XAF`;
    };

    // Format event time for display
    const eventTimeDisplay = `Event Time: ${formatEventDate(date)}, ${formatTimeTo12Hour(time)}`;

    return (
        <Box mt={3}>
            {/* Ticketing Section */}
            <HeadingCommon title='Ticketing System' variant="h5" baseSize="40px" mb={0} weight={600} />

            <Grid container spacing={3} mt={{ xs: 0.1, sm: 0.5, md: 1 }}>
                <Grid item xs={12} sm={10} md={6} lg={6}>
                    <Card sx={{
                        p: { xs: 2, sm: 3 }, borderRadius: 3, boxShadow: 3, position: 'relative',
                        ...(isEventPassed && {
                            opacity: 0.6,
                            pointerEvents: 'none'
                        })
                    }}>
                        {isEventPassed && (
                            <Box sx={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                right: 0,
                                bottom: 0,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                zIndex: 1,
                                backgroundColor: 'rgba(255,255,255,0.7)'
                            }}>
                                <Typography variant="h6" color="error" fontWeight="bold">
                                    This event has ended
                                </Typography>
                            </Box>
                        )}
                        {tickets?.map((ticket: any) => (
                            ticket?.tickets.map((item: any) => {
                                const totalTickets = getTotalTicketsAsNumber(item.totalTickets);
                                const availableTickets = item.isLimitedSeat ? totalTickets : null;

                                return (
                                    <Box key={item._id} mb={3}>
                                        <Typography fontWeight="bold" textTransform="capitalize" fontSize={{ xs: "18px", sm: "22px", md: "26px" }}>
                                            {`${item.ticketType} Ticket`}
                                            {item.isLimitedSeat && totalTickets === 0 && (
                                                <span style={{ color: "#3CB1F1" }}> (Sold Out)</span>
                                            )}
                                        </Typography>
                                        <Box display="flex" alignItems="center" justifyContent="space-between">
                                            <Typography fontWeight={600} textTransform="uppercase" fontSize={{ xs: "0.8rem", sm: "1rem", md: "1.2rem" }}>
                                                {formatPriceForDisplay(item.price)}
                                                {item.isLimitedSeat && totalTickets > 0 && (
                                                    <span style={{ fontSize: "0.8rem", color: "#666" }}>
                                                        {` (${totalTickets} available)`}
                                                    </span>
                                                )}
                                            </Typography>
                                            <Box display="flex" alignItems="center">
                                                <IconButton
                                                    sx={{ border: "1px solid black", borderRadius: "8px", padding: "1px" }}
                                                    onClick={() => handleDecrement(item._id)}
                                                    disabled={ticketQuantities[item._id] <= 0}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography mx={1}>{ticketQuantities[item._id] || 0}</Typography>
                                                <IconButton
                                                    sx={{ border: "1px solid black", borderRadius: "8px", padding: "1px" }}
                                                    onClick={() => handleIncrement(item._id, availableTickets)}
                                                    disabled={item.isLimitedSeat && totalTickets > 0 &&
                                                        ticketQuantities[item._id] >= totalTickets}
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                        </Box>
                                        <Divider sx={{ border: "1px solid black", mt: "15px" }} />
                                    </Box>
                                );
                            })
                        ))}

                        {/* Pricing Details */}
                        <Typography mt={2} fontSize={{ xs: "0.9rem", md: "1rem" }}>
                            <strong>Subtotal:</strong> {`${calculateSubtotal().toLocaleString()} XAF`}
                        </Typography>

                        {/* Promo Code Display - UPDATED to match ProcessOne */}
                        {appliedPromo && (
                            <Box>
                                <Typography fontSize={{ xs: "0.9rem", md: "1rem" }} sx={{ color: "green" }}>
                                    <strong>Promo Applied:</strong> {appliedPromo.code} (
                                    {appliedPromo.type === 'percentage' && `${appliedPromo.value}% off`}
                                    {appliedPromo.type === 'simple' && `${appliedPromo.value?.toLocaleString()} XAF off`}
                                    {appliedPromo.type === 'group' && `Buy ${appliedPromo.groupBuy} Get ${appliedPromo.groupGet} free`}
                                    {appliedPromo.type === 'earlyBuyer' &&
                                        `${appliedPromo.value}${appliedPromo.earlyBuyerDiscountType === 'percentage' ? '%' : ' XAF'} off (Early Buyer)`}
                                    )
                                </Typography>
                                <Typography fontSize={{ xs: "0.9rem", md: "1rem" }}>
                                    <strong>Discount:</strong> {`-${calculateDiscount().toLocaleString()} XAF`}
                                </Typography>
                                <Button
                                    size="small"
                                    onClick={removePromoCode}
                                    sx={{ color: 'red', fontSize: '0.7rem' }}
                                >
                                    Remove Promo
                                </Button>
                            </Box>
                        )}

                        {promoError && (
                            <Typography color="error" fontSize={{ xs: "0.8rem", md: "0.9rem" }}>
                                {promoError}
                            </Typography>
                        )}

                        <Typography fontSize={{ xs: "0.9rem", md: "1rem" }}>
                            <strong>Net Amount To Pay:</strong> {`${calculateTotal().toLocaleString()} XAF`}
                        </Typography>

                        {/* Promo Code - UPDATED with loading state */}
                        <Grid container spacing={2} sx={{ marginTop: "1px" }}>
                            <Grid item xs={12} sm={8} md={8}>
                                <TextField
                                    fullWidth
                                    required
                                    variant="outlined"
                                    size="small"
                                    placeholder="Enter Promo Code"
                                    value={promoInput}
                                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())} // Auto uppercase
                                    disabled={!!appliedPromo || isValidatingPromo}
                                    error={!!promoError}
                                    helperText={promoError}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4} md={4}>
                                <Button
                                    variant="contained"
                                    fullWidth
                                    sx={{
                                        paddingY: "9px",
                                        fontSize: { xs: "10px", sm: "11px", md: "12px" },
                                        backgroundColor: "#0B2E4C",
                                        color: "#fff",
                                        '&:disabled': {
                                            backgroundColor: '#ccc'
                                        }
                                    }}
                                    onClick={appliedPromo ? removePromoCode : applyPromoCode}
                                    disabled={isValidatingPromo || calculateSubtotal() <= 0}
                                >
                                    {isValidatingPromo ? 'Validating...' : appliedPromo ? 'Remove' : 'Apply'} Promo Code
                                </Button>
                            </Grid>
                        </Grid>

                        {/* Purchase Buttons */}
                        <Grid container spacing={2} mt={1}>
                            <Grid item xs={12} sm={12}>
                                <Button
                                    fullWidth
                                    variant="contained"
                                    sx={{ fontSize: { xs: "10px", sm: "11px", md: "12px" }, backgroundColor: "#0B2E4C", color: "#fff" }}
                                    disabled={calculateSubtotal() <= 0}
                                    onClick={handleBuyClick}
                                >
                                    Buy
                                </Button>
                            </Grid>
                            <PurchaseModal
                                open={modalOpen}
                                onClose={() => setModalOpen(false)}
                                eventName={eventName}
                                eventId={eventId}
                                selectedTickets={getSelectedTicketsForPurchase()}
                                totalAmount={calculateTotal()}
                            />
                        </Grid>
                        <Box sx={{ mt: 2, textAlign: 'center' }}>
                            <HeadingCommon title={eventTimeDisplay} weight={400} baseSize="12px" />
                        </Box>
                    </Card>
                </Grid>

                {/* Location Map Section (unchanged) */}
                <Grid item xs={12} sm={6} md={6} alignContent={{ md: "center" }}>
                    <Card
                        variant="outlined"
                        sx={{
                            p: 3,
                            backgroundColor: "white",
                            border: "1px solid #e0e0e0",
                            borderRadius: 3,
                            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                                borderColor: "#1976d2"
                            }
                        }}
                    >
                        {/* Header Section */}
                        <Box sx={{ mb: 2.5 }}>
                            <Typography
                                fontWeight="bold"
                                fontSize={{ xs: "20px", sm: "22px", md: "24px" }}
                                sx={{
                                    color: "#1a237e",
                                    mb: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1
                                }}
                            >
                                📍 Location
                            </Typography>
                            <Typography
                                fontSize={{ xs: "14px", sm: "15px", md: "16px" }}
                                sx={{
                                    color: "text.secondary",
                                    lineHeight: 1.6
                                }}
                            >
                                <Box component="span" sx={{ fontWeight: "600", color: "text.primary" }}>
                                    Full Address:
                                </Box> {location}
                            </Typography>
                        </Box>

                        {/* Map Container with Better Styling */}
                        <Box
                            sx={{
                                borderRadius: 2,
                                overflow: "hidden",
                                border: "2px solid #e0e0e0",
                                boxShadow: "0 2px 12px rgba(0,0,0,0.1)",
                                transition: "all 0.3s ease",
                                "&:hover": {
                                    borderColor: "#1976d2",
                                    boxShadow: "0 4px 20px rgba(25, 118, 210, 0.15)"
                                }
                            }}
                        >
                            <iframe
                                title="Location map"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2872.379073403025!2d4.804463075231841!3d43.95152271!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12b5eb86894c0b4f%3A0x2937b10bc1f0a963!2sCentre%20de%20congr%C3%A8s%20du%20Palais%20des%20Papes!5e0!3m2!1sen!2sin!4v1743656943350!5m2!1sen!2sin"
                                width="100%"
                                height="280"
                                loading="lazy"
                                style={{
                                    border: "none",
                                    display: "block"
                                }}
                            />
                        </Box>

                        {/* Optional: Additional Location Info */}
                        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "text.secondary",
                                    fontSize: "14px",
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.5
                                }}
                            >
                                🔍 Click and drag to explore the area
                            </Typography>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}