import React, { useState, useCallback } from 'react';
import {
  Box, Typography, Paper, Table, TableHead, TableRow, TableCell, TableBody,
  Button, Select, MenuItem, FormControl, InputLabel, Stack, Chip, TextField, Modal
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/redux/store';
import { EventVerificationModal } from 'src/components/modal/event-verification';
import { updateEventStatus } from 'src/redux/actions/event.action';


const headers = ['Event', 'Organizer', 'Date', 'Tickets Available', 'Status', 'Actions'];

const EventManagementTable: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { fullData } = useSelector((state: RootState) => state?.event);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [eventToCancel, setEventToCancel] = useState(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  const handleApprove = async (event: any, status: any) => {
    setIsLoading(true);
    setError(null);

    try {
      await dispatch(updateEventStatus(event?._id, status));
      setSuccess(true);
      // You might want to refresh the event data or show a success message
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };
  const filteredEvents = statusFilter ? fullData.filter((e: any) => e.status === statusFilter) : fullData;

  const handleOpenModal = (event: any) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };
  const handleOpenCancelModal = (event: any) => {
    setSelectedEvent(event);
    setIsCancelModalOpen(true);
  };

  const handleCloseCancelModal = () => {
    setIsCancelModalOpen(false);
  };
  const handleCancelSuccess = () => {
    // refresh data or show success message
  };
  return (
    <>
      <Paper elevation={4} sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          Event Management & Moderation
        </Typography>

        <FormControl fullWidth size="small" sx={{ mb: 2 }}>
          <InputLabel sx={{ color: 'black' }}>Filter by status</InputLabel>
          <Select
            value={statusFilter}
            label="Filter by status"
            onChange={(e) => setStatusFilter(e.target.value)}
            IconComponent={ExpandMoreIcon}
            sx={{
              color: 'black',
              '& .MuiSelect-icon': {
                color: 'black',
              },
            }}
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="approved">Approved</MenuItem>
            <MenuItem value="cancelled">Cancelled</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ overflowX: 'auto' }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell
                    key={header}
                    align="center"
                    sx={{
                      bgcolor: '#1F8FCD',
                      fontWeight: 'bold',
                      fontSize: { xs: '0.8rem', sm: '1rem' },
                      color: 'white',
                      borderTopLeftRadius: index === 0 ? '20px' : 0,
                      borderTopRightRadius: index === headers.length - 1 ? '20px' : 0,
                    }}
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredEvents.length === 0 ? (
                <TableRow
                  sx={{
                    backgroundColor: '#EEEEEE',
                    position: 'relative',
                    '&:not(:last-child)': {
                      '&::after': {
                        content: '""',
                        position: 'absolute',
                        bottom: 0,
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '96%',
                        borderBottom: '1px solid #C3C3C3',
                      },
                    },
                  }}
                >
                  <TableCell
                    colSpan={headers.length}
                    align="center"
                    sx={{
                      py: 2,
                      fontWeight: 500,
                      color: 'Black',
                      borderBottomLeftRadius: '20px',
                      borderBottomRightRadius: '20px',
                    }}
                  >
                    No events{statusFilter ? ` with status: ${statusFilter}` : ''}
                  </TableCell>
                </TableRow>
              ) : (
                filteredEvents.map((event: any, index: any) => {
                  const isLastRow = index === filteredEvents.length - 1;
                  return (
                    <TableRow
                      key={event._id}
                      sx={{
                        backgroundColor: '#EEEEEE',
                        position: 'relative',
                        '&:not(:last-child)': {
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            bottom: 0,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: '96%',
                            borderBottom: '1px solid #C3C3C3',
                          },
                        },
                      }}
                    >
                      <TableCell
                        align="center"
                        sx={{
                          textTransform: "capitalize",
                          borderBottomLeftRadius: isLastRow ? '20px' : 0,
                        }}
                      >
                        {event.eventName}
                      </TableCell>
                      <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                        {event.organizer?.name || 'N/A'}
                      </TableCell>
                      <TableCell align="center">
                        {new Date(event.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell align="center">
                        {event.ticketQuantity}
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          textTransform: "capitalize",
                        }}
                      >
                        <Chip
                          label={event.status}
                          color={getStatusColor(event.status)}
                          variant="outlined"
                        />
                      </TableCell>
                      <TableCell
                        align="center"
                        sx={{
                          borderBottomRightRadius: isLastRow ? '20px' : 0,
                          width: "33%"
                        }}
                      >
                        <Stack
                          direction={{ xs: 'column', sm: 'row' }}
                          spacing={1}
                          justifyContent="center"
                          alignItems="center"
                        >
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenModal(event)}
                            sx={{
                              bgcolor: '#0e2a47',
                              '&:hover': { bgcolor: 'primary' },
                              width: { xs: '100%', sm: 'auto' },
                            }}
                          >
                            View
                          </Button>
                          <Box>
                            <Button
                              size="small"
                              variant="contained"
                              color="primary"
                              onClick={() => handleApprove(event, 'approved')}
                              disabled={event.status === 'approved' || event.status === 'cancelled'}
                            >
                              {isLoading ? 'Processing...' : 'Approved!'}
                            </Button>
                            {error && <p style={{ color: 'red' }}>{error}</p>}
                          </Box>
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleOpenCancelModal(event)}

                            disabled={event.status === 'approved' || event.status === 'cancelled'}
                            sx={{
                              bgcolor: 'red',
                              '&:hover': { bgcolor: 'orange' },
                              width: { xs: '100%', sm: 'auto' },
                            }}
                          >
                            Cancel
                          </Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Box>
      </Paper >

      {/* Event Details Modal */}
      < EventVerificationModal
        openModal={openModal}
        handleCloseModal={handleCloseModal}
        selectedEvent={selectedEvent}
        getStatusColor={getStatusColor}
      />
      <CancellationModal
        open={isCancelModalOpen}
        onClose={handleCloseCancelModal}
        selectedEvent={selectedEvent}
        onCancelSuccess={handleCancelSuccess}
      />
    </>
  );
};

export default EventManagementTable;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
};
const CancellationModal = ({
  open,
  onClose,
  selectedEvent,
  onCancelSuccess
}: any) => {
  const [reason, setReason] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (event: any) => {
    event.preventDefault();

    setIsLoading(true);
    setError(null);
    if (!reason.trim()) {
      alert('Please enter a cancellation reason');
      setIsLoading(false);
      return;
    }
    try {
      await dispatch(updateEventStatus(selectedEvent?._id, 'cancelled', reason));
      setReason('');
      onClose();
      onCancelSuccess?.(); // notify parent of successful cancellation
    } catch (err) {
      setError(err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, reason, selectedEvent, onClose, onCancelSuccess]);

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <form onSubmit={handleSubmit}>
          <Typography variant="h6" gutterBottom>
            Cancel Event
          </Typography>
          <Typography variant="body1" mb={2}>
            Please provide a reason for cancelling this event:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            required
            name='reason'
            variant="outlined"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter cancellation reason..."
          />
          {error && (
            <Typography color="error" mt={2}>
              {error}
            </Typography>
          )}
          <Stack direction="row" spacing={2} mt={3} justifyContent="flex-end">
            <Button variant="outlined" onClick={onClose} disabled={isLoading}>
              Back
            </Button>
            <Button
              variant="contained"
              color="error"
              type="submit"
              disabled={isLoading || !reason.trim()}
            >
              {isLoading ? 'Processing...' : 'Confirm Cancellation'}
            </Button>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
};