import { Box, Grid, Typography, Paper } from '@mui/material';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import StarRateIcon from '@mui/icons-material/StarRate';

const ProviderStats = ({ contractObtained, revenueGenerated, customerRatings }: any) => {

  const stats = [
    {
      title: 'Contracts Obtained',
      value: contractObtained || 0,
      icon: <AssignmentIcon sx={{ fontSize: 40, color: '#0099E5' }} />,
    },
    {
      title: 'Revenue Generated',
      value: `${revenueGenerated || 0} XAF`, // You can make this dynamic
      icon: <MonetizationOnIcon sx={{ fontSize: 40, color: '#0099E5' }} />,
    },
    {
      title: 'Customer Ratings',
      value: `${customerRatings || 0}/5`, // You can make this dynamic
      icon: <StarRateIcon sx={{ fontSize: 40, color: '#0099E5' }} />,
    },
  ];

  return (
    <Box sx={{ my: 4 }}>
      <Grid container spacing={3}>
        {stats?.map((stat, index) => (
          <Grid item xs={12} sm={4} key={index}>
            <Paper
              elevation={3}
              sx={{
                p: 3,
                borderRadius: '16px',
                textAlign: 'center',
                height: '100%',
                border: '1px solid #E0E0E0',
                boxShadow: '0 0 10px rgba(0,0,0,0.15)',
              }}
            >
              <Box mb={1}>{stat.icon}</Box>
              <Typography variant="h5" fontWeight="bold">
                {stat.title}
              </Typography>
              <Typography
                variant="h5"
                sx={{ color: '#0099E5', fontWeight: 'bold', mt: 1 }}
              >
                {stat.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ProviderStats;
