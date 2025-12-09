import { useState, useEffect } from 'react';
import {
  Typography, Chip, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, Button, Collapse, Box,
  Tooltip
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  KeyboardArrowDown as ExpandMoreIcon,
  KeyboardArrowUp as ExpandLessIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { editEventsFetch, deleteEvent } from 'src/redux/actions/organizer/editEventAction';
import { AppDispatch, RootState } from 'src/redux/store';
import { formatTimeTo12Hour } from 'src/hooks/formate-time';
import { Iconify } from 'src/components/iconify';
import { EditEventForm } from '../editEvent';

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

export function EditEventsView() {
  const { eventsLists } = useSelector((state: RootState) => state.editEvent);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [expandedEventId, setExpandedEventId] = useState<string | null>(null);
  const dispatch = useDispatch<AppDispatch>();
  useEffect(() => {
    dispatch(editEventsFetch());
  }, [dispatch]);

  const handleDeleteClick = (eventId: string) => {
    setSelectedEventId(eventId);
    setOpenDeleteDialog(true);
  };

  const handleDeleteConfirm = () => {
    if (selectedEventId) {
      dispatch(deleteEvent(selectedEventId));
      setOpenDeleteDialog(false);
      setSelectedEventId(null);
    }
  };

  const handleEditToggle = (eventId: string) => {
    setExpandedEventId(expandedEventId === eventId ? null : eventId);
  };

  return (
    <DashboardContent>
      <PageTitleSection title="Events Edits" />

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell align='center'>#</TableCell>
              <TableCell align='center'>Event Name</TableCell>
              <TableCell align='center'>Date</TableCell>
              <TableCell align='center'>Time</TableCell>
              <TableCell align='center'>Event Type</TableCell>
              <TableCell align='center'>Status</TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {!eventsLists || eventsLists.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 4 }}>
                  <Typography variant="body1" color="text.secondary">
                    No records found.
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              eventsLists?.map((eventData: any, index: any) => (
                <>
                  <TableRow key={eventData.event._id}>
                    <TableCell align='center'>{index + 1}</TableCell>
                    <TableCell align='center' sx={{ textTransform: "capitalize" }}>{eventData.event.eventName}</TableCell>
                    <TableCell align='center'>{eventData.event.date}</TableCell>
                    <TableCell align='center'>{formatTimeTo12Hour(eventData.event.time)}</TableCell>
                    <TableCell align='center' sx={{ textTransform: "capitalize" }}>{eventData.event.eventType}</TableCell>
                    <TableCell
                      align="center"
                      sx={{
                        textTransform: "capitalize",
                      }}
                    >
                      <Chip
                        label={eventData.event.status}
                        color={getStatusColor(eventData.event.status)}
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell align='center'>
                      <IconButton
                        onClick={() => handleEditToggle(eventData.event._id)}
                        aria-label="edit"
                      >
                        {expandedEventId === eventData.event._id ?
                          <ExpandLessIcon /> : <EditIcon />}
                      </IconButton>
                      <IconButton
                        onClick={() => handleDeleteClick(eventData.event._id)}
                        aria-label="delete"
                      >
                        <DeleteIcon color="error" />
                      </IconButton>
                      {
                        eventData.event.status === 'cancelled' && (
                          <Tooltip title={eventData?.cancelledEvent?.reason}>
                            <IconButton
                              aria-label="delete"
                            >
                              <Iconify icon="mdi:information-outline" />
                            </IconButton>
                          </Tooltip>
                        )
                      }

                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                      <Collapse
                        in={expandedEventId === eventData.event._id}
                        timeout="auto"
                        unmountOnExit
                      >
                        <Box margin={2}>
                          <EditEventForm
                            eventData={eventData}
                            onSuccess={() => {
                              setExpandedEventId(null);
                              dispatch(editEventsFetch());
                            }}
                          />
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={openDeleteDialog}
        onClose={() => setOpenDeleteDialog(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this event?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </DashboardContent>
  );
}