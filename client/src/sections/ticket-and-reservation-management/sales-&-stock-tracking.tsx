import { Box, FormControl, MenuItem, Paper, Select, Tab, Tabs } from "@mui/material";
import { useMemo, useState } from "react";
import { useTheme } from '@mui/material/styles';
import Chart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

import { TicketReservationManagementTable } from "src/components/tables/ticket-reservation-management-table";
import { realTimeSalseTrackingTableHeaders } from "./utills";

type TabType = 'monthly' | 'weekly' | 'daily';

interface MonthlyBreakdown {
    month: string;
    revenue: number;
    ticketsSold: number;
}

interface TicketRevenue {
    ticketType: string;
    totalRevenue: number;
    totalTicketsSold: number;
    monthlyBreakdown: MonthlyBreakdown[];
}

interface SalesAndStockTrackingProps {
    tickets: any[];
    selectedEvent: any;
    ticketWiseRevenue: TicketRevenue[];
}

export function SalesAndStockTracking({ tickets, selectedEvent, ticketWiseRevenue }: SalesAndStockTrackingProps) {
    const [activeTab, setActiveTab] = useState<TabType>('monthly');
    const theme = useTheme();
    const [priceFilter, setPriceFilter] = useState("All");
    const [nameFilter, setNameFilter] = useState("All");
    const [selectedTicketType, setSelectedTicketType] = useState("All");

    // Get unique ticket names for the name filter dropdown
    const ticketNames = useMemo(() => {
        const names = tickets?.map((ticket: any) => ticket.name) || [];
        return ["All", ...new Set(names)];
    }, [tickets]);

    const ticketPrice = useMemo(() => {
        const price = tickets?.map((ticket: any) => ticket.price) || [];
        return ["All", ...new Set(price)];
    }, [tickets]);

  // Get unique ticket types for the chart dropdown
  const ticketTypes = useMemo(() => {
    if (!tickets) return ["All"];
    const types = tickets.map((ticket: any) => ticket.name); // Ticket Type Name
    return ["All", ...new Set(types)];
  }, [tickets]);

    // Filter tickets based on selected filters
    const filteredTickets = useMemo(() => {
        if (!tickets) return [];

        return tickets.filter((ticket: any) => {
            const priceMatch = priceFilter === "All" || ticket.price === priceFilter;
            const nameMatch = nameFilter === "All" || ticket.name === nameFilter;

            return priceMatch && nameMatch;
        });
    }, [tickets, priceFilter, nameFilter]);

    // Generate empty data structure for when no data is available
    const generateEmptyData = (): Record<TabType, { categories: string[]; series: { name: string; data: number[] }[] }> => ({
        monthly: {
            categories: [],
            series: [{ name: "No Data", data: [] }]
        },
        weekly: {
            categories: [],
            series: [{ name: "No Data", data: [] }]
        },
        daily: {
            categories: [],
            series: [{ name: "No Data", data: [] }]
        }
    });

    // Dynamic chart data based on ticketWiseRevenue
    const salesGraphChartData = useMemo((): Record<TabType, { categories: string[]; series: { name: string; data: number[] }[] }> => {
        if (!ticketWiseRevenue || ticketWiseRevenue.length === 0) {
            return generateEmptyData();
        }

    // Monthly data from ticketWiseRevenue
    if (activeTab === 'monthly') {
      // Get all unique months from all ticket types
      const allMonths = [...new Set(ticketWiseRevenue.flatMap((ticket: TicketRevenue) =>
        ticket.monthlyBreakdown.map((breakdown: MonthlyBreakdown) => breakdown.month)
      ))].sort();

            if (allMonths.length === 0) {
                return generateEmptyData();
            }

            // Format month labels (e.g., "2024-12" → "Dec 2024")
            const categories = allMonths.map((month: string) => {
                const [year, monthNum] = month.split('-');
                const date = new Date(parseInt(year, 10), parseInt(monthNum, 10) - 1);
                return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            });

      // Prepare series data
      const series: { name: string; data: number[] }[] = [];

      if (selectedTicketType === "All") {
        // Show aggregated data for all ticket types
        const aggregatedData = allMonths.map((month: string) =>
          ticketWiseRevenue.reduce((total: number, ticket: TicketRevenue) => {
            const monthlyData = ticket.monthlyBreakdown.find((breakdown: MonthlyBreakdown) => breakdown.month === month);
            return total + (monthlyData?.revenue || 0);
          }, 0)
        );

        series.push({ name: "Total Revenue", data: aggregatedData });
      } else {
        // Show data for selected ticket type only
        const selectedTicket = ticketWiseRevenue.find(
          (ticket: TicketRevenue) => ticket.ticketType === selectedTicketType
        );

        // Always generate 0-filled data even if no record exists
        const ticketData = allMonths.map((month: string) => {
          const monthlyData = selectedTicket?.monthlyBreakdown.find(
            (breakdown: MonthlyBreakdown) => breakdown.month === month
          );
          return monthlyData?.revenue || 0;
        });

        series.push({
          name: `${selectedTicketType} Revenue`,
          data: ticketData
        });
      }


      return {
        monthly: { categories, series },
        weekly: generateEmptyData().weekly,
        daily: generateEmptyData().daily
      };
    }

        // For weekly and daily tabs - return empty data since we only have monthly data
        // You can implement weekly/daily logic here when you have the data
        return generateEmptyData();
    }, [ticketWiseRevenue, activeTab, selectedTicketType]);

  const salesGraphChartOptions: ApexOptions = {
    chart: {
      type: "line",
      toolbar: { show: false },
    },
    xaxis: {
      categories: salesGraphChartData[activeTab].categories,
    },
    yaxis: {
      title: {
        text: "Revenue (XAF)"
      }
    },
    stroke: { curve: "smooth" },
    markers: { size: 5 },
    colors: [theme.palette.primary.main],
    tooltip: {
      y: {
        formatter: (value: number) => `${value} XAF`
      }
    }
  };

    const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
        setActiveTab(newValue as TabType);
    };

    const handleTicketTypeChange = (event: any) => {
        setSelectedTicketType(event.target.value);
    };

    return (
        <Paper sx={{ p: 3, borderRadius: 3, mt: 3, boxShadow: 3 }}>
            {/* Title */}
            <Box sx={{ textAlign: 'center' }}>
                <HeadingCommon
                    baseSize="40px"
                    weight={700}
                    variant="h5"
                    title="Sales & Stock Tracking"
                />
            </Box>

            {/* Filters */}
            <Box>
                <HeadingCommon
                    baseSize="32px"
                    weight={600}
                    variant="h5"
                    title="Real-time Sales Tracking"
                />
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 3,
                        flexWrap: "wrap",
                        mb: 2
                    }}
                >
                    {/* Ticket Category */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HeadingCommon
                            baseSize="14px"
                            weight={400}
                            title="Ticket Name:"
                        />
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                                size="small"
                                sx={{
                                    fontSize: '0.8rem',
                                    height: '32px',
                                    '& .MuiSelect-select': {
                                        padding: '6px 12px'
                                    }
                                }}
                            >
                                {ticketNames.map((name: string) => (
                                    <MenuItem
                                        key={name}
                                        value={name}
                                        sx={{ fontSize: '0.8rem', minHeight: '32px', textTransform: "capitalize" }}
                                    >
                                        {name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>

                    {/* Ticket Status */}
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HeadingCommon
                            baseSize="14px"
                            weight={400}
                            title="Ticket Price:"
                        />
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                                value={priceFilter}
                                onChange={(e) => setPriceFilter(e.target.value)}
                                size="small"
                                sx={{
                                    fontSize: '0.8rem',
                                    height: '32px',
                                    '& .MuiSelect-select': {
                                        padding: '6px 12px'
                                    }
                                }}
                            >
                                {ticketPrice.map((price: string) => (
                                    <MenuItem
                                        key={price}
                                        value={price}
                                        sx={{ fontSize: '0.8rem', minHeight: '32px', textTransform: "capitalize" }}
                                    >
                                        {price}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </Box>
            </Box>

            {/* Table */}
            <TicketReservationManagementTable
                type="2"
                headers={realTimeSalseTrackingTableHeaders}
                data={filteredTickets}
                selectedEvent={selectedEvent?.payStatus}
            />

            {/* Sales Graph */}
            {selectedEvent?.payStatus === 'paid' && (
                <Box sx={{ mt: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                        <HeadingCommon
                            baseSize="20px"
                            weight={500}
                            variant="h5"
                            title="Sales Graph"
                            color="#2395D4"
                        />

                        {/* Ticket Type Selector */}
                        <FormControl sx={{ minWidth: 120 }} size="small">
                            <Select
                                value={selectedTicketType}
                                onChange={handleTicketTypeChange}
                                displayEmpty
                            >
                                {ticketTypes.map((type: string) => (
                                    <MenuItem key={type} value={type}>
                                        {type}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {/* <Tabs
              value={activeTab}
              onChange={handleTabChange}
              textColor="primary"
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label="Monthly"
                value="monthly"
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px" },
                  '&.Mui-selected': {
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }
                }}
              />
              <Tab
                label="Weekly"
                value="weekly"
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px" },
                  '&.Mui-selected': {
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }
                }}
              />
              <Tab
                label="Daily"
                value="daily"
                sx={{
                  fontSize: { xs: "10px", sm: "12px", md: "14px" },
                  '&.Mui-selected': {
                    borderBottom: `2px solid ${theme.palette.primary.main}`
                  }
                }}
              />
            </Tabs> */}
                    </Box>

                    <Chart
                        options={salesGraphChartOptions}
                        series={salesGraphChartData[activeTab].series}
                        type="line"
                        height={300}
                    />
                </Box>
            )}
        </Paper>
    );
}