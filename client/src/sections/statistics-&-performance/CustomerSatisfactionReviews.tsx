import { Box, Paper, Typography, Button, Stack, Grid } from '@mui/material';

const ReviewData = [
  {
    Organizer: 'Jean M.',
    Rating: '5',
    Date: '12/2/2025',
    Comment: 'Excellent DJ, great ambiance!',
  },
  {
    Organizer: 'Event Pro',
    Rating: '5',
    Date: '14/2/2025',
    Comment: 'Professional service, but a slight delay at the beginning',
  },

  // Add more rows as needed
];

export function CustomerSatisfactionReviews() {
  return (
    <Paper
      sx={{
        mt: 3,
        p: { xs: 2, sm: 3 },
        borderRadius: 2.5,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
      Customer Satisfaction & Reviews
      </Typography>

      <Box sx={{ overflowX: 'auto', borderRadius: 2 }}>
        <Box sx={{ minWidth: 700 }}>
          {/* Table Header */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr',
              backgroundColor: '#1976d2',
              color: 'white',
              alignItems: 'center',
              justifyItems: 'center',
              py: 1.5,
              px: 2,
              fontWeight: 600,
            }}
          >
            <Box>Organizer  </Box>
            <Box>Rating</Box>
            <Box>Date </Box>
            <Box>Comment</Box>
          </Box>

          {/* Scrollable Table Body */}
          <Box
            sx={{
              maxHeight: 200,
              overflowY: 'auto',
              borderTop: '1px solid #ddd',
              '&::-webkit-scrollbar': {
                width: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#0B2E4C',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
              },
            }}
          >
            {ReviewData.map((item, idx) => (
              <Box
                key={idx}
                sx={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr 1fr 1fr',
                  alignItems: 'center',
                  justifyItems: 'center',
                  py: 1.5,
                  px: 2,
                  borderBottom:
                    idx !== ReviewData.length - 1 ? '1px solid rgba(195, 195, 195, 1)' : 'none',
                  backgroundColor: '#f5f5f5',
                }}
              >
                <Box>{item.Organizer }</Box>
                <Box>{item.Rating}</Box>
                <Box>{item.Date}</Box>
                <Box>{item.Comment}</Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
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
        <StyledActionButton>View Review Details</StyledActionButton>
        <StyledActionButton>Improve My Service</StyledActionButton>
      </Grid>
      
    </Paper>
  );
}

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
