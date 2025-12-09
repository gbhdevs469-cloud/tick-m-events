import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Container,
  TableContainer,
} from '@mui/material';

const transactions = [
  {
    date: '02/10/2025',
    event: 'Fally Ipupa Concert',
    buyer: 'Jean M.',
    amount: '50,000 XAF',
    method: 'Mobile Money',
    status: 'Successful',
  },
  {
    date: '02/10/2025',
    event: 'Fally Ipupa Concert',
    buyer: 'Jean M.',
    amount: '50,000 XAF',
    method: 'Mobile Money',
    status: 'Pending',
  },
  {
    date: '02/10/2025',
    event: 'Fally Ipupa Concert',
    buyer: 'Jean M.',
    amount: '50,000 XAF',
    method: 'Mobile Money',
    status: 'Cancelled',
  },
];

export function PaymentMonitoringTable({ data }: any) {
  return (
    <Paper
      elevation={4}
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        Transaction & Payment Monitoring
      </Typography>

      <Box sx={{ overflowX: 'auto' }}>
        <Table sx={{ backgroundColor: '#f8f9fa', borderRadius: 2 }}>
          <TableHead>
            <TableRow>
              {['Date', 'Event', 'Buyer', 'Amount', 'Payment Method', 'Status'].map(
                (header, index, arr) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      bgcolor: '#1F8FCD',
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.95rem',
                      borderTopLeftRadius: index === 0 ? '20px' : 0,
                      borderTopRightRadius: index === arr.length - 1 ? '20px' : 0,
                    }}
                  >
                    {header}
                  </TableCell>
                )
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((tx: any, index: any) => {
              const isLastRow = index === transactions.length - 1;

              return (
                <TableRow
                  key={tx?._id}
                  sx={{
                    backgroundColor: '#EEEEEE',
                    position: 'relative',
                    '&:not(:last-child)': {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)', // Center the line
                        width: '96%', // You can adjust this to change the line length
                        borderBottom: '1px solid #C3C3C3', // The border itself
                      },
                    },
                  }}
                >
                  <TableCell
                    align="center"
                    sx={{
                      borderBottomLeftRadius: isLastRow ? '20px' : 0,
                    }}
                  >
                    {tx.createdAt}
                  </TableCell>
                  <TableCell align="center">{tx.eventId?.eventName}</TableCell>
                  <TableCell align="center">{tx.organizerId?.name}</TableCell>
                  <TableCell align="center">{tx?.feeAmount} XAF</TableCell>
                  <TableCell sx={{textTransform:"capitalize"}} align="center">{tx.paymentMethod||"Fapshi"}</TableCell>
                  <TableCell
                    align="center"
                    sx={{
                      fontWeight: 600,
                      textTransform:"capitalize",
                      borderBottomRightRadius: isLastRow ? '20px' : 0,
                      color:
                        tx.status === 'successful'
                          ? 'green'
                          : tx.status === 'pending'
                            ? 'orange'
                            : tx.status === 'failed'
                              ? 'red'
                              : tx.status === 'initiated'
                              ? 'black':'inherit',
                    }}
                  >
                    {tx.status}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
};

