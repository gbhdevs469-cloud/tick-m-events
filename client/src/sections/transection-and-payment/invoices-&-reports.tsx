import { useEffect, useState } from "react";
import { Box, Paper, Tab, Tabs } from "@mui/material";
import { TransactionAndPaymentTable } from "src/components/tables/transaction-&-payment-table";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import axios from "src/redux/helper/axios";
import { toast } from "react-toastify";
import { InvoiceTableHeaders, EventData } from "./utils";

type InvoiceHistoryProps = {
    selectedEvent: EventData | null;
};

type TransactionData = {
    _id: string;
    transId: string;
    eventId: string;
    amount: number;
    payment: {
        paymentMethod: string;
        method: string;
    };
    status: string;
    createdAt: string;
};

export function InvoiceHistory({ selectedEvent }: InvoiceHistoryProps) {
    const [withdrawals, setWithdrawals] = useState<TransactionData[]>([]);
    const [refunds, setRefunds] = useState<TransactionData[]>([]);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!selectedEvent) return;

            try {
                // 1️⃣ Fetch Withdrawals
                const withdrawalResp = await axios.get("transaction-payment/get-refund-and-withdrawals", {
                    params: { eventId: selectedEvent._id },
                });

                if (withdrawalResp.data.success) {
                    setWithdrawals(withdrawalResp.data.data);
                }

                // 2️⃣ Fetch Refunds
                const refundResp = await axios.get("transaction-payment/get-refund-refunded-data", {
                    params: { eventId: selectedEvent._id },
                });

                if (refundResp.data.success) {
                    setRefunds(refundResp.data.data);
                }
            } catch (error) {
                toast.error("Failed to load transactions.");
            }
        };

        fetchData();
    }, [selectedEvent]);

    const handleDownloadInvoice = async (transId: string, status: string, type: "withdrawal" | "refund") => {
        if (status.toLowerCase() !== "approved" && type === "withdrawal") {
            toast.warning("Invoice can only be downloaded for approved withdrawals");
            return;
        }
        if (type === "refund" && status.toLowerCase() !== "refunded") {
            toast.warning("Invoice can only be downloaded for refunded transactions");
            return;
        }

        try {
            // Decide URL based on type
            const url =
                type === "withdrawal"
                    ? `/transaction-payment/withdrawals/invoice/${transId}`
                    : `/transaction-payment/refunds/invoice/${transId}`;

            const response = await axios.get(url, {
                responseType: "blob",
            });

            const blob = new Blob([response.data], { type: "application/pdf" });
            const urlBlob = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = urlBlob;
            link.download = `${type === "withdrawal" ? "Withdrawal" : "Refund"}-Invoice-${transId}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();
              toast.success("Invoice downloaded successfully!");
        } catch (error) {
           toast.error("Failed to download invoice. Please try again.");
        }
    };


    const mapToInvoiceData = (data: TransactionData[], type: "withdrawal" | "refund") =>
        data.map((t) => ({
            invoiceId: t.transId,
            date: new Date(t.createdAt).toLocaleDateString(),
            amount: `${t.amount.toLocaleString()} XAF`,
            method: t.payment.paymentMethod.toUpperCase(),
            status: t.status.charAt(0).toUpperCase() + t.status.slice(1).toLowerCase(),
            action: [
                {
                    label: "Download PDF",
                    onClick: () => handleDownloadInvoice(t.transId, t.status, type),
                },
            ],
        }));


    return (
        <Box mt={3} boxShadow={3} bgcolor="white" borderRadius={3} sx={{ p: { xs: 2, sm: 2.5, md: 3 } }}>
            <HeadingCommon title="Invoices" variant="h5" weight={600} />

            {/* Tabs */}
            <Tabs value={tabIndex} onChange={(_, newIndex) => setTabIndex(newIndex)} sx={{ mb: 2 }}>
                <Tab label={`Withdrawals (${withdrawals.length})`} />
                <Tab label={`Refunds (${refunds.length})`} />
            </Tabs>

            <Paper sx={{ borderRadius: 3, p: 2 }}>
                {tabIndex === 0 && (
                    <TransactionAndPaymentTable
                        headers={InvoiceTableHeaders}
                        data={mapToInvoiceData(withdrawals, "withdrawal")}
                        type="3"
                        onDownloadInvoice={handleDownloadInvoice}
                    />
                )}
                {tabIndex === 1 && (
                    <TransactionAndPaymentTable
                        headers={InvoiceTableHeaders}
                        data={mapToInvoiceData(refunds, "refund")}
                        type="3"
                        onDownloadInvoice={handleDownloadInvoice}
                    />
                )}

            </Paper>
        </Box>
    );
}
