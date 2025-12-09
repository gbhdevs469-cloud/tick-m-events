
import { Card, Grid, Typography, Box, MenuItem, Select, Stack } from "@mui/material";
import { useEffect, useState } from "react";
import dayjs from 'dayjs';
import { ApexOptions } from 'apexcharts';

import { Chart } from "src/components/chart";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

export function BestSelling({ chartOptions, selectedEvent }: any) {
    const [selectedTicket, setSelectedTicket] = useState<any>({});
    const totalTickets = Number(selectedEvent?.ticketQuantity) || 0;
    const soldTickets = selectedEvent?.statistics?.tickets?.soldTickets || 0;
    // const soldTickets = Number(selectedEvent?.soldTicket) || 0;
    const ticketsLeft = totalTickets - soldTickets;
    const percentSold = totalTickets > 0 ? (soldTickets / totalTickets) * 100 : 0;
    const ticketData = getLast7DaysTicketData(selectedEvent);
    const lastValue = ticketData[ticketData.length - 1] || 0;
    const prevValue = ticketData[ticketData.length - 2] || 0;
    const dynamicGrowth = prevValue === 0
        ? 0
        : Math.round(((lastValue - prevValue) / prevValue) * 100);

    const ticketTypes = selectedEvent?.ticketType || [];

    useEffect(() => {
        const firstTicket = selectedEvent?.ticketType?.[0];
        const currentTicketId = selectedTicket?._id;
        const allTicketIds = selectedEvent?.ticketType?.map((t: any) => t._id) || [];

        if (firstTicket && (!currentTicketId || !allTicketIds.includes(currentTicketId))) {
            setSelectedTicket(firstTicket);
        }
    }, [selectedEvent?.ticketType, selectedTicket?._id]);

    const { labels, series } = getTicketSalesData(selectedEvent, selectedTicket);

    const hasData = series.some(value => value > 0);

    const fallbackLabels = [selectedTicket || "No Sales"];
    const fallbackSeries = [0, 0];
    const localDonutOptions: ApexOptions = {
        chart: { type: "donut" },
        labels: hasData && selectedTicket ? labels : fallbackLabels,
        legend: { show: false },
        colors: hasData && selectedTicket ? undefined : ["#9E9E9E", "#F7F7F7"],
        plotOptions: {
            pie: {
                dataLabels: {
                    minAngleToShowLabel: 0
                }
            }
        },
        dataLabels: {
            enabled: true,
            formatter: (val, opts) => {
                if (!opts.w.config.series[opts.seriesIndex]) return '0';
                const value = opts.w.config.series[opts.seriesIndex];
                return `${value}`;
            },
            style: {
                colors: ['#FFFFFF'],
            },
        },
        tooltip: {
            theme: 'dark',
            style: {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
            },
            fillSeriesColor: false,
        },
    };

    return (
        <Grid container spacing={3} alignItems="stretch">
            {/* Left Card - Best Selling */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: "100%", display: "flex", flexDirection: "column" }}>
                    <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" spacing={2}>
                        <HeadingCommon title="Best Selling" color="primary" baseSize="18px" weight={600} mb={0} />

                        {/* Ticket Type Selector */}
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <HeadingCommon title="Ticket Type:" baseSize="14px" weight={500} mb={0} />

                            <Select
                                value={selectedTicket?._id || ""}
                                onChange={(e) => {
                                    const selectedId = e.target.value;
                                    const ticket = ticketTypes.find((t: any) => t._id === selectedId);
                                    setSelectedTicket(ticket); // This sets the entire ticket object
                                }}
                                size="small"
                                sx={{
                                    minWidth: 120,
                                    textTransform: "capitalize",
                                    fontSize: { xs: 12, sm: 13, md: 14 }
                                }}
                                displayEmpty

                            >
                                <MenuItem value="">
                                    <em>Select a ticket</em>
                                </MenuItem>
                                {ticketTypes?.map((ticket: any) => (
                                    <MenuItem key={ticket._id} value={ticket._id}
                                    >
                                        {ticket.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </Stack>
                    </Stack>

                    {/* Chart & Info */}
                    <Stack direction={{ xs: "column", md: "row" }} alignItems="center" justifyContent="space-between" mt={2} spacing={2} flex={1}>
                        <Chart
                            options={{
                                ...localDonutOptions,
                                labels: hasData && selectedTicket ? labels : fallbackLabels,
                                colors: hasData && selectedTicket ? undefined : ["#E0E0E0", "#F0F0F0"]
                            }}
                            series={hasData && selectedTicket ? series : fallbackSeries}
                            type="donut"
                            height={150}
                            width={150}
                        />


                        <Stack spacing={2} flex={1}>
                            <HeadingCommon
                                title="Visualize your ticket performance."
                                variant="body2"
                                baseSize="14px"
                                weight={400}
                                color="primary"
                            />
                            <Stack direction="row" spacing={2}>
                                <Stack>
                                    <Box width={20} height={5} bgcolor="#12263F" borderRadius={2} />
                                    <HeadingCommon title={Number(selectedTicket?.quantity || 0) - Number(selectedTicket?.sold || 0)} baseSize="14px" weight={500} mb={0} />
                                    <HeadingCommon title="Ticket Left" baseSize="13px" weight={500} mb={0} color="gray" />
                                </Stack>
                                <Stack>
                                    <Box width={20} height={5} bgcolor="#1E88E5" borderRadius={2} />
                                    <HeadingCommon title={selectedTicket?.sold || 0} baseSize="14px" weight={500} mb={0} />
                                    <HeadingCommon title="Ticket Sold" baseSize="13px" weight={500} mb={0} color="gray" />
                                </Stack>
                            </Stack>

                        </Stack>
                    </Stack>
                </Card>
            </Grid>

            {/* Right Card - Ticket Sold Today */}
            <Grid item xs={12} md={6}>
                <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, backgroundColor: "#2395D4", color: "#fff", height: "100%", display: "flex", flexDirection: "column" }}>
                    <Box display="flex" alignItems="center" justifyContent="space-between" flexWrap="wrap" mt={1}>
                        {/* Ticket Sold Info */}
                        <Box>
                            <HeadingCommon title="Ticket Sold Today" color="#fff" baseSize="18px" weight={600} mb={0} />
                            <Typography variant="h3" fontWeight="bold" >
                                {getTodayTicketSold(selectedEvent)} <span style={{ fontSize: "16px" }}>pcs</span>
                            </Typography>
                        </Box>

                        {/* Growth Chart */}
                        <Box display="flex" alignItems="center">
                            <Chart
                                options={{ ...chartOptions, colors: ["#FFF"] }}
                                series={[{ name: "Tickets", data: ticketData }]}
                                type="line"
                                height={110}
                                width={100}
                            />
                            <Box>
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    {dynamicGrowth >= 0 ? `+${dynamicGrowth}%` : `${dynamicGrowth}%`}
                                </Typography>
                                <Typography variant="body2" sx={{ ml: 1 }}>
                                    from last day
                                </Typography>
                            </Box>
                        </Box>
                    </Box>

                    {/* Progress Bar */}
                    <Stack direction={{ xs: "column", sm: "row" }} alignItems="center" mt={1} spacing={1}>
                        <HeadingCommon
                            title={`${ticketsLeft} pcs left`}
                            variant="body2"
                            baseSize="12px"
                            weight={400}
                            color="#2395D4"
                            css={{ backgroundColor: "#FFF", px: 1, borderRadius: 1 }}
                        />

                        <Box sx={{ width: "100%", height: 8, backgroundColor: "#64B5F6", borderRadius: 4, overflow: "hidden" }}>
                            <Box sx={{ width: `${percentSold}%`, height: "100%", backgroundColor: "#FFF" }} />
                        </Box>
                    </Stack>
                    <HeadingCommon
                        title="Track daily ticket sales performance and the number of tickets still available here."
                        variant="body2"
                        mt={1}
                        baseSize="14px"
                        weight={400}
                        color="white"
                    />
                </Card>
            </Grid>
        </Grid>
    )
}


function getTodayTicketSold(selectedEvent: any) {
    const today = dayjs().format("YYYY-MM-DD");

    if (!selectedEvent?.order?.length) return 0;

    return selectedEvent.order.reduce((total: number, order: any) => {
        const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");
        if (orderDate === today && order.paymentStatus === "confirmed") {
            const qty = order.tickets?.reduce((sum: number, t: any) => sum + (t.quantity || 0), 0) || 0;
            return total + qty;
        }
        return total;
    }, 0);
}

function getTicketsSoldOnDate(selectedEvent: any, date: string): number {
    if (!selectedEvent?.order?.length) return 0;

    return selectedEvent.order.reduce((total: number, order: any) => {
        const orderDate = dayjs(order.createdAt).format("YYYY-MM-DD");
        if (orderDate === date && order.paymentStatus === "confirmed") {
            const qty = order.tickets?.reduce((sum: number, t: any) => sum + (t.quantity || 0), 0) || 0;
            return total + qty;
        }
        return total;
    }, 0);
}

function getTicketGrowthPercentage(selectedEvent: any): number {
    const today = dayjs().format("YYYY-MM-DD");
    const yesterday = dayjs().subtract(1, 'day').format("YYYY-MM-DD");

    const todayCount = getTicketsSoldOnDate(selectedEvent, today);
    const yesterdayCount = getTicketsSoldOnDate(selectedEvent, yesterday);

    if (yesterdayCount === 0) {
        return todayCount > 0 ? 100 : 0; // Avoid division by zero
    }

    const change = ((todayCount - yesterdayCount) / yesterdayCount) * 100;
    return Math.round(change);
}

function getLast7DaysTicketData(selectedEvent: any): number[] {
    const days = [...Array(7)].map((_, i) => dayjs().subtract(6 - i, 'day').format('YYYY-MM-DD'));

    return days.map(date => getTicketsSoldOnDate(selectedEvent, date));
}



function getTicketSalesData(event: any, selectedTicket: any): { labels: string[]; series: number[], total: number } {
    if (!selectedTicket) {
        return {
            labels: ["Ticket Sold", "Ticket Left"],
            series: [0, 0],
            total: 0
        };
    }

    const soldCount = Number(selectedTicket?.sold || 0);
    const pendingCount = Number(selectedTicket?.quantity || 0) - soldCount;

    return {
        labels: ["Ticket Sold", "Ticket Left"],
        series: [soldCount, pendingCount],
        total: Number(selectedTicket?.quantity) - selectedTicket.sold
    };
}




