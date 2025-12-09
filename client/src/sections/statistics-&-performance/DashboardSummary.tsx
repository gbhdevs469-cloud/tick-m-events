import {
  Box,
  Grid,
  Paper,
  Typography,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import { TrendingUp } from '@mui/icons-material';

export default function DashboardSummary({ performanceTrend, offerConversionRate }: any) {
  // Safely process performanceTrend data for the chart
  const getChartData = () => {
    if (!performanceTrend || !Array.isArray(performanceTrend)) {
      return [];
    }

    return performanceTrend
      .filter(item => item && typeof item === 'object')
      .map(item => ({
        name: item.monthName || `Month ${item.month}`,
        revenue: item.totalRevenue || 0,
        period: item.period || `${item.monthName} ${item.year}`
      }))
      .filter(item => item.revenue > 0); // Only show months with revenue data
  };

  const chartData = getChartData();

  const statCards = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#007BBA' }} />,
      title: 'Offer Conversion Rate',
      value: `${offerConversionRate || 0}%`,
      subtitle: 'of sent proposals accepted',
    },
  ];

  return (
    <Box
      mt={3}
      p={{ xs: 2, md: 4 }}
      sx={{
        borderRadius: '20px',
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0,0,0,0.15)',
      }}
    >
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper
            elevation={0}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backgroundColor: '#F9FAFB',
              height: '100%',
              boxShadow: 'none',
            }}
          >
            <Box
              textAlign="center"
              sx={{
                boxShadow: '0 0 10px rgba(0,0,0,0.15)',
                borderRadius: 2,
                p: 2,
                height: '100%',
                backgroundColor: '#FFFFFF',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              {statCards[0].icon}
              <Typography fontWeight={700} mt={2}>
                {statCards[0].title}
              </Typography>
              <Typography color="#007BBA" fontSize={22} fontWeight={700}>
                {statCards[0].value}
              </Typography>
              <Typography fontSize={13}>{statCards[0].subtitle}</Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper
            elevation={3}
            sx={{
              borderRadius: '14px',
              p: 2,
              height: { xs: 300, sm: 350, md: 400 },
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid #E0E0E0',
              boxShadow: '0 0 10px rgba(0,0,0,0.15)',
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" fontWeight="bold">
                Performance Trend
              </Typography>
            </Box>

            <Box sx={{ flexGrow: 1, mt: 3 }}>
              {
                chartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} />
                      <XAxis
                        dataKey="period"
                        axisLine={false}
                        tickLine={false}
                        tickMargin={8}
                        padding={{ left: 30, right: 20 }}
                      />
                      <YAxis
                        domain={[0, 80000]}
                        tickFormatter={(value) => (value === 0 ? '' : `${value / 1000} XAF`)}
                        axisLine={false}
                        tickLine={false}
                      />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="revenue"
                        stroke="#0099E5"
                        strokeWidth={3}
                        dot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="h6" gutterBottom>
                      No Data Available
                    </Typography>
                    <Typography variant="body2">
                      Revenue data will appear here once projects are completed.
                    </Typography>
                  </Box>
                )
              }

            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
