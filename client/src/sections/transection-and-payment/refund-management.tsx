import { useEffect, useState, useMemo } from "react";
import { Box, Radio, FormControlLabel, RadioGroup, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import { TransactionAndPaymentTable } from "src/components/tables/transaction-&-payment-table";

import {  RefundTableHeaders } from "./utils";

type RefundManagementHistoryProps = {
    selectedEvent: any;
};

interface RefundRequest {
    refundAmount: number;
    refundStatus: string;
    createdAt: string;
    tickets?: { ticketType: string }[];
}
interface Order {
    transactionId: string;
    userId?: { name: string };
    refundRequests?: RefundRequest[];
}

const formatDateWithDay = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: '2-digit'
    };
    return date.toLocaleDateString(undefined, options); // e.g., "Sun, Sep 01, 2025"
};

export function RefundManagementHistory({ selectedEvent }: RefundManagementHistoryProps) {
    const navigate = useNavigate();
    const [selectedPolicy, setSelectedPolicy] = useState("");
    const [daysBeforeEvent, setDaysBeforeEvent] = useState("");
    const [partialRefundPercent, setPartialRefundPercent] = useState("");
    const [cutoffDate, setCutoffDate] = useState("");
    const refundPolicy = useMemo(
        () => selectedEvent?.ticketConfiguration?.refundPolicy || {},
        [selectedEvent?.ticketConfiguration?.refundPolicy]
    );


    const noRefundPolicyAvailable = !refundPolicy.fullRefund &&
        !refundPolicy.partialRefund &&
        !refundPolicy.noRefundAfterPurchase &&
        !refundPolicy.noRefundAfterDate;

    useEffect(() => {
        if (refundPolicy.noRefundDate) {
            setCutoffDate(refundPolicy.noRefundDate.slice(0, 10));
        }
    }, [refundPolicy.noRefundDate]);

    const refundTableData = selectedEvent?.orders?.flatMap((order: Order) =>
        (order.refundRequests || []).map((refund: RefundRequest) => ({
            transaction: order.transactionId,
            participant: order.userId?.name || "N/A",
            ticketType: refund.tickets?.[0]?.ticketType || "N/A",
            purchaseDate: new Date(refund.createdAt).toLocaleDateString(),
            amount: `${refund.refundAmount} XAF`,
            status:
                refund.refundStatus === "approved"
                    ? "Approved"
                    : refund.refundStatus === "rejected"
                        ? "Rejected"
                        : "Pending",

        }))
    );

    useEffect(() => {
        if (refundPolicy.fullRefund) {
            setSelectedPolicy("full_refund");
            setDaysBeforeEvent(refundPolicy.fullRefundDaysBefore?.toString() || "");
        } else if (refundPolicy.partialRefund) {
            setSelectedPolicy("partial_refund");
            // If your policy has the partial percent, you can prefill it here
            setPartialRefundPercent(refundPolicy.partialRefundPercent?.toString() || "");
        } else if (refundPolicy.noRefundAfterPurchase) {
            setSelectedPolicy("no_refund_purchase");
        } else if (refundPolicy.noRefundAfterDate) {
            setSelectedPolicy("no_refund_date");
            setCutoffDate(refundPolicy.noRefundDate?.slice(0, 10) || "");
        }
    }, [refundPolicy]);

    const isFreeTicket = selectedEvent?.ticketConfiguration?.tickets?.every(
        (ticket: any) => ticket?.payStatus?.toLowerCase() === "free"
    );

    return (

        <>
            <Typography
                variant="h5"
                fontSize={{ xs: 20, sm: 25, md: 33 }}
                fontWeight={600}
                sx={{ mt: 3 }}
            >
                Refund Management
            </Typography>

            {isFreeTicket ? (
                <Box mt={2} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
                    <Typography color="error" fontWeight="bold" fontSize="16px" textAlign="center">
                        This is a free ticket, so refund is not allowed.
                    </Typography>
                </Box>
            ) : (
                <Box mt={2} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
                    <TransactionAndPaymentTable
                        headers={RefundTableHeaders}
                        data={refundTableData}
                        type="2"
                    />

                     <Box mt={3}>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Configurable Refund Policies
                                </Typography>

                                {noRefundPolicyAvailable ? (
                                    <Typography color="error" fontWeight="bold" sx={{ mt: 2 }}>
                                        No refund policy is configured for this event.
                                    </Typography>
                                ) : (
                                    <RadioGroup
                                        value={selectedPolicy}
                                        onChange={(e) => setSelectedPolicy(e.target.value)}
                                        sx={{ mt: 2 }}
                                    >
                                        {refundPolicy.fullRefund && (
                                            <FormControlLabel
                                                value="full_refund"
                                                control={<Radio />}
                                                label={`Full refund up to ${refundPolicy.fullRefundDaysBefore || "X"} days before the event`}
                                            />
                                        )}

                                        {refundPolicy.partialRefund && (
                                            <FormControlLabel
                                                value="partial_refund"
                                                control={<Radio />}
                                                label={`Partial Refund with Fee (${refundPolicy.partialRefundPercent || "X"}% of ticket price retained)`}
                                            />
                                        )}

                                        {refundPolicy.noRefundAfterPurchase && (
                                            <FormControlLabel
                                                value="no_refund_purchase"
                                                control={<Radio />}
                                                label="No refund after ticket purchase"
                                            />
                                        )}

                                        {refundPolicy.noRefundAfterDate && (
                                            <FormControlLabel
                                                value="no_refund_date"
                                                control={<Radio />}
                                                label={`No refund after ${formatDateWithDay(refundPolicy.noRefundDate)}`}
                                            />
                                        )}
                                    </RadioGroup>
                                )}

                                {/* <Box sx={{ mt: 3, textAlign: "center" }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, backgroundColor: "#0B2E4C", color: "white", py: 1.5 }}
                                  
                                    >
                                        Process Refund
                                    </Button>

                                </Box> */}
                            </Box>

                </Box>
            )}
        </>
    );
}
