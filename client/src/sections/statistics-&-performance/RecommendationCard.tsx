import { Grid, Box, Paper, Typography, Button, Stack } from '@mui/material';

const recommendations = [
  'Your response rate is 70%, improve it by replying within 2 hours.',
  'Your pricing is 15% higher than the market average, adjust it for more contracts.',
  "DJs offering a 'premium package' receive 20% more booking requests.",
];

function RecommendationCard() {
  return (
    <Paper
      elevation={3}
      sx={{
        borderRadius: '20px',
        p: 3,
        mt: 3,
        maxWidth: '100%',
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Personalized Recommendation
      </Typography>



      <Stack spacing={1.5} mb={3}>
        {recommendations.map((text, index) => (
          <Box
            key={index}
            sx={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              px: 3,
              py: 1.5,
              display: 'flex',
              alignItems: 'center', // align image & text vertically centered
              fontSize: 14,
              border: '1px solid #00000066',
            }}
          >

            <Box
              component="img"
              src="./assets/icons/dashboard/ic_check.svg"
              alt="check icon"
              sx={{ width: 20, height: 20, mr: 1 }}
            />
            <Typography variant="body2">{text}</Typography>
          </Box>
        ))}
      </Stack>

      <Grid
        item
        xs={12}
        md={6}
        lg={4}
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { md: 'flex-start' },
          justifyContent: { md: 'flex-start' },
          gap: 2,
          mt: { xs: 3, md: 3 },
        }}
      >
        <StyledActionButton>Apply a Recommendation</StyledActionButton>
        <StyledActionButton>Check Market Trends</StyledActionButton>
      </Grid>
    </Paper>
  );
};
function StyledActionButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      sx={{
        backgroundColor: '#0B2E4C',
        color: 'white',
        borderRadius: '20px',
        px: 3,
        height: 45,
        textTransform: 'none',
        width: {
          lg: '30%',
        },
        fontSize: '14px',
        '&:hover': {
          backgroundColor: '#071E33',
        },
      }}
    >
      {children}
    </Button>
  );
}

export default RecommendationCard;
