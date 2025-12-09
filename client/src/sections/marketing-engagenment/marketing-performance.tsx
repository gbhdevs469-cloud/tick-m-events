import { Box, Typography, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';

export function MarketingPerformance() {
  return (
    <Box p={3} boxShadow={3} bgcolor="white" my={3} borderRadius={3} sx={{ border: '1px solid black' }}>
      <Typography variant="h5" fontWeight="bold" mb={2}>Marketing Performance & Statistics</Typography>
      <Typography variant="body1" mb={4}>Performance Tracking Table</Typography>

      <TableContainer component={Paper} sx={{ borderRadius: '20px', overflowX: 'auto', mb: 4 }}>
        <Table sx={{ minWidth: 600 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: '#3AACE7' }}>
              {['Action', 'Participants Reached', 'Open Rate', 'Click Rate', 'Sales Conversions'].map((header, i) => (
                <TableCell
                  key={i}
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    backgroundColor: '#3AACE7',
                    ...(i === 0 && { borderTopLeftRadius: '20px', borderBottomLeftRadius: '20px' }),
                    ...(i === 4 && { borderTopRightRadius: '20px', borderBottomRightRadius: '20px', whiteSpace: 'nowrap' }),
                  }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {[
              ['24h Reminder Notification', '500', '80%', '40%', '100 tickets sold'],
              ['48h Follow-Up', '400', '-', '-', '50 tickets sold'],
            ].map((row, idx, arr) => (
              <TableRow key={idx} sx={{
                ...(idx === arr.length - 1 && {
                  '& td:first-of-type': { borderBottomLeftRadius: '20px' },
                  '& td:last-of-type': { borderBottomRightRadius: '20px' },
                })
              }}>
                {row.map((cell, i) => (
                  <TableCell key={i} sx={{ p: 1.5, border: 'none', textAlign: 'center' }}>{cell}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
