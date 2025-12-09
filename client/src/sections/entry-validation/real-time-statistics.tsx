import { Paper, Box, Button, useTheme, useMediaQuery, Grid, Typography } from "@mui/material";
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

export function RealTimeStatistics({ statistics }: any) {
    const { tickets = {} } = statistics || {};

    const STATS_DATA = [
        { label: "Total Tickets", value: tickets?.totalTicketQuantity },
        { label: "Tickets Sold", value: tickets?.soldTickets },
        { label: "Validated Tickets", value: tickets?.verifiedEntries },
        { label: "Pending Tickets", value: tickets?.pendingTickets },
    ];

    // Enhanced chart data showing ticket distribution
    const CHART_SERIES = [
        tickets?.verifiedEntries || 0,
        (tickets?.soldTickets || 0),
        tickets?.pendingTickets || 0,
        (tickets?.availableTickets || 0),
    ];

    const CHART_LABELS = ["Validated", "Sold (Not Validated)", "Pending", "Available"];

    const CHART_OPTIONS: ApexOptions = {
        chart: {
            type: "pie",
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800
            }
        },
        labels: CHART_LABELS,
        legend: {
            position: "bottom",
            horizontalAlign: "center",
            fontSize: "14px",
            fontWeight: 600,
            formatter(legendName, opts) {
                return `${legendName}: ${opts.w.globals.series[opts.seriesIndex]}`;
            }
        },
       
        dataLabels: {
            enabled: true,
            formatter(val: number, opts: any) {
                return `${opts.w.globals.labels[opts.seriesIndex]}\n${val.toFixed(1)}%`;
            },
            style: {
                fontSize: "11px",
                fontWeight: 600,
                colors: ["#fff"]
            }
        },
        colors: ["#4CAF50", "#2196F3", "#FFC107", "#9E9E9E"],
        tooltip: {
            y: {
                formatter(value: number) {
                    return `${value}`; // just show the number
                }
            }
        },
        plotOptions: {
            pie: {
                donut: {
                    size: '40%',
                    labels: {
                        show: true,
                        total: {
                            show: true,
                            label: 'Total Tickets',
                            color: '#373d3f',
                            formatter(w) {
                                const soldIndex = CHART_LABELS.indexOf("Sold");
                                const availableIndex = CHART_LABELS.indexOf("Available");
                                const sold = w.globals.series[soldIndex] || 0;
                                const available = w.globals.series[availableIndex] || 0;
                                return sold + available;
                            }
                        }
                    }
                }
            }
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    chart: { width: "100%" },
                    legend: {
                        fontSize: "10px",
                        position: "bottom"
                    },
                    dataLabels: {
                        style: {
                            fontSize: "9px"
                        }
                    }
                }
            }
        ]
    };

    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    return (
        <Box mt={3} boxShadow={3} borderRadius={3} p={3} bgcolor="white">
            <HeadingCommon title="Real-Time Statistics" color="#0B2E4C" weight={600} baseSize="33px" />

            <Grid container spacing={2} sx={{ mt: 1 }}>
                {STATS_DATA.map((stat, index) => (
                    <Grid item xs={12} sm={6} md={3} key={index}>
                        <Button
                            fullWidth
                            sx={{
                                backgroundColor: "#0B2A4A",
                                padding: {
                                    xs: "12px",
                                    sm: "15px"
                                },
                                borderRadius: "8px",
                                textAlign: "center",
                                color: "white",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                                minHeight: {
                                    xs: "80px",
                                    sm: "auto"
                                },
                                '&:hover': {
                                    backgroundColor: "#0A1E36"
                                }
                            }}
                        >
                            <Typography variant="body2" fontWeight="bold" sx={{
                                fontSize: {
                                    xs: "0.875rem",
                                    sm: "1rem"
                                }
                            }}>
                                {stat.label}
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" sx={{
                                fontSize: {
                                    xs: "1.25rem",
                                    sm: "1.5rem"
                                }
                            }}>
                                {stat.value || 0}
                            </Typography>
                        </Button>
                    </Grid>
                ))}
            </Grid>

            <Paper
                sx={{
                    mt: 2,
                    padding: "15px",
                    borderRadius: "12px",
                    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)"
                }}
            >
                <HeadingCommon title="Ticket Distribution" baseSize="33px" />
                <Chart
                    options={CHART_OPTIONS}
                    series={CHART_SERIES}
                    type="donut"
                    height={isMobile ? 300 : 350}
                />
            </Paper>
        </Box>
    );
}