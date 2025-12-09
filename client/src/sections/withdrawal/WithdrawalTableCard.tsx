import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Box,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Typography,
  CircularProgress
} from '@mui/material';

import { useDispatch, useSelector } from 'react-redux';
import { getAllWithdrawals, processWithdrawalPayout } from 'src/redux/actions/transactionPaymentActions';
import { AppDispatch, RootState } from 'src/redux/store';
import { toast } from "react-toastify";
import { formatDateTimeCustom } from 'src/hooks/formate-time';

type Withdrawal = {
  _id: string;
  withdrawalId: string;
  userId: string;
  user?: string;
  amount: number;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  payment?: {
    paymentMethod: string;
    method: string; 
    details?: {
      mobileNetwork?: string;
      mobileNumber?: string;
    };
  };
};

export function WithdrawalTableCard() {
  const dispatch = useDispatch<AppDispatch>();

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const { withdrawals, loading } = useSelector((state: RootState) => state.transactions);

  useEffect(() => {
    dispatch(getAllWithdrawals());
  }, [dispatch]);


  const filteredData =
    withdrawals?.filter((row: Withdrawal) => {
      const matchesSearch =
        row.user?.toLowerCase().includes(search.toLowerCase()) ||
        String(row.amount).includes(search) ||
        row.withdrawalId?.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = status
        ? row.status.toLowerCase() === status.toLowerCase()
        : true;

      return matchesSearch && matchesStatus;
    }) || [];

  return (
    <Box display="flex">
      <Card sx={{ width: '100%' }}>
        <CardContent>
          <Box display="flex" justifyContent="space-between" mb={2} gap={2}>
            <TextField
              label="Search by User ID or Amount"
              variant="outlined"
              size="small"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={status}
                label="Status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
                <MenuItem value="approved">Approved</MenuItem>
                <MenuItem value="rejected">Rejected</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {loading ? (
            <Box display="flex" justifyContent="center" py={5}>
              <CircularProgress />
            </Box>
          ) : (

            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">ID</TableCell>
                  <TableCell align="center">Date</TableCell>
                  <TableCell align="center">User Name</TableCell>
                  <TableCell align="center">Method</TableCell>
                  <TableCell align="center">Amount</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row: Withdrawal) => (
                    <TableRow key={row._id}>
                      <TableCell align="center">{row.withdrawalId}</TableCell>
                      <TableCell align="center">{formatDateTimeCustom(row.createdAt)}</TableCell>
                      <TableCell align="center">{row.user || 'Unknown User'}</TableCell>
                      <TableCell align="center">
                        {row.payment?.method?.toUpperCase() || 'N/A'}
                      </TableCell>

                      <TableCell align="center">{row.amount} XAF</TableCell>
                      <TableCell align="center">
                        <Typography
                          color={
                            row.status === 'approved'
                              ? 'green'
                              : row.status === 'rejected'
                                ? 'red'
                                : 'orange'
                          }
                        >
                          {row.status.charAt(0).toUpperCase() + row.status.slice(1)}
                        </Typography>

                      </TableCell>
                      <TableCell align="center">
                        <button
                          type="button"
                          disabled={row.status !== 'pending'}
                          onClick={async () => {
                            try {
                              await dispatch(processWithdrawalPayout(row._id));
                              toast.success("Payout processed successfully!");
                            } catch (err) {
                              toast.error(err.message || "Failed to process payout.");
                            }
                          }}

                          style={{
                            backgroundColor:
                              row.status === 'pending' ? '#4caf50' : '#9e9e9e',
                            color: 'white',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '4px',
                            cursor: row.status === 'pending' ? 'pointer' : 'not-allowed',
                          }}
                        >
                          {row.status === 'pending' ? 'Pay Now' : 'Processed'}
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No results found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}


