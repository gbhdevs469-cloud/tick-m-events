import { Box, Grid, Typography, Card, CardContent, CircularProgress } from "@mui/material";
import { ApexOptions } from "apexcharts";
import { useEffect } from "react";
import Chart from "react-apexcharts";
import { useDispatch, useSelector } from "react-redux";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { formatRevenue } from "src/hooks/format-revenu";
import { fatchDashBoardStatisitcs } from "src/redux/actions/organizer/statistics-report";
import { AppDispatch, RootState } from "src/redux/store";

export function CommonBarHead({ totalCount, leftHead, head }: any) {
    return (
        <Box display="flex" justifyContent="space-between" mb={1} alignItems="center">
            <Typography variant="h6" sx={{ flex: 1, textAlign: "left" }} fontSize= "13px">
                {totalCount !== undefined && totalCount !== null ? totalCount : leftHead}
            </Typography>
            <Typography sx={{ flex: 1, textAlign: "left", fontSize: "13px", color: "#2395D4", fontWeight: 500 }}>
                {head}
            </Typography>
        </Box >
    )
}

export function MainDashboardStatistics({ selectedEvent }: any) {
    const dispatch = useDispatch<AppDispatch>();
    const { overview, graph } = useSelector((state: RootState) => state?.organizer);
    useEffect(() => {
        dispatch(fatchDashBoardStatisitcs(selectedEvent?._id));
    }, [dispatch, selectedEvent?._id]);
    // Transform graph data for ApexCharts
    const transformGraphData = (data: any[], valueKey: string) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => item[valueKey] || 0);
    };

    const transformRemainingTicketsData = (data: any[]) => {
        if (!Array.isArray(data)) return [{ data: [] }, { data: [] }];
        return [
            {
                name: "Tickets Sold",
                data: data.map(item => item.ticketsSold || 0)
            },
            {
                name: "Remaining Tickets",
                data: data.map(item => item.remainingTickets || 0)
            }
        ];
    };

    const transformSalesEvolutionData = (data: any[]) => {
        if (!Array.isArray(data)) return [];
        return data.map(item => item.tickets || 0);
    };

    // Get date labels for x-axis if needed
    const isRefundApproved = (orderId: string): boolean =>
        Array.isArray(selectedEvent?.refundRequests) &&
        selectedEvent.refundRequests.some(
            (refund: any) =>
                refund.orderId?._id === orderId && refund.refundStatus === "approved"
        );

    // PEAK SALES LOGIC
    interface HourlySales {
        [key: string]: number;
    }

    let peakHour = "";
    let peakTicketsSold = 0;
    const hourlySales: HourlySales = {};

    if (Array.isArray(selectedEvent?.order)) {
        selectedEvent.order.forEach((order: any) => {
            if (!order.createdAt || isRefundApproved(order._id) || order.paymentStatus !== "confirmed") return;

            const date = new Date(order.createdAt);
            const hourKey = `${date.toISOString().slice(0, 13)}:00`;

            const ticketCount = Array.isArray(order.tickets)
                ? order.tickets.reduce((sum: number, ticket: any) => sum + (ticket.quantity || 0), 0)
                : 0;

            hourlySales[hourKey] = (hourlySales[hourKey] || 0) + ticketCount;

            if (hourlySales[hourKey] > peakTicketsSold) {
                peakTicketsSold = hourlySales[hourKey];
                peakHour = hourKey;
            }
        });
    }

    let formattedPeakSales = "No sales data available";

    if (peakHour) {
        const peakDate = new Date(peakHour);
        const dateStr = peakDate.toLocaleDateString("en-GB");
        const hourStr = peakDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            hour12: true,
        });

        formattedPeakSales = `${dateStr} at ${hourStr} – ${peakTicketsSold} tickets sold in 1 hour`;
    }

    // Total tickets available
    const totalTicketsAvailable = selectedEvent && selectedEvent.ticketQuantity
        ? Number(selectedEvent.ticketQuantity)
        : 0;

    const validatedTicketsCount = Array.isArray(selectedEvent?.order)
        ? selectedEvent.order
            .filter((order: any) => order.verifyEntry === true)
            .reduce((sum: number, order: any) =>
                sum + order.tickets.reduce((ticketSum: number, ticket: any) =>
                    ticketSum + (ticket.quantity || 0), 0)
                , 0)
        : 0;
    const validatedPercentage = totalTicketsAvailable > 0
        ? Math.round((validatedTicketsCount / totalTicketsAvailable) * 100)
        : 0;

    // Chart configurations
    const lineChartOptions: ApexOptions = {
        chart: {
            type: "line",
            height: 50,
            sparkline: { enabled: true },
            zoom: { enabled: false }
        },
        stroke: { width: 3, curve: "smooth" },
        colors: ["#2395D4"],
        tooltip: { enabled: true },
        grid: { show: false },
        xaxis: {
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: false }
    };

    const RevenueGenerateChartOptions: ApexOptions = {
        ...lineChartOptions,
        colors: ["#0B2E4E"],
    };

    const SalesEvaluationChartOptions: ApexOptions = {
        ...lineChartOptions,
        colors: ["#2395D4"],
    };

    const TicketsPendingChartOptions: ApexOptions = {
        ...lineChartOptions,
        colors: ["#FF5733"],
    };

    const barChartOptions: ApexOptions = {
        chart: {
            type: "bar",
            height: 50,
            sparkline: { enabled: true },
            zoom: { enabled: false }
        },
        plotOptions: {
            bar: {
                columnWidth: "60%",
                borderRadius: 2
            }
        },
        colors: ["#2395D4", "#FF5733"],
        tooltip: { enabled: true },
        grid: { show: false },
        xaxis: {
            labels: { show: false },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: { show: false }
    };

    // Transform all graph data
    const totalTicketsSoldData = transformGraphData(graph?.totalTicketsSold, 'ticketsSold');
    const revenueGeneratedData = transformGraphData(graph?.revenueGenerated, 'revenue');
    const ticketsPendingData = transformGraphData(graph?.ticketsPendingPayment, 'pendingTickets');
    const remainingTicketsData = transformRemainingTicketsData(graph?.remainingTicketsSales);
    const salesEvolutionData = transformSalesEvolutionData(graph?.salesEvolution);

    return (
        <Box mt={3}>
            <HeadingCommon title="Main Dashboard Statistics" mb={0} />

            <Grid container spacing={2} mt={1}>
                {[
                    {
                        totalCount: overview?.totalTicketsSold,
                        head: "Total Tickets Sold",
                        chartOptions: lineChartOptions,
                        chartSeries: [{ name:"Sold",data: totalTicketsSoldData }],
                    },
                    {
                     
                        totalCount: selectedEvent?.payStatus === "free" ? "Free Tickets" : formatRevenue(overview?.totalRevenue) || '0 XAF',
                        head: "Revenue Generated",
                        chartOptions: RevenueGenerateChartOptions,
                        chartSeries: [{ name:"Revenu",data: revenueGeneratedData }],
                    },
                    {
                        totalCount: overview?.remainingTickets || 0,
                        head: "Remaining Tickets & Sales Trends",
                        chartOptions: barChartOptions,
                        chartSeries: remainingTicketsData,
                        type: "bar",
                    },
                    {
                        custom: true,
                        content: (
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography variant="h4" fontWeight="bold">
                                        {overview?.ticketsValidated || 0}
                                    </Typography>
                                    <Typography color="primary" sx={{ fontSize: "13px", fontWeight: 500 }}>
                                        Tickets <br /> Validated at Entrance
                                    </Typography>
                                </Box>
                                <Box position="relative" display="flex" alignItems="center">
                                    <CircularProgress
                                        variant="determinate"
                                        value={validatedPercentage}
                                        size={55}
                                        thickness={5}
                                        sx={{ color: "#2395D4" }}
                                    />
                                    <Typography
                                        variant="caption"
                                        sx={{
                                            position: "absolute",
                                            left: "50%",
                                            top: "50%",
                                            transform: "translate(-50%, -50%)",
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {validatedPercentage}%
                                    </Typography>
                                </Box>
                            </Box>
                        ),
                    },
                    {
                        custom: true,
                        content: (
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Box>
                                    <Typography color="primary" sx={{ fontSize: "16px", fontWeight: "bold" }}>
                                        Conversion <br /> Rate
                                    </Typography>
                                </Box>
                                <Box position="relative" display="flex" alignItems="center">
                                    <CircularProgress variant="determinate" value={overview?.conversionRate || 0} size={55} thickness={5} sx={{ color: "#2395D4" }} />
                                    <Typography
                                        variant="caption"
                                        sx={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)", fontWeight: "bold" }}
                                    >
                                        {overview?.conversionRate || 0}%
                                    </Typography>
                                </Box>
                            </Box>
                        ),
                    },
                    {
                        totalCount: overview?.pendingPaymentOrders || 0,
                        head: "Tickets Pending Payment",
                        chartOptions: TicketsPendingChartOptions,
                        chartSeries: [{ name:"Pending Ticketes",data: ticketsPendingData }],
                    },
                    {
                        custom: true,
                        content: (
                            <>
                                <Typography variant="h6" fontWeight="bold">
                                    Peak Sales
                                </Typography>
                                <Typography variant="body2" color="#2395D4" fontSize={13}>
                                    {formattedPeakSales}
                                </Typography>
                            </>
                        ),
                    },
                    {
                        totalCount: "Sales Evolution",
                        head: "This Week",
                        chartOptions: SalesEvaluationChartOptions,
                        chartSeries: [{ name:"Weekly Sales",data: salesEvolutionData }],
                    },
                ].map((item, index) => (
                    <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                        <Card sx={{ boxShadow: 3, borderRadius: 3, height: "100%", minHeight: '140px' }}>
                            <CardContent sx={{ height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", p: 2 }}>
                                {item.custom ? (
                                    item.content
                                ) : (
                                    <>
                                        <CommonBarHead totalCount={item.totalCount} head={item.head} />
                                        <Box sx={{ mt: 1 }}>
                                            <Chart
                                                options={item.chartOptions}
                                                series={item.chartSeries}
                                                type={(item.type || "line") as "line" | "bar"}
                                                height={50}
                                            />
                                        </Box>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}