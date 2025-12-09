import React from 'react';
import {
  Box,
  Grid,
  Typography,
  Tabs,
  Tab,
  Paper,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

// Custom tooltip component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 1.5,
          bgcolor: 'background.paper',
          border: '1px solid #e0e0e0',
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 'bold', mb: 1 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ color: '#0099E5' }}>
          Total Revenue: {(payload[0]?.value || 0).toLocaleString()} XAF
        </Typography>
        <Typography variant="body2" sx={{ color: '#ff6b6b' }}>
          Bid Revenue: {(payload[1]?.value || 0).toLocaleString()} XAF
        </Typography>
        <Typography variant="body2" sx={{ color: '#4ecdc4' }}>
          Event Revenue: {(payload[2]?.value || 0).toLocaleString()} XAF
        </Typography>
      </Paper>
    );
  }

  return null;
};

const RevenueStats = ({ monthlyRevenueGrowth, dailyPercentageChange, revenueBreakdown }: any) => {
  const [tab, setTab] = React.useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Transform monthlyRevenueGrowth data for the chart
  const transformChartData = () => monthlyRevenueGrowth?.map((month:any) => ({
    name: month.period,
    shortName: new Date(month.year, month.month - 1).toLocaleString('default', { month: 'short' }),
    totalRevenue: month.totalRevenue,
    bidRevenue: month.bidRevenue,
    eventReqRevenue: month.eventReqRevenue,
    totalProjects: month.totalProjects,
    bidProjects: month.bidProjects,
    eventReqProjects: month.eventReqProjects,
  }));

  const chartData = transformChartData();
  
  // Calculate dynamic Y-axis domain based on data
  const calculateYAxisDomain = () => {
    const maxRevenue = Math.max(...chartData.map((item:any) => item.totalRevenue));
    const paddedMax = maxRevenue * 1.2;
    return [0, Math.ceil(paddedMax / 1000) * 1000];
  };

  const [yMin, yMax] = calculateYAxisDomain();

  // Format Y-axis ticks
  const formatYAxisTick = (value:any) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(0)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(0)}k`;
    }
    return value === 0 ? '' : value.toString();
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={12}>
        <Paper
          elevation={3}
          sx={{
            borderRadius: '16px',
            p: 2,
            height: { xs: 300, sm: 350, md: 400 },
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #E0E0E0',
            boxShadow: '0 0 10px rgba(0,0,0,0.15)',
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            flexWrap: 'wrap', 
            gap: 1 
          }}>
            <Typography variant="h6" fontWeight="bold">
              Monthly Revenue Growth <span style={{ color: '#777' }}>2024-2025</span>
            </Typography>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              textColor="primary"
              indicatorColor="primary"
              sx={{
                minHeight: 'unset',
                '& .MuiTab-root': { 
                  minHeight: 'unset', 
                  fontSize: { xs: 12, sm: 13 },
                  px: { xs: 1, sm: 2 }
                },
              }}
            >
              <Tab label="Revenue" />
              <Tab label="Projects" />
              <Tab label="Breakdown" />
            </Tabs>
          </Box>

          <Box sx={{ flexGrow: 1, mt: 3 }}>
            <ResponsiveContainer width="100%" height="100%">
              {tab === 0 ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    domain={[yMin, yMax]}
                    tickFormatter={formatYAxisTick}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="totalRevenue"
                    stroke="#0099E5"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#0099E5' }}
                    activeDot={{ r: 6, fill: '#0099E5' }}
                    name="Total Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="bidRevenue"
                    stroke="#ff6b6b"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 3, fill: '#ff6b6b' }}
                    name="Bid Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="eventReqRevenue"
                    stroke="#4ecdc4"
                    strokeWidth={2}
                    strokeDasharray="3 3"
                    dot={{ r: 3, fill: '#4ecdc4' }}
                    name="Event Revenue"
                  />
                </LineChart>
              ) : tab === 1 ? (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="totalProjects"
                    fill="#8884d8"
                    name="Total Projects"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="bidProjects"
                    fill="#82ca9d"
                    name="Bid Projects"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="eventReqProjects"
                    fill="#ffc658"
                    name="Event Projects"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              ) : (
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="shortName"
                    axisLine={false}
                    tickLine={false}
                    tickMargin={8}
                    padding={{ left: 10, right: 10 }}
                  />
                  <YAxis
                    tickFormatter={formatYAxisTick}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip />
                  <Bar
                    dataKey="bidRevenue"
                    stackId="a"
                    fill="#ff6b6b"
                    name="Bid Revenue"
                    radius={[2, 2, 0, 0]}
                  />
                  <Bar
                    dataKey="eventReqRevenue"
                    stackId="a"
                    fill="#4ecdc4"
                    name="Event Revenue"
                    radius={[2, 2, 0, 0]}
                  />
                </BarChart>
              )}
            </ResponsiveContainer>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: 3, 
            mt: 2, 
            flexWrap: 'wrap' 
          }}>
            {tab === 0 && (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 3, bgcolor: '#0099E5' }} />
                  <Typography variant="body2">Total Revenue</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 2, bgcolor: '#ff6b6b', border: '1px dashed #ff6b6b' }} />
                  <Typography variant="body2">Bid Revenue</Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box sx={{ width: 12, height: 2, bgcolor: '#4ecdc4', border: '1px dashed #4ecdc4' }} />
                  <Typography variant="body2">Event Revenue</Typography>
                </Box>
              </>
            )}
          </Box>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default RevenueStats;