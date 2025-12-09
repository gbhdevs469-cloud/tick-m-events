import {
    Box, Typography, Table, TableHead, TableRow, TableCell, TableBody,
    Avatar, Modal, IconButton, Divider, Chip
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { formatEventDate, formatTimeTo12Hour } from 'src/hooks/formate-time';

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', md: '70%', lg: '60%' },
    maxHeight: '90vh',
    overflowY: 'auto',
    bgcolor: 'background.paper',
    boxShadow: 24,
    borderRadius: 3,
    p: 4,
};

const getInitials = (name: string) => {
    if (!name) return 'NN';
    const names = name.split(' ');
    let initials = names[0].substring(0, 1).toUpperCase();
    if (names.length > 1) {
        initials += names[names.length - 1].substring(0, 1).toUpperCase();
    }
    return initials;
};
export function EventVerificationModal({ getStatusColor, openModal, handleCloseModal, selectedEvent }: any) {
    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="event-details-modal"
            aria-describedby="event-details-description"
        >
            <Box sx={modalStyle}>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="bold">
                        Event Details
                    </Typography>
                    <IconButton onClick={handleCloseModal}>
                        <CloseIcon />
                    </IconButton>
                </Box>

                {selectedEvent && (
                    <>
                        <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
                            {/* Left Column - Event Images */}
                            <Box flex={1}>
                                <Box mb={3}>
                                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                        Cover Image
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={selectedEvent.coverImage?.url || 'https://via.placeholder.com/400x200'}
                                        alt="Cover"
                                        sx={{ width: '100%', borderRadius: 2, maxHeight: 200, objectFit: 'cover' }}
                                    />
                                </Box>
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                        Portrait Image
                                    </Typography>
                                    <Box
                                        component="img"
                                        src={selectedEvent.portraitImage?.url || 'https://via.placeholder.com/200x300'}
                                        alt="Portrait"
                                        sx={{ width: '100%', borderRadius: 2, maxHeight: 300, objectFit: 'cover' }}
                                    />
                                </Box>
                            </Box>

                            {/* Right Column - Event Details */}
                            <Box flex={2}>
                                <Box mb={3}>
                                    <Typography variant="h6" fontWeight="bold" mb={1} textTransform="capitalize">
                                        {selectedEvent.eventName}
                                    </Typography>
                                    <Chip
                                        label={selectedEvent.status}
                                        color={getStatusColor(selectedEvent.status)}
                                        sx={{ mb: 2, textTransform: "capitalize" }}
                                    />
                                    <Typography variant="body1" mb={2} dangerouslySetInnerHTML={{ __html: selectedEvent.description }} />
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box mb={3}>
                                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                        Event Information
                                    </Typography>
                                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Date</Typography>
                                            <Typography variant="body1">{formatEventDate(selectedEvent.date)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Time</Typography>
                                            <Typography variant="body1">{formatTimeTo12Hour(selectedEvent.time)}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Location</Typography>
                                            <Typography variant="body1">{selectedEvent.location}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Format</Typography>
                                            <Typography variant="body1">{selectedEvent.format}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Tickets Available</Typography>
                                            <Typography variant="body1">{selectedEvent.ticketQuantity}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Event Type</Typography>
                                            <Typography variant="body1">{selectedEvent.eventType}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                <Box mb={3}>
                                    <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                        Organizer Information
                                    </Typography>
                                    <Box display="grid" gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={2}>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Name</Typography>
                                            <Typography variant="body1">{selectedEvent.organizer?.name || 'N/A'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Email</Typography>
                                            <Typography variant="body1">{selectedEvent.organizer?.email || 'N/A'}</Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Phone</Typography>
                                            <Typography variant="body1">{selectedEvent.organizer?.number || 'N/A'}</Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Divider sx={{ my: 2 }} />

                                {selectedEvent.tickets?.length > 0 && (
                                    <Box>
                                        <Typography variant="subtitle1" fontWeight="bold" mb={1}>
                                            Ticket Types
                                        </Typography>
                                        <Box sx={{ overflowX: 'auto' }}>
                                            <Table size="small">
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell>Type</TableCell>
                                                        <TableCell align="center">Price</TableCell>
                                                        <TableCell align="center">Quantity</TableCell>
                                                        <TableCell>Description</TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {selectedEvent.tickets[0].tickets.map((ticket: any) => (
                                                        <TableRow key={ticket._id}>
                                                            <TableCell>{ticket.ticketType}</TableCell>
                                                            <TableCell align="center" sx={{ width: "20%", textTransform: "capitalize" }}>{ticket.price}</TableCell>
                                                            <TableCell align="center">{ticket.totalTickets}</TableCell>
                                                            <TableCell align="left">
                                                                <Typography variant="body1" fontSize={10} mb={2} dangerouslySetInnerHTML={{ __html: ticket.description }} />
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </Box>
                                    </Box>
                                )}

                                <Divider sx={{ my: 2 }} />
                                <Box>
                                    <Typography variant="subtitle1" fontWeight="bold" mb={2}>
                                        Reviews
                                    </Typography>
                                    <Box sx={{ maxHeight: 300, overflowY: 'auto' }}>
                                        {selectedEvent.review.map((review: any) => (
                                            <Box key={review._id} sx={{ mb: 3, p: 2, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                                                <Box display="flex" alignItems="center" mb={1}>
                                                    <Avatar sx={{ bgcolor: '#1F8FCD', mr: 2 }}>
                                                        {getInitials(review.name)}
                                                    </Avatar>
                                                    <Box>
                                                        <Typography fontWeight="bold">{review.name}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            {new Date(review.createdAt).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                    <Chip
                                                        label={review.status}
                                                        color={review.status === 'approved' ? 'success' : 'warning'}
                                                        size="small"
                                                        sx={{ ml: 'auto' }}
                                                    />
                                                </Box>
                                                <Typography>{review.comment}</Typography>
                                                {review.rating && (
                                                    <Box mt={1}>
                                                        <Typography variant="body2">
                                                            Rating: {review.rating}/5
                                                        </Typography>
                                                    </Box>
                                                )}
                                            </Box>
                                        ))}
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                    </>
                )}
            </Box>
        </Modal>
    )
}