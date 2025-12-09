import { Box, Button, Grid, SelectChangeEvent, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useState } from "react";
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { AppDispatch } from "src/redux/store";
import { eventOrderCreate } from "src/redux/actions/eventOrder";

import { HeadProcess } from "./head-process";
import { PaymentOption, getPaymentOptions } from "./utils";

export function ProcessThree({ tickets, orderDetails, onBack, onNext }: any) {
    const dispatch = useDispatch<AppDispatch>();
    // Normalize paymentMethods: always array
    const rawMethods = tickets?.paymentMethods;
    const normalizedMethods = Array.isArray(rawMethods) ? rawMethods : rawMethods ? [rawMethods] : [];
 if (!normalizedMethods.includes("Orange Money")) {
        normalizedMethods.push("Orange Money");
    }
    const paymentOptions: PaymentOption[] = getPaymentOptions(normalizedMethods);

    const [selectedPayment, setSelectedPayment] = useState<PaymentOption>(
        paymentOptions[0] || { src: "", name: "", value: "" }
    );

    const handlePaymentChange = (event: SelectChangeEvent<string>) => {
        const selectedValue = event.target.value;
        const selectedOption = paymentOptions.find((option) => option.value === selectedValue);

        if (selectedOption) {
            setSelectedPayment(selectedOption);
        }
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        const isFreeEvent = Number(tickets?.totalAmount) === 0;
        const orderFormEntry = new FormData();
        orderFormEntry.append("eventId", tickets.eventId);
        orderFormEntry.append("orderAddress", JSON.stringify(orderDetails.orderAddress));
        orderFormEntry.append("participantDetails", JSON.stringify(orderDetails.participants));
        orderFormEntry.append("tickets", JSON.stringify(tickets));
        orderFormEntry.append("deviceUsed", getDeviceType());
        orderFormEntry.append("totalAmount", tickets?.totalAmount);
        orderFormEntry.append(
            "paymentMethod",
            isFreeEvent ? "freeEvent" : selectedPayment?.value
        );

        try {
            const result = await dispatch(eventOrderCreate(orderFormEntry));

            // ✅ Handle success
            if (result?.status === 201) {
                toast.success(result.message || "Order created successfully");

                const paymentUrl = result?.paymentUrl; // Get this if you're returning it

                if (
                    paymentUrl &&
                    ["mtn", "orange_money", "mobile_money"].includes(selectedPayment?.value.toLowerCase())
                ) {
                    // ✅ Redirect only for online payments
                    window.location.href = paymentUrl;
                } else {
                    // ✅ For cash / COD / credit card → move to next step
                    onNext();
                }

            } else {
                toast.error(result?.message || "Something went wrong");
            }

        } catch (error) {
            toast.error("Event creation failed");
        }
    };

    return (
        <Box mt={3}>
            <Paper sx={{ width: "100%", p: 4, boxShadow: 3, borderRadius: 3, position: "relative" }}>
                <HeadProcess title="Secure Payment" step="3" />
                <HeadingCommon weight={600} baseSize="20px" title='Select Payment Method' variant="h6" />
                <form onSubmit={handleSubmit}>
                    <Select
                        fullWidth
                        name="paymentMethod"
                        value={selectedPayment.value}
                        onChange={handlePaymentChange}
                        sx={{
                            borderRadius: "12px",
                            backgroundColor: "#fff",
                            boxShadow: 1,
                            mb: 2,
                        }}
                    >
                        {paymentOptions.map((option, index) => (
                            <MenuItem key={index} value={option.value}>
                                <Box display="flex" alignItems="center">
                                    <img
                                        src={option.src}
                                        alt={option.name}
                                        style={{ width: 30, height: 30, marginRight: 10 }}
                                    />
                                    {option.name}
                                </Box>
                            </MenuItem>
                        ))}
                    </Select>

                    {/* Payment Details Box */}
                    <Box p={3} borderRadius={3} bgcolor="#F8F9FA" display="flex" alignItems="center" justifyContent="space-between">
                        <Box display="flex" alignItems="center">
                            <img
                                src={selectedPayment.src}
                                alt={selectedPayment.name}
                                style={{ width: 50, height: 50, marginRight: 2 }}
                            />
                            <Typography fontWeight="bold">
                                {selectedPayment.name === "MTN Mobile Money"
                                    ? "Payment Number: 987621"
                                    : selectedPayment.name === "Orange Money"
                                        ? "Payment Number: 654321"
                                        : "Payment Details"}
                            </Typography>
                        </Box>
                        <HeadingCommon title={`Total: ${tickets?.totalAmount || 0.00} XAF`} baseSize="15px" />
                    </Box>

                    <Grid container spacing={2} mt={3}>
                        <Grid item xs={12}>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ bgcolor: "#0B3558" }}
                            >
                                Confirm & Pay
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>
        </Box>
    )
}

function getDeviceType(): string {
    const ua = navigator.userAgent;

    if (/Mobi|Android/i.test(ua)) return "Smartphones";
    if (/Tablet|iPad/i.test(ua)) return "Tablets";
    if (/Macintosh|Windows|Linux/i.test(ua)) {
        if (window.innerWidth < 1024) return "Laptops";
        return "Desktops";
    }

    return "Unknown";
}