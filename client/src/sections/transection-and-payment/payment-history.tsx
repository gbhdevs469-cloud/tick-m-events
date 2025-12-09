import { Box, Paper } from "@mui/material";
import { useState, useMemo } from "react";
import { SelectBar } from "src/components/tables/select-bar";
import { TransactionAndPaymentTable } from "src/components/tables/transaction-&-payment-table";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { mapOrdersToAllTableData, tableHeaders } from "./utils";

type PaymentHistroyProps = {
    selectedEvent: any;
};

export function PaymentHistory({ selectedEvent }: PaymentHistroyProps) {
    const [selectedTicket, setSelectedTicket] = useState("all");
    const [selectedTicketDate, setSelectedTicketDate] = useState("all");

    const allTableDataDynamic = useMemo(
        () => mapOrdersToAllTableData(selectedEvent?.orders || []),
        [selectedEvent]
    );

    // Dynamically generate "Reference" options
    const ticketOptionsDynamic = useMemo(() => {
        const uniqueRefs = Array.from(new Set(allTableDataDynamic.map((row) => row.reference)));
        return [{ label: "All", value: "all" }, ...uniqueRefs.map((ref) => ({ label: ref, value: ref }))];
    }, [allTableDataDynamic]);

    // Dynamically generate "Date" options
    const ticketDateDynamic = useMemo(() => {
        const uniqueDates = Array.from(new Set(allTableDataDynamic.map((row) => row.date)));
        return [{ label: "All", value: "all" }, ...uniqueDates.map((date) => ({ label: date, value: date }))];
    }, [allTableDataDynamic]);

    // Filter data
    const filteredData = allTableDataDynamic.filter((row) => {
        const matchesTicket = selectedTicket === "all" || row.reference === selectedTicket;
        const matchesDate = selectedTicketDate === "all" || row.date === selectedTicketDate;
        return matchesTicket && matchesDate;
    });

    return (
        <>
            <HeadingCommon mt={3} variant="h5" title="Payment History" weight={600} baseSize="33px" />
            <Paper sx={{ p: { xs: 2, sm: 2.5, md: 3 }, borderRadius: 3, boxShadow: 3 }}>
                {/* Filters */}
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "column", md: "row" },
                        alignItems: { xs: "stretch", sm: "stretch", md: "center" },
                        gap: 2,
                        flexWrap: "wrap",
                        mb: 2
                    }}
                >
                    <SelectBar
                        title="Reference"
                        options={ticketOptionsDynamic}
                        value={selectedTicket}
                        onChange={(event) => setSelectedTicket(event.target.value)}
                    />
                    <SelectBar
                        title="Date"
                        options={ticketDateDynamic}
                        value={selectedTicketDate}
                        onChange={(event) => setSelectedTicketDate(event.target.value)}
                    />
                </Box>

                {/* Table */}
                <TransactionAndPaymentTable
                    headers={tableHeaders}
                    data={selectedTicket === "all" && selectedTicketDate === "all" ? allTableDataDynamic : filteredData}
                    type="1"
                />
            </Paper>
        </>
    );
}
