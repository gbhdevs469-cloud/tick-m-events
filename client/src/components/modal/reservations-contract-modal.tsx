import {
    Button,
    Modal,
    Box,
    Typography
} from '@mui/material';
import { formatTimeTo12Hour } from 'src/hooks/formate-time';

export function ReservationsContractModal({ openModal, handleCloseModal, selectedRow }: any) {
    return (
        <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: { xs: '90%', sm: '80%', md: '60%' },
                bgcolor: 'background.paper',
                boxShadow: 24,
                p: 4,
                borderRadius: 2,
                maxHeight: '90vh',
                overflowY: 'auto'
            }}>
                <Typography fontSize={25} id="modal-modal-title" fontWeight={600} sx={{ mb: 2 }}>
                    Request Details
                </Typography>

                {selectedRow && (
                    <Box>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Event:</strong> {selectedRow.eventId?.eventName}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Organizer:</strong> {selectedRow.organizerId?.name}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1, textTransform: 'capitalize' }}>
                            <strong>Service:</strong> {selectedRow.serviceRequestId?.serviceType}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Budget:</strong> {`${selectedRow.message} XAF`}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Location:</strong> {selectedRow.eventId?.location}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Date & Time:</strong> {`${selectedRow.eventId?.date} - ${formatTimeTo12Hour(selectedRow.eventId?.time)}`}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Status: </strong>
                            <span style={{
                                textTransform: 'capitalize',
                                color: selectedRow.contractStatus === "pending" ? "#F69809" :
                                    selectedRow.contractStatus === "signed" ? "#3A86FF" :
                                        selectedRow.contractStatus === "ongoing" ? "#8338EC" : "#46B800"
                            }}>
                                {selectedRow.contractStatus}
                            </span>
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }} textTransform="capitalize">
                            <strong>Requirements:</strong> {selectedRow.orgRequirement}
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 1 }}>
                            <strong>Discussion Status:</strong> {selectedRow.discussion || 'N/A'}
                        </Typography>
                        {/* Add more details as needed */}

                        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap:2 }}>
                            <Button
                                sx={{
                                    backgroundColor: '#0B2647',
                                    color: "white",
                                    borderColor: "#0B2647",
                                    textTransform: "none",
                                    borderRadius: 1,
                                    px: 3,
                                    "&:hover": {
                                        backgroundColor: "#081c34",
                                        borderColor: "#081c34",
                                        color: "#081c34"
                                    }
                                }}
                            >
                                Accept & Generate Contract
                            </Button>
                            <Button
                                variant="contained"
                                onClick={handleCloseModal}
                                sx={{ backgroundColor: '#1F8FCD' }}
                            >
                                Close
                            </Button>
                        </Box>
                    </Box>
                )}
            </Box>
        </Modal>
    )
}