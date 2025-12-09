import {
  Typography,
  Paper,
  Grid,
  Box,
} from '@mui/material';
import { formatRevenue } from 'src/hooks/format-revenu';

export function TicketingStatistics({ statistics }: any) {
  const card = [
    {
      name: "Total Sales",
      value: formatRevenue(statistics?.totalSales) || "0 XAF"
    },
    {
      name: "Pending Payments",
      value: formatRevenue(statistics?.pendingPayment) || "0 XAF"
    },
    {
      name: "Approved Refunds",
      value: formatRevenue(statistics?.totalApprovedRefundAmount) || "0 XAF"
    },
    {
      name: "Commission on Ticketing Activities",
      value: formatRevenue(statistics?.commitionTicketActivity) || "0 XAF"
    },
    {
      name: "Commission on Marketplace Activities",
      value: formatRevenue(statistics?.totalCommission) || "0 XAF"
    }
  ]
  return (
    <Paper elevation={3} sx={{ boxShadow: 3 }}>
      <Grid container spacing={3} p={3} justifyContent="center">
        {
          card?.map((__i, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Box display="flex" justifyContent="center">
                <Paper sx={{
                  p: 3,
                  bgcolor: '#cce7f9',
                  borderRadius: 2,
                  textAlign: 'center',
                  width: '100%',
                  maxWidth: 280
                }}>
                  <Typography variant="subtitle1" fontSize={14} textTransform="capitalize">
                    {__i.name}
                  </Typography>
                  <Typography variant="subtitle1" fontSize={12} fontWeight="bold" textTransform="capitalize">
                    {__i.value}
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          ))
        }
      </Grid>
    </Paper>
  )
}