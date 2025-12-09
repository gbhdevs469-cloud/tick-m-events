import { ApexOptions } from "apexcharts";
import Chart from "react-apexcharts";
import { ToggleButtonGroup, ToggleButton, Box, Grid, Stack, Select, MenuItem, } from "@mui/material";
import { useState, useMemo } from "react";
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";
import { commonChartOptions } from "./utils";

type Timeframe = "monthly" | "weekly" | "daily";

type Order = {
  createdAt: string;
  totalAmount: number;
  refundStatus?: "refunded" | string;
  refundAmount?: number;
  paymentStatus?: "confirmed" | "pending" | "failed";
};

function getMonthLabel(date: Date) {
  return date.toLocaleString("default", { month: "short" });
}

function getWeekLabel(date: Date) {
  const day = date.getDate();
  return `Week ${Math.ceil(day / 7)}`;
}

function getDayHourLabel(date: Date) {
  return `${date.getHours()}:00`;
}

function getISOWeek(date: Date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = new Date(target.getFullYear(), 0, 4);
  const weekNr = Math.ceil(
    ((target.getTime() - firstThursday.getTime()) / 86400000 + firstThursday.getDay() + 1) / 7
  );
  return `Week ${weekNr}`;
}

function filterOrdersByTimeframe(orders: Order[], timeframe: Timeframe) {
  const now = new Date();
  switch (timeframe) {
    case "monthly":
      return orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        const diffMonths = (now.getFullYear() - orderDate.getFullYear()) * 12 + (now.getMonth() - orderDate.getMonth());
        return diffMonths >= 0 && diffMonths < 12;
      });
    case "weekly":
      return orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        const diffDays = Math.floor((now.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        return diffDays >= 0 && diffDays < 28;
      });
    case "daily":
      return orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        return orderDate.toDateString() === now.toDateString();
      });
    default:
      return [];
  }
}

function groupOrdersByTimeframe(orders: Order[], timeframe: Timeframe) {
  const grouped: Record<string, number> = {};

  orders.forEach((order) => {
    const date = new Date(order.createdAt);
    let key = "";

    if (timeframe === "monthly") {
      key = getMonthLabel(date);
    } else if (timeframe === "weekly") {
      key = getWeekLabel(date);
    } else if (timeframe === "daily") {
      key = getDayHourLabel(date);
    }

    if (!grouped[key]) grouped[key] = 0;

    let amount = order.totalAmount;

    if (order.refundStatus === "refunded" && order.refundAmount) {
      amount -= order.refundAmount;
    }

    grouped[key] += amount;
  });

  return grouped;
}

function getWeekdayLabel(date: Date, today = new Date()) {
  const dayIndex = date.getDay();
  const weekdayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  if (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  ) {
    return "Today";
  }

  return weekdayNames[dayIndex];
}

export function LiveSalesRevenueData({ selectedEvent }: { selectedEvent: any }) {
  const [timeframe, setTimeframe] = useState<Timeframe>("monthly");
  const [comparisonHours, setComparisonHours] = useState<number>(10);
  const [comparisonPercentage, setComparisonPercentage] = useState(0);
  const handleTimeframeChange = (_: React.MouseEvent<HTMLElement>, newTimeframe: Timeframe | null) => {
    if (newTimeframe) setTimeframe(newTimeframe);
  };
  const filteredOrders = useMemo(() => {
    if (!selectedEvent?.order) return [];
    return filterOrdersByTimeframe(
      selectedEvent.order.filter((o: Order) => o.paymentStatus === "confirmed"),
      timeframe
    );
  }, [selectedEvent, timeframe]);


  const groupedRevenue = useMemo(() => groupOrdersByTimeframe(filteredOrders, timeframe), [filteredOrders, timeframe]);

  const categories = useMemo(() => {
    if (timeframe === "monthly") {
      const now = new Date();
      return Array.from({ length: 12 }, (_, i) =>
        getMonthLabel(new Date(now.getFullYear(), now.getMonth() - 11 + i, 1))
      );
    }
    if (timeframe === "weekly") {
      return ["Week 1", "Week 2", "Week 3", "Week 4"];
    }
    return Array.from({ length: 24 }, (_, i) => `${i}:00`);
  }, [timeframe]);

  const revenueData = categories.map((cat) => groupedRevenue[cat] || 0);

  // Trends & Performance Weekly Chart (Fixed: Monday–Sunday)
  const performanceWeekdayGrouped = useMemo(() => {
    if (!selectedEvent?.order) return {};
    const today = new Date();
    const grouped: Record<string, number> = {
      "Monday": 0,
      "Tuesday": 0,
      "Wednesday": 0,
      "Thursday": 0,
      "Friday": 0,
      "Saturday": 0,
      "Sunday": 0,
    };

    selectedEvent.order.forEach((order: Order) => {
      const date = new Date(order.createdAt);
      const weekdayName = date.toLocaleString("en-US", { weekday: "long" });
      grouped[weekdayName] = (grouped[weekdayName] || 0) + 1;
    });

    const todayName = today.toLocaleString("en-US", { weekday: "long" });
    grouped.Today = grouped[todayName] || 0;

    return grouped;
  }, [selectedEvent]);

  const weekdayLabels = useMemo(() => {
    const today = new Date();
    const labels = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const todayName = today.toLocaleString("en-US", { weekday: "long" });

    return labels.map(day => (day === todayName ? "Today" : day));
  }, []);

  const performanceWeekdayData = weekdayLabels.map(label => performanceWeekdayGrouped[label] || 0);

  const trendsBarChartOptions = useMemo<ApexOptions>(() => ({
    ...commonChartOptions,
    chart: { type: "bar" },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadius: 4,
      }
    },
    colors: ["#2395D4"],
    xaxis: {
      categories: weekdayLabels,
      labels: { style: { fontSize: "11px", fontWeight: 500 } }
    },
    yaxis: {
      min: 0,
      tickAmount: 6,
      labels: { style: { fontSize: "12px", fontWeight: 500 } }
    }
  }), [weekdayLabels]);

  const trendsBarChartSeries = [{ name: "Orders Count", data: performanceWeekdayData }];

  const lineChartOptions = useMemo<ApexOptions>(() => ({
    ...commonChartOptions,
    chart: { type: "line", height: 250 },
    stroke: { curve: "smooth", width: 3 },
    colors: ["#2395D4"],
    xaxis: { categories },
    tooltip: { enabled: true },
  }), [categories]);

  const lineChartSeries = [{ name: "Sales", data: revenueData }];

  const hourLabels = useMemo(() => getDynamicHourLabels(comparisonHours), [comparisonHours]);

  const salesComparisonSeries = useMemo(() => {
    if (!selectedEvent?.order) return [];

    const todayData = Array(hourLabels.length).fill(0);
    const yesterdayData = Array(hourLabels.length).fill(0);

    const now = new Date();
    const currentHour = now.getHours();
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);

    selectedEvent.order.forEach((order: Order) => {
      const orderDate = new Date(order.createdAt);
      const orderHour = orderDate.getHours();
      const isToday =
        orderDate.getFullYear() === now.getFullYear() &&
        orderDate.getMonth() === now.getMonth() &&
        orderDate.getDate() === now.getDate();

      const isYesterday =
        orderDate.getFullYear() === yesterday.getFullYear() &&
        orderDate.getMonth() === yesterday.getMonth() &&
        orderDate.getDate() === yesterday.getDate();

      if (!isToday && !isYesterday) return;

      let hourDiff;
      if (isToday) {
        hourDiff = currentHour - orderHour;
      } else {
        hourDiff = currentHour + (24 - orderHour);
      }

      if (hourDiff < 0 || hourDiff >= comparisonHours) return;
      const index = comparisonHours - hourDiff - 1;
      if (index < 0 || index >= hourLabels.length) return;

      const amount = order.totalAmount || 0;

      if (isToday) {
        todayData[index] += amount;
      } else if (isYesterday) {
        yesterdayData[index] += amount;
      }
    });

    // Calculate percentage comparison
    const totalToday = todayData.reduce((sum, v) => sum + v, 0);
    const totalYesterday = yesterdayData.reduce((sum, v) => sum + v, 0);

    let percentage = 0;
    if (totalYesterday > 0) {
      percentage = ((totalToday - totalYesterday) / totalYesterday) * 100;
    } else if (totalToday > 0) {
      percentage = 100;
    }

    setComparisonPercentage(Math.round(percentage));

    return [
      { name: "Today", data: todayData },
      { name: "Yesterday", data: yesterdayData },
    ];
  }, [selectedEvent, hourLabels, comparisonHours]);

  const salesComparisonOptions = useMemo<ApexOptions>(() => ({
    ...commonChartOptions,
    chart: { type: "bar", stacked: false },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "100%",
        borderRadius: 0,
      },
    },
    xaxis: {
      categories: hourLabels,
      labels: { style: { colors: "#FFFFFF" } },
    },
    yaxis: { show: false },
    colors: ["#0B2E4C", "#FFFFFF"],
    legend: {
      show: true,
      labels: { colors: "#FFFFFF" },
      position: "top",
    },
    grid: { show: false },
  }), [hourLabels]);



  return (
    <Box boxShadow={3} borderRadius={3} p={{ xs: 1, md: 3 }} mt={3} bgcolor="white">
      <HeadingCommon title="Live Sales & Revenue Data" mb={0} />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <ChartCard
            title="Sales Revenue"
            headerContent={
              <ToggleButtonGroup
                value={timeframe}
                exclusive
                onChange={handleTimeframeChange}
                sx={{ mb: { xs: 1, md: 2 } }}
              >
                <ToggleButton value="monthly">Monthly</ToggleButton>
                <ToggleButton value="weekly">Weekly</ToggleButton>
                <ToggleButton value="daily">Daily</ToggleButton>
              </ToggleButtonGroup>
            }
          >
            <Chart
              options={lineChartOptions}
              series={lineChartSeries}
              type="line"
              height={235}
              width="100%"
            />
          </ChartCard>
        </Grid>

        <Grid item xs={12} md={6}>
          <ChartCard title="Trends & Performance Graph">
            <Chart
              options={trendsBarChartOptions}
              series={trendsBarChartSeries}
              type="bar"
              height={250}
              width="100%"
            />
          </ChartCard>
        </Grid>
      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12}>
          <Box boxShadow={3} borderRadius={3} p={2} bgcolor="#2395D4" color="white">
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <HeadingCommon title="Sales Comparison" baseSize="20px" color="white" />
              <Box display="flex" alignItems="center" gap={1}>
                <Select
                  size="small"
                  value={comparisonHours}
                  onChange={(e) => setComparisonHours(Number(e.target.value))}
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    borderRadius: 1,
                    minWidth: 80,
                    fontSize: "14px",
                  }}
                >
                  <MenuItem value={5}>Last 5h</MenuItem>
                  <MenuItem value={10}>Last 10h</MenuItem>
                  <MenuItem value={12}>Last 12h</MenuItem>
                  <MenuItem value={24}>Last 24h</MenuItem>
                </Select>
                <HeadingCommon title={`${comparisonPercentage}%`} baseSize="20px" color="white" />
              </Box>
            </Box>

            <HeadingCommon variant="body2" title="Than last day" weight={300} baseSize="20px" color="white" />
            <Chart
              options={salesComparisonOptions}
              series={salesComparisonSeries}
              type="bar"
              height={200}
              width="100%"
            />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

const ChartCard = ({
  title,
  children,
  headerContent
}: {
  title: string;
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}) => (
  <Box boxShadow={3} borderRadius={3} p={{ xs: 1, sm: 1.5, md: 2 }} bgcolor="white">
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={3}>
      <HeadingCommon title={title} baseSize="20px" color="primary" />
      {headerContent}
    </Stack>
    {children}
  </Box>
);

function getDynamicHourLabels(totalHours = 24) {
  const now = new Date();
  const currentHour = now.getHours();
  const hours = [];

  for (let i = totalHours - 1; i >= 0; i -= 1) {
    let hour = currentHour - i;
    if (hour < 0) hour += 24;
    hours.push(hour.toString().padStart(2, "0"));
  }

  return hours;
}

