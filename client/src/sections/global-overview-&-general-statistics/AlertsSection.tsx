import { Box, Paper, Typography, Button, Stack } from '@mui/material';

const MarketData = [
  {
    Date: '03/02/2025',
    AlertType: 'Payment Issue',
    UserConcerned: 'Organizer - EvenProd',
    status: 'Active',
  },
  {
    Date: '03/02/2025',
    AlertType: 'Payment Issue',
    UserConcerned: 'Organizer - EvenProd',
    status: 'Pending',
  },
  {
    Date: '03/02/2025',
    AlertType: 'Payment Issue',
    UserConcerned: 'Organizer - EvenProd',
    status: 'urgent',
  },

  // Add more rows as needed
];

export function AlertsSection() {
  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 2.5,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
        
        mb:3
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Alerts & Quick Actions
      </Typography>

      <Paper
        elevation={3}
        sx={{
          backgroundColor: '#a6d5f2', // light blue shade similar to your screenshot
          paddingY: 2,
          paddingX: 3,
          borderRadius: 2.5,
          textAlign: 'center',
          mb: 3,
        }}
      >
        <Typography fontWeight="bold">3 new alerts to handle</Typography>
      </Paper>

      <Paper>
        <Typography variant="h6" mb={2}>
          Ongoing Alerts
        </Typography>

        <Box sx={{ overflowX: 'auto', borderRadius: 2 }}>
          <Box sx={{ minWidth: 700 }}>
            {/* Table Header */}
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr 1fr',
                backgroundColor: '#1F8FCD',
               
                color: 'white',
                py: 1.5,
                px: 2,
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              <Box>Date</Box>
              <Box>AlertType</Box>
              <Box>User Concerned</Box>
              <Box>Status</Box>
            </Box>

            {/* Scrollable Table Body */}
            <Box
              sx={{
                maxHeight: 300,
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
              {MarketData.map((item, idx) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr',
                    alignItems: 'center',
                    textAlign: 'center',
                    py: 1.5,
                    px: 2,
                    borderBottom:
                      idx !== MarketData.length - 1 ? '1px solid rgba(195, 195, 195, 1)' : 'none',
                    backgroundColor: '#f5f5f5',
                  }}
                >
                  <Box>{item.Date}</Box>
                  <Box>{item. AlertType}</Box>
                  <Box>{item.UserConcerned}</Box>
                  
                  <Box>
                    <Typography
                      sx={{
                        color:
                          item.status === 'Pending'
                            ? 'orange'
                            : item.status === 'Active'
                              ? 'green'
                              : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.status}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} mt={4} mb={3}>
          <ResponsiveActionButton>Manage a Dispute</ResponsiveActionButton>
          <ResponsiveActionButton>Analyze a Transaction</ResponsiveActionButton>
          <ResponsiveActionButton>Contact an Organizer</ResponsiveActionButton>
        </Stack>
      </Paper>
    </Box>
  );
}

function ResponsiveActionButton({ children }: { children: React.ReactNode }) {
  return (
    <Button
      fullWidth
      sx={{
        borderRadius: '20px',
        backgroundColor: '#0B2E4C',
        color: 'white',
        height: 45,
        textTransform: 'none',
        '&:hover': {
          backgroundColor: '#071E33',
        },
      }}
    >
      {children}
    </Button>
  );
}
