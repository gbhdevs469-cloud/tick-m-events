import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  CardContent,
  Card,
  Modal,
  Grid,
  Select,
  MenuItem
} from "@mui/material";
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'src/redux/store';
import { eventUpdate } from 'src/redux/actions/event.action';
import { fatchOrgEvents } from 'src/redux/actions/organizer/pageEvents';

interface Event {
  _id: string;
  eventName: string;
  date: string;  // ISO date string
  time: string;  // Time string in "HH:mm" format
}
interface UpdateEvent {
  _id?: string;
  date?: string;
  time?: string;
  eventName?: string;
  isDelete?: boolean;
}
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: { xs: '90%', sm: '80%', md: '60%' },
  bgcolor: '#F4F4F4',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto'
};

export function SecurityAndConfirmation() {
  // const { basicDetails } = useSelector((state: RootState) => state?.event);
  const { __events } = useSelector((state: RootState) => state?.organizer);

  const dispatch = useDispatch<AppDispatch>();
  const [openReschedule, setOpenReschedule] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [events, setEvents] = useState<Event[]>(__events || []);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(__events[0] || null);
  const [updateEvent, setUpdateEvent] = useState<UpdateEvent>({
    _id: '',
    date: '',
    time: '',
    eventName: '',
    isDelete: false
  })


  useEffect(() => {
    dispatch(fatchOrgEvents());
  }, [dispatch]);

  const handleOpenReschedule = () => setOpenReschedule(true);
  const handleCloseReschedule = () => setOpenReschedule(false);
  const handleOpenDelete = () => setOpenDelete(true);
  const handleCloseDelete = () => setOpenDelete(false);

  const handleEventChange = (event: any) => {
    const eventId = event.target.value;
    const foundEvent = events.find(e => e._id === eventId);
    setSelectedEvent(foundEvent ?? null);
  };

  const handleReschedule = async () => {
    if (!selectedEvent || !updateEvent.date || !updateEvent.time) return;

    try {
      // Prepare the updated event data
      const updatedEvent = {
        ...selectedEvent,
        date: new Date(updateEvent.date).toISOString(),
        time: updateEvent.time
      };

      // Here you would typically make an API call to update the event
      // For example:
      // await dispatch(updateEventAction(updatedEvent));

      // For now, we'll update the local state

      setEvents(events.map(event =>
        event._id === selectedEvent._id ? updatedEvent : event
      ));
      setSelectedEvent(updatedEvent);

      // Close the modal
      const result = await dispatch(eventUpdate(updatedEvent));

      if (result?.status === 200) {
        toast.success(result?.message);
        handleCloseReschedule();

      } else {
        toast.error(result?.message);
      }

      // Optionally show a success message
      // enqueueSnackbar('Event rescheduled successfully', { variant: 'success' });

    } catch (error) {
      console.error('Error rescheduling event:', error);
      // Optionally show an error message
      // enqueueSnackbar('Failed to reschedule event', { variant: 'error' });
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;

    try {
      // Optimistically update the UI first
      const remainingEvents = events.filter(event => event._id !== selectedEvent._id);
      setEvents(remainingEvents);

      if (remainingEvents.length > 0) {
        setSelectedEvent(remainingEvents[0]);
      } else {
        setSelectedEvent(null);
      }

      // Then make the API call
      const updatedEvent = {
        ...selectedEvent,
        isDelete: true
      };

      const result = await dispatch(eventUpdate(updatedEvent));

      if (result?.status !== 200) {
        // Revert if API call fails
        setEvents([...remainingEvents, selectedEvent]);
        setSelectedEvent(selectedEvent);
        toast.error(result?.message || 'Failed to delete event');
      } else {
        toast.success(result?.message);
        handleCloseDelete();
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      toast.error('Failed to delete event');
      // Revert on error
      setEvents([...events]);
      setSelectedEvent(selectedEvent);
    }
  };

  // Set modal values when opening reschedule
  useEffect(() => {
    if (openReschedule && selectedEvent) {
      setUpdateEvent({
        date: selectedEvent?.date?.split('T')[0],
        time: selectedEvent?.time
      });
    }
  }, [openReschedule, selectedEvent]);



  return (
    <>
      {
        events.length ? <Card sx={{ padding: 3, borderRadius: 3, boxShadow: 3, mt: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Security & Confirmation
            </Typography>

            <Typography variant="subtitle1" sx={{ marginBottom: 1 }}>
              Event Details
            </Typography>

            <Box sx={{ marginBottom: "20px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Select
                    value={selectedEvent?._id || ''}
                    onChange={handleEventChange}
                    sx={{
                      width: "100%",
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'black' },
                        '&:hover fieldset': { borderColor: 'black' },
                        '&.Mui-focused fieldset': { borderColor: 'black' }
                      }
                    }}
                    displayEmpty
                    inputProps={{ 'aria-label': 'Select Event' }}
                  >
                    {events.length === 0 && (
                      <MenuItem disabled value="">
                        <em>No events available</em>
                      </MenuItem>
                    )}
                    {events.map((event) => (
                      <MenuItem key={event._id} value={event._id}>
                        {event.eventName}
                      </MenuItem>
                    ))}
                  </Select>
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    name="date"
                    disabled
                    value={selectedEvent?.date ? selectedEvent.date.split('T')[0] : ''}
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'black' },
                        '&:hover fieldset': { borderColor: 'black' },
                        '&.Mui-focused fieldset': { borderColor: 'black' }
                      }
                    }}
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={3}>
                  <TextField
                    name="time"
                    disabled
                    value={selectedEvent?.time || ''}
                    type="time"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'black' },
                        '&:hover fieldset': { borderColor: 'black' },
                        '&.Mui-focused fieldset': { borderColor: 'black' }
                      }
                    }}
                  />
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: "flex", gap: "12px" }}>
              <Button
                variant="contained"
                disabled={!selectedEvent}
                sx={{ backgroundColor: "#0B2E4C", color: "white", fontWeight: "bold", borderRadius: "8px" }}
                onClick={handleOpenReschedule}
              >
                Reschedule Event
              </Button>
              <Button
                variant="contained"
                disabled={!selectedEvent}
                sx={{ backgroundColor: "#D32F2F", color: "white", fontWeight: "bold", borderRadius: "8px" }}
                onClick={handleOpenDelete}
              >
                Delete Event
              </Button>
            </Box>

            <Typography variant="caption" sx={{ display: "block", marginTop: "12px", color: "gray" }}>
              All changes saved automatically.
            </Typography>
          </CardContent>
        </Card> : null
      }


      {/* Reschedule Modal */}
      <Modal
        open={openReschedule}
        onClose={handleCloseReschedule}
        aria-labelledby="reschedule-modal-title"
        aria-describedby="reschedule-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Reschedule {selectedEvent?.eventName}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" mb={1}>
                Current Date: {selectedEvent?.date.split('T')[0]}
              </Typography>
              <Typography variant="body2" mb={1}>
                Select a new date:
              </Typography>
              <TextField
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={updateEvent.date}
                onChange={(e) => setUpdateEvent({ ...updateEvent, date: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" mb={1}>
                Current Time: {selectedEvent?.time}
              </Typography>
              <Typography variant="body2" mb={1}>
                Select a new time:
              </Typography>
              <TextField
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={updateEvent.time}
                onChange={(e) => setUpdateEvent({ ...updateEvent, time: e.target.value })}
              />
            </Grid>
          </Grid>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3} flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={handleCloseReschedule}
              sx={{
                color: '#0d2847',
                borderColor: '#0d2847',
                borderRadius: '8px',
                px: 3,
                '&:hover': { borderColor: '#0b223c' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleReschedule}
              disabled={!updateEvent.date || !updateEvent.time}
              sx={{
                bgcolor: '#0d2847',
                color: '#fff',
                borderRadius: '8px',
                px: 3,
                '&:hover': { bgcolor: '#0b223c' },
              }}
            >
              Confirm Reschedule
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={openDelete}
        onClose={handleCloseDelete}
        aria-labelledby="delete-modal-title"
        aria-describedby="delete-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            Are you sure?
          </Typography>
          <Typography variant="body2" mb={3}>
            Are you sure you want to delete {selectedEvent?.eventName}? This action is irreversible.
          </Typography>

          <Box display="flex" justifyContent="flex-end" gap={2} mt={3} flexWrap="wrap">
            <Button
              variant="outlined"
              onClick={handleCloseDelete}
              sx={{
                color: '#0d2847',
                borderColor: '#0d2847',
                borderRadius: '8px',
                px: 3,
                '&:hover': { borderColor: '#0b223c' },
              }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleDelete}
              sx={{
                bgcolor: '#D32F2F',
                color: '#fff',
                borderRadius: '8px',
                px: 3,
                '&:hover': { bgcolor: '#B71C1C' },
              }}
            >
              Yes, Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
}