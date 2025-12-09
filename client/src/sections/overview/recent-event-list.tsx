import React, { useEffect } from 'react';
import {
    Box, Grid, Card, CardContent, Typography, List, Avatar,
    ListItem, ListItemAvatar, ListItemText, Divider, Select, MenuItem, Stack, IconButton, CardMedia, Button
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Link } from 'react-router-dom';
import ReactHtmlParser from 'react-html-parser';
import LinearProgress from '@mui/material/LinearProgress';
import Calendar from 'react-calendar';
import dayjs from "dayjs";

import { Chart } from 'src/components/chart';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { truncateText } from 'src/hooks/description-cutting';
import { Iconify } from 'src/components/iconify';


type Props = {
    isDesktop: boolean;
    isMobileTablet: boolean;
    selectedTicket: string;
    setSelectedTicket: (val: string) => void;
    timePeriod: string;
    handleTimePeriodChange: (e: any) => void;
    upcomingEvents: any[];
    latestSales: any[];
    latestEvents: any[];
    currentDate: Date;
    eventDates: string[];
    getDayNumber: (d: string) => string;
    getDayName: (d: string) => string;
    selectedEvent: any;
};

type Ticket = {
    id: string;
    ticketType: string;
};

export const RecentEventList: React.FC<Props> = ({
    isDesktop,
    isMobileTablet,
    selectedTicket,
    setSelectedTicket,
    timePeriod,
    handleTimePeriodChange,
    upcomingEvents,
    latestSales,
    latestEvents,
    currentDate,
    eventDates,
    getDayNumber,
    getDayName,
    selectedEvent,
}) => {
    const theme = useTheme();
    const ticketTypes: Ticket[] = selectedEvent?.tickets?.[0]?.tickets || [];
    const [visibleCount, setVisibleCount] = React.useState(2);

    useEffect(() => {
        const tickets = selectedEvent?.tickets?.[0]?.tickets || [];
        if (!tickets.length) return;
        const types = tickets.map((t: { ticketType: string }) => t.ticketType);
        if (!selectedTicket || !types.includes(selectedTicket)) {
            setSelectedTicket(tickets[0].ticketType);
        }
    }, [selectedEvent, selectedTicket, setSelectedTicket]);

    const weeklyData = getWeeklyRevenue(selectedEvent, selectedTicket);
    const monthlyData = getMonthlyRevenue(selectedEvent, selectedTicket);
    const dailyData = getDailyRevenue(selectedEvent, selectedTicket);

    const revenueData =
        timePeriod === "monthly"
            ? monthlyData
            : timePeriod === "weekly"
                ? weeklyData
                : dailyData;

    const xAxisLabels =
        timePeriod === "monthly"
            ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
            : timePeriod === "weekly"
                ? ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5"]
                : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    const yAxisConfig = {
        monthly: { min: 0, max: 12000 },
        weekly: { min: 0, max: 1200 },
        daily: { min: 0, max: 1200 }
    } as const;


    const { min, max } = yAxisConfig[timePeriod as keyof typeof yAxisConfig];

    const revenueChartData = {
        options: {
            chart: { id: "revenue-chart" },
            xaxis: {
                categories: xAxisLabels
            },
            stroke: {
                curve: "smooth" as const
            },
            tooltip: {
                y: {
                    formatter: (val: number) => `${val.toLocaleString()} XAF`
                }
            },
            yaxis: {
                min,
                max,
                tickAmount: 4,
                labels: {
                    formatter: (val: number) => `${(val / 1000).toLocaleString()}k XAF`
                }
            }
        },
        series: [
            {
                name: "Revenue",
                data: revenueData
            }
        ]
    };

    return (
        <Box sx={{ py: 3, minHeight: "100vh" }}>
            <Grid container spacing={3}>
                {/* Recent Event List */}
                <Grid item xs={12} md={8}>
                    {/* Recent event list */}
                    {isDesktop && (
                        <Card>
                            <CardContent>
                                <HeadingCommon variant="h5" color="text.secondary" baseSize="20px" title="Recent Event List" />
                                {/* Loading/Empty State */}

                                {upcomingEvents?.length === 0 && (
                                    <Typography
                                        variant="body1"
                                        textAlign="center"
                                        color="text.secondary"
                                        sx={{ py: 3 }}
                                    >
                                        No upcoming events found
                                    </Typography>
                                )}
                                <Grid container spacing={3}>
                                    {
                                        upcomingEvents?.slice(0, visibleCount).map((event: any) => (
                                            <Grid item xs={12} key={event._id}>
                                                <Link to={`/our-event/${event._id}`} target='__blank' style={{ textDecoration: "none" }}>

                                                    <Card sx={{ padding: 2, boxShadow: 3, borderRadius: 2 }}>
                                                        <HeadingCommon variant="h6" color={theme.palette.primary.main} baseSize="20px" title={event.eventName} />

                                                        <Box display="flex" mt={1}>
                                                            <CardMedia component="img" image={event?.coverImage?.url} alt={event.eventName} sx={{ width: 150, height: 85, borderRadius: 2 }} />
                                                            <CardContent sx={{ flex: 1, pt: 0 }}>
                                                                <Typography variant="body2" color={theme.palette.common.black}>
                                                                    {event.location}
                                                                </Typography>
                                                                <Typography variant="body2" color="textSecondary" >
                                                                    {ReactHtmlParser(truncateText(event?.description))}
                                                                </Typography>
                                                            </CardContent>
                                                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                                                <Stack alignItems="center" spacing={0.5}>
                                                                    <Avatar sx={{ bgcolor: "#f0f8ff" }}>
                                                                        <IconButton color="primary">
                                                                            <Iconify width={20} icon="ep:sold-out" />
                                                                        </IconButton>
                                                                    </Avatar>
                                                                    <Typography color="primary" fontSize={12}>{event.soldTicket || 0} Sold</Typography>
                                                                </Stack>
                                                                <Stack alignItems="center" spacing={0.5}>
                                                                    <Avatar sx={{ bgcolor: "#f0f8ff" }}>
                                                                        <IconButton sx={{ color: "primary" }}>
                                                                            <Iconify width={20} icon="ix:ticket-filled" />
                                                                        </IconButton>
                                                                    </Avatar>
                                                                    <Typography fontSize={12} color="primary">
                                                                        {event.ticketQuantity === "0"
                                                                            ? "Unlimited"
                                                                            : `${Number(event.ticketQuantity)} pcs`}
                                                                    </Typography>
                                                                </Stack>
                                                                <Stack alignItems="center" spacing={0.5}>
                                                                    <Avatar sx={{ bgcolor: "#f0f8ff" }}>
                                                                        <IconButton color="primary">
                                                                            <Iconify width={20} icon="simple-line-icons:calender" />
                                                                        </IconButton>
                                                                    </Avatar>
                                                                    <Typography fontSize={12} color="primary">{event.date}</Typography>
                                                                </Stack>
                                                            </Box>
                                                        </Box>
                                                    </Card>
                                                </Link>

                                            </Grid>
                                        ))
                                    }
                                </Grid>
                                {/* Conditionally show "Load More" only if 4+ events exist */}
                                {upcomingEvents?.length > visibleCount && (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 2, backgroundColor: '#0B2E4E' }}
                                        onClick={() => setVisibleCount(prev => prev + 2)} // load 2 more per click
                                    >
                                        Load More
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {isMobileTablet && (
                        <Card>
                            <CardContent>
                                <Typography variant="h6" color={theme.palette.primary.main} gutterBottom>
                                    Recent Event List
                                </Typography>
                                <Grid container spacing={3}>
                                    {upcomingEvents?.slice(0, visibleCount)?.map((event: any) => (
                                        <Grid item xs={12} key={event._id}>
                                            <Card sx={{ display: "flex", flexDirection: "column", padding: 2, boxShadow: 3, borderRadius: 2 }}>

                                                {/* Image Section */}
                                                <CardMedia component="img" image={event.coverImage.url} alt={event.eventName} sx={{ width: "100%", height: 120, borderRadius: 2, objectFit: "cover" }} />

                                                {/* Content Section */}
                                                <CardContent sx={{ textAlign: "center", pt: 1 }}>
                                                    <Typography variant="h6" color={theme.palette.primary.main} sx={{ fontWeight: 500 }}>
                                                        {event.eventName}
                                                    </Typography>
                                                    <Typography variant="body2" color={theme.palette.common.black}>
                                                        {event.location}
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        {ReactHtmlParser(truncateText(event?.description))}
                                                    </Typography>
                                                </CardContent>

                                                {/* Icons Section */}
                                                <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "center", gap: 2, mt: 2 }}>
                                                    <Stack alignItems="center" spacing={0.5}>
                                                        <Avatar sx={{ bgcolor: "#f0f8ff" }}>
                                                            <IconButton color="primary">
                                                                <Iconify width={20} icon="ep:sold-out" />
                                                            </IconButton>
                                                        </Avatar>
                                                        <Typography color="primary" fontSize={12}>{event.soldTicket || 0} Sold</Typography>

                                                    </Stack>
                                                    <Stack alignItems="center" spacing={0.5}>
                                                        <Avatar sx={{ bgcolor: "#f0f8ff" }}>
                                                            <IconButton sx={{ color: "primary" }}>
                                                                <Iconify width={20} icon="ix:ticket-filled" />
                                                            </IconButton>
                                                        </Avatar>
                                                        <Typography fontSize={12} color="primary">
                                                            {Number(event.ticketQuantity)} total pcs
                                                        </Typography>
                                                    </Stack>
                                                    <Stack alignItems="center" spacing={0.5}>
                                                        <Avatar sx={{ bgcolor: "#f0f8ff" }}>
                                                            <IconButton color="primary">
                                                                <Iconify width={20} icon="simple-line-icons:calender" />
                                                            </IconButton>
                                                        </Avatar>
                                                        <Typography fontSize={12} color="primary">{event.date}</Typography>
                                                    </Stack>
                                                </Box>

                                            </Card>
                                        </Grid>
                                    ))}
                                </Grid>
                                {upcomingEvents?.length > visibleCount && (
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 2, backgroundColor: "#0B2E4E" }}
                                        onClick={() => setVisibleCount(prev => prev + 2)} // load 2 more per click
                                    >
                                        Load More
                                    </Button>
                                )}

                            </CardContent>
                        </Card>
                    )}
                    <Card sx={{ mt: 3 }}>
                        <CardContent>
                            <Typography variant="h6" gutterBottom>
                                Latest Sales
                            </Typography>
                            {latestSales?.length > 0 ? (
                                latestSales?.slice(0, 4)?.map((list: any, index: any) => (
                                    <List key={index} sx={{ pt: "0px", px: 0 }}>
                                        <ListItem>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={list.user.avatar?.url}
                                                    sx={{ width: 40, height: 40 }}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText
                                                sx={{ textTransform: "capitalize" }}
                                                primary={list.user.name}
                                                secondary={`Purchased ${list.eventName} tickets`}
                                            />
                                        </ListItem>
                                        <Divider />
                                    </List>
                                ))
                            ) : (
                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    minHeight: 100
                                }}>
                                    <Typography variant="body1" color="textSecondary">
                                        No ticket purchases yet
                                    </Typography>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
                    {
                        selectedEvent?.payStatus === "paid" && (
                            <Card sx={{ mt: 3 }}>
                                <CardContent>
                                    <Stack
                                        direction={{ xs: "column", md: "row" }}
                                        alignItems={{ xs: "center", md: "center" }}
                                        justifyContent="space-between"
                                        spacing={2}
                                        sx={{ textAlign: { xs: "center", md: "left" }, flexWrap: "wrap" }}
                                    >
                                        <Typography variant="h6" color="primary">Sales Revenue</Typography>

                                        {/* Ticket Type Selector */}
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            spacing={1}
                                            sx={{ flexWrap: "wrap", justifyContent: { xs: "center", md: "flex-start" } }}
                                        >
                                            <Typography variant="body2" sx={{ whiteSpace: "nowrap" }}>Ticket Type:</Typography>
                                            <Select
                                                value={ticketTypes.some(t => t.ticketType === selectedTicket) ? selectedTicket : ticketTypes[0]?.ticketType || ""}
                                                onChange={(e) => setSelectedTicket(e.target.value)}
                                                size="small"
                                                sx={{
                                                    minWidth: 100,
                                                    fontSize: { xs: 10, sm: 11, md: 12 }
                                                }}
                                            >
                                                {ticketTypes.map((ticket: any) => (
                                                    <MenuItem key={ticket.id} value={ticket.ticketType}>
                                                        {ticket.ticketType}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </Stack>
                                        <Stack direction="row" alignItems="center" mt={3} spacing={1}>
                                            <Typography variant="body2">Time Period:</Typography>
                                            <Select
                                                value={timePeriod}
                                                onChange={handleTimePeriodChange}
                                                size="small"
                                                sx={{ 
                                                    minWidth: 120, 
                                                    fontSize: { xs: 10, sm: 11, md: 12 }

                                                }}
                                            >
                                                <MenuItem value="daily">Daily</MenuItem>
                                                <MenuItem value="weekly">Weekly</MenuItem>
                                                <MenuItem value="monthly">Monthly</MenuItem>
                                            </Select>
                                        </Stack>
                                    </Stack>

                                    {/* Chart */}
                                    <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                                        <Chart
                                            options={revenueChartData.options}
                                            series={revenueChartData.series}
                                            type="line"
                                            height={250}
                                            width="100%"
                                        />
                                    </Box>
                                </CardContent>
                            </Card>
                        )
                    }

                </Grid>
                {/* Calendar & Upcoming Events */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2, width: "100%" }}>
                        <Box padding={3}>
                            <Calendar
                                value={currentDate}
                                tileClassName={({ date }) => {
                                    const today = new Date().toDateString();
                                    const dateString = date.toDateString();
                                    // Highlight if the date is in eventDates and not today
                                    if (eventDates?.includes(dateString) && dateString !== today) {
                                        return "highlight";
                                    }
                                    return null;
                                }}
                            />
                        </Box>

                        <CardContent>
                            <HeadingCommon variant="h5" color="text.secondary" baseSize="20px" title="Upcoming Events" />


                            {!latestEvents || latestEvents.length === 0 ? (
                                <Box
                                    sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        height: 200,
                                        color: "text.secondary"
                                    }}
                                >
                                    <Typography variant="h6">No events found</Typography>
                                </Box>
                            ) : (
                                latestEvents.slice(0, 3).map((event: any) => (
                                    <Box
                                        key={event._id}
                                        display="flex"
                                        alignItems="center"
                                        gap={2}
                                        sx={{
                                            marginBottom: 2,
                                            flexDirection: { xs: "column", sm: "row" },
                                            textAlign: { xs: "center", sm: "left" },
                                            width: "100%"
                                        }}
                                    >
                                        {/* Date Circle */}
                                        <Box
                                            sx={{
                                                backgroundColor: "#F5FCFA",
                                                borderRadius: 1,
                                                p: 1,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0,
                                            }}
                                        >
                                            <HeadingCommon variant="h5" baseSize="28px" weight={600} title={getDayNumber(event.date)} />
                                            <HeadingCommon variant="h5" color="text.secondary" baseSize="14px" title={getDayName(event.date)} />

                                            <Avatar sx={{ width: 12, height: 12, bgcolor: "navy", mt: 1 }} />
                                        </Box>

                                        {/* Event Details */}
                                        <Box sx={{ width: "100%" }}>
                                            <HeadingCommon variant="h5" color="text.secondary" baseSize="14px" title={event.eventName} />
                                            <Box
                                                display="flex"
                                                justifyContent={{ xs: "center", sm: "space-between" }}
                                                alignItems="center"
                                                flexWrap="wrap"
                                                gap={1}
                                            >
                                                <Typography variant="caption" color="text.secondary">
                                                    Ticket Sold
                                                </Typography>
                                                <Typography variant="caption" fontWeight="bold">
                                                    {event.soldTicket || 0}/{event.ticketQuantity === '0' ? 'Unlimited' : event.ticketQuantity}
                                                </Typography>
                                            </Box>

                                            <Box display="flex" justifyContent={{ xs: "center", sm: "flex-start" }}>
                                                <LinearProgress
                                                    variant="determinate"
                                                    value={((event?.soldTicket ?? 0) / (event?.ticketQuantity ?? 1)) * 100}
                                                    sx={{
                                                        width: { xs: "100%", sm: 100 },
                                                        height: 6,
                                                        borderRadius: 5,
                                                        bgcolor: "#E0E0E0",
                                                        marginTop: 1
                                                    }}
                                                />
                                            </Box>
                                        </Box>
                                    </Box>
                                ))
                            )}
                        </CardContent>
                    </Card>

                </Grid>

            </Grid>
        </Box>
    );
};

function getMonthlyRevenue(event: any, selectedTicket: string) {
    const monthlyRevenue = new Array(12).fill(0); // Jan to Dec

    if (!event || !event.order) return monthlyRevenue;

    event.order.forEach((order: any) => {
        const isConfirmed = order.paymentStatus === "confirmed";
        const hasSelectedTicket = order.tickets?.some(
            (ticket: any) => ticket.ticketType === selectedTicket
        );
        const isRefunded = order.refundAmount > 0;

        if (isConfirmed && hasSelectedTicket && !isRefunded) {
            const orderMonth = dayjs(order.createdAt).month(); // 0 = Jan

            const totalAmountForSelectedTicket = order.tickets
                ?.filter((ticket: any) => ticket.ticketType === selectedTicket)
                ?.reduce(
                    (sum: number, ticket: any) =>
                        sum + ticket.unitPrice * ticket.quantity,
                    0
                );

            monthlyRevenue[orderMonth] += totalAmountForSelectedTicket || 0;
        }
    });

    return monthlyRevenue;
}

function getWeeklyRevenue(event: any, selectedTicket: string) {
    const weeklyRevenue = new Array(5).fill(0); // Week 1 to Week 5

    if (!event || !event.order) return weeklyRevenue;

    event.order.forEach((order: any) => {
        const isConfirmed = order.paymentStatus === "confirmed";
        const isRefunded = order.refundAmount > 0;
        const hasSelectedTicket = order.tickets?.some(
            (ticket: any) => ticket.ticketType === selectedTicket
        );

        if (isConfirmed && hasSelectedTicket && !isRefunded) {
            const createdAt = dayjs(order.createdAt);
            const weekOfMonth = Math.min(Math.floor((createdAt.date() - 1) / 7), 4); // 0 = Week 1, max = Week 5

            const totalAmount = order.tickets
                ?.filter((ticket: any) => ticket.ticketType === selectedTicket)
                ?.reduce(
                    (sum: number, ticket: any) =>
                        sum + ticket.unitPrice * ticket.quantity,
                    0
                );

            weeklyRevenue[weekOfMonth] += totalAmount || 0;
        }
    });

    return weeklyRevenue;
}

function getDailyRevenue(event: any, selectedTicket: string) {
    const dailyRevenue = new Array(7).fill(0); // Mon to Sun

    if (!event || !event.order) return dailyRevenue;

    event.order.forEach((order: any) => {
        const isConfirmed = order.paymentStatus === "confirmed";
        const hasSelectedTicket = order.tickets?.some(
            (ticket: any) => ticket.ticketType === selectedTicket
        );
        const isRefunded = order.refundAmount > 0;

        if (isConfirmed && hasSelectedTicket && !isRefunded) {
            const dayOfWeek = dayjs(order.createdAt).day(); // 0=Sunday, 1=Monday...
            const index = (dayOfWeek + 6) % 7; // Make Monday = 0, Sunday = 6

            const total = order.tickets
                ?.filter((ticket: any) => ticket.ticketType === selectedTicket)
                ?.reduce((sum: number, ticket: any) => sum + ticket.unitPrice * ticket.quantity, 0);

            dailyRevenue[index] += total || 0;
        }
    });

    return dailyRevenue;
}