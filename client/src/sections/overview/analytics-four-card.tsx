import { Grid, Paper, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import dayjs from "dayjs";

import { Chart } from "src/components/chart";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { formatRevenue } from "src/hooks/format-revenu";

import { AnalyticsCard } from "./analytics-card";

type Order = {
    totalAmount?: number;
    paymentStatus?: "pending" | "confirmed" | "denied";
    createdAt?: string;
    tickets: { quantity: number }[];
    ticketCode?: string;
    verifyEntry?: boolean;
};

export function AnalyticsFourCards({
    up,
    chartOptions,
    donutChartOptions,
    selectedEvent,
}: any) {
    const theme = useTheme();
    const totalTickets = parseInt(selectedEvent?.ticketQuantity ?? "0", 10);
    const soldTickets = selectedEvent?.statistics?.tickets?.soldTickets || 0;
    const scannedTickets = selectedEvent?.statistics?.tickets?.verifiedEntries || 0;
    const percentage = soldTickets > 0 ? Math.round((scannedTickets / soldTickets) * 100) : 0;
    const remainingTickets = totalTickets - soldTickets;
    const eventStartDate = selectedEvent?.createdAt
        ? dayjs(selectedEvent.createdAt)
        : dayjs();
    const eventEndDate = selectedEvent?.date ? dayjs(selectedEvent.date) : dayjs();

    // --- Confirmed orders in range ---
    const confirmedOrders = (selectedEvent?.order || []).filter((order: Order) => {
        const date = dayjs(order?.createdAt);
        return (
            order.paymentStatus === "confirmed" &&
            (date.isAfter(eventStartDate.subtract(1, "day")) &&
                date.isBefore(eventEndDate.add(1, "day")))
        );
    });

    // --- Existing total tickets sold & revenue data (unchanged) ---
    const ticketSalesByDay: { [day: string]: number } = {};
    const revenueByDay: { [day: string]: number } = {};

    confirmedOrders.forEach((order: any) => {
        const day = dayjs(order.createdAt).format("ddd");
        const quantity = order.tickets.reduce(
            (sum: number, t: any) => sum + t.quantity,
            0
        );
        const amount = order.totalAmount ?? 0;

        ticketSalesByDay[day] = (ticketSalesByDay[day] || 0) + quantity;
        revenueByDay[day] = (revenueByDay[day] || 0) + amount;
    });

    const dayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const ticketChartData = dayOrder.map((day) => ticketSalesByDay[day] || 0);
    const revenueChartData = dayOrder.map((day) => revenueByDay[day] || 0);

    // Mapping JS day index (0=Sun,1=Mon,...6=Sat) to weekday name
    const jsDayToWeekdayName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const weekdayOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    // Sum tickets sold by weekday name within event date range
    const ticketsSoldByWeekday: { [day: string]: number } = {
        Mon: 0,
        Tue: 0,
        Wed: 0,
        Thu: 0,
        Fri: 0,
        Sat: 0,
        Sun: 0,
    };

    confirmedOrders.forEach((order: Order) => {
        const orderDate = dayjs(order.createdAt);
        if (orderDate.isBefore(eventStartDate) || orderDate.isAfter(eventEndDate)) return;

        const weekdayName = jsDayToWeekdayName[orderDate.day()];
        const quantity = order.tickets.reduce((sum, t) => sum + t.quantity, 0);
        ticketsSoldByWeekday[weekdayName] = (ticketsSoldByWeekday[weekdayName] || 0) + quantity;
    });

    // Calculate remaining tickets cumulatively in Mon-Sun order
    let cumulativeSold = 0;
    const remainingTicketsByDay = weekdayOrder.map((day) => {
        cumulativeSold += ticketsSoldByWeekday[day] || 0;
        return totalTickets - cumulativeSold;
    });

    // 1. Build the list of dates from createdAt to event date (inclusive)
    const dateRange: string[] = [];
    let cursor = eventStartDate.clone();
    while (cursor.isBefore(eventEndDate) || cursor.isSame(eventEndDate, "day")) {
        dateRange.push(cursor.format("YYYY-MM-DD"));
        cursor = cursor.add(1, "day");
    }

    // 2. Group confirmed tickets sold by date (YYYY-MM-DD)
    const ticketsSoldByDate: { [date: string]: number } = {};
    confirmedOrders.forEach((order: Order) => {
        const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");
        const quantity = order.tickets.reduce((sum, t) => sum + t.quantity, 0);
        ticketsSoldByDate[orderDate] = (ticketsSoldByDate[orderDate] || 0) + quantity;
    });

    // === Total revenue for display ===
    const revenue = confirmedOrders.reduce(
        (total: number, order: Order) => total + (order.totalAmount ?? 0),
        0
    );

    return (
        <Grid container spacing={2} alignItems="stretch">
            {/* Card 1 - Total Tickets Sold */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
                <AnalyticsCard
                    title="Total Tickets Sold"
                    value={soldTickets.toString()}
                    iconSrc={
                        up
                            ? "./assets/icons/dashboard/ic_arrow_down.svg"
                            : "./assets/icons/dashboard/ic_arrow_up.svg"
                    }
                    chartOptions={{
                        ...chartOptions,
                        xaxis: {
                            categories: dayOrder,
                        },
                        colors: [theme.palette.primary.main],
                    }}
                    chartSeries={[{ name: "Tickets", data: ticketChartData }]}
                    chartType="line"
                    chartHeight={110}
                />
            </Grid>

            {/* Card 2 - Revenue Generated */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
                <AnalyticsCard
                    title="Revenue Generated"
                    value={selectedEvent?.payStatus === "free" ? "Free Tickets" : formatRevenue(revenue) || '0 XAF'}
                    iconSrc={
                        up
                            ? "./assets/icons/dashboard/ic_arrow_down.svg"
                            : "./assets/icons/dashboard/ic_arrow_up.svg"
                    }
                    chartOptions={{
                        ...chartOptions,
                        xaxis: {
                            categories: dayOrder,
                        },
                        colors: ["#0B2E4E"],
                    }}
                    chartSeries={[{ name: "Revenue", data: revenueChartData }]}
                    chartType="line"
                    chartHeight={110}
                />
            </Grid>

            {/* Card 3 - Remaining Tickets */}
            <Grid item xs={12} sm={6} md={3} sx={{ display: "flex" }}>
                <AnalyticsCard
                    title="Remaining Tickets"
                    value={remainingTickets.toString()}
                    iconSrc={
                        up
                            ? "./assets/icons/dashboard/ic_arrow_down.svg"
                            : "./assets/icons/dashboard/ic_arrow_up.svg"
                    }
                    chartOptions={{
                        ...chartOptions,
                        chart: {
                            type: "bar",
                            toolbar: { show: false },
                            sparkline: { enabled: true },
                        },
                        colors: [theme.palette.error.main],
                        plotOptions: { bar: { columnWidth: "40%", borderRadius: 4 } },
                        xaxis: {
                            categories: weekdayOrder, // <-- Use full dates here!
                            labels: {
                                rotate: -45,
                                hideOverlappingLabels: true,
                                style: {
                                    fontSize: "10px",
                                },
                            },
                        },
                    }}
                    chartSeries={[{ name: "Remaining", data: remainingTicketsByDay }]}
                    chartType="bar"
                    chartHeight={100}
                />
            </Grid>

            {/* Card 4 - Tickets Confirmed */}
            <Grid item xs={12} sm={6} md={3}>
                <Paper
                    elevation={3}
                    sx={{
                        p: 2,
                        borderRadius: "12px",
                        display: "flex",
                        alignItems: "center",
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <HeadingCommon
                            title={`${percentage}% of sold tickets were scanned at entrance`}
                            weight={600}
                            baseSize="12px"
                        />
                        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                            <Box
                                component="img"
                                src="./assets/icons/dashboard/ic_arrow_right.svg"
                                width={20}
                                height={20}
                                sx={{ fill: theme.palette.success.main }}
                            />
                            <HeadingCommon
                                title={`Total scanned tickets: ${scannedTickets}`}
                                weight={300}
                                baseSize="10px"
                            />
                            <Box>
                                <Chart
                                    options={donutChartOptions}
                                    series={[percentage, 100 - percentage]}
                                    type="donut"
                                    height={100}
                                />

                                <Typography
                                    sx={{
                                        fontSize: "11px",
                                        fontWeight: 700,
                                        color: "black",
                                        textAlign: "center",
                                        mt: -7,
                                    }}
                                >
                                    {percentage}%
                                </Typography>
                                
                                <Typography
                                    sx={{
                                        fontSize: "10px",
                                        fontWeight: "bold",
                                        color: "black",
                                        textAlign: "center",
                                        mt: 4,
                                    }}
                                >
                                    Attendee Engagement
                                </Typography>
                            </Box>
                        </Box>
                        <HeadingCommon
                            title={`Tickets sold: ${soldTickets} vs. Tickets scanned: ${scannedTickets}`}
                            weight={600}
                            baseSize="12px"
                        />
                    </Box>
                </Paper>
            </Grid>
        </Grid>
    );
}