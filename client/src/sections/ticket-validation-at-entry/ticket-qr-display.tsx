import {
    Card,
    Divider,
    Box,
    Button,
    Grid,
    Modal,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TableHead
} from "@mui/material";
import { useState } from "react";
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import EventIcon from '@mui/icons-material/Event';
import Chip from '@mui/material/Chip';
import { HeadingCommon } from "src/components/multiple-responsive-heading/heading";

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: { xs: '90%', sm: '80%', md: '600px' },
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: '12px',
    maxHeight: '90vh',
    overflow: 'auto'
};

const headers = ["#", "Type", "Quantity", "UnitPrice", "Total"]
export function TicketQRDisplay({ selectedOrder }: any) {
    const [isHovered, setIsHovered] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const shareOnWhatsApp = (ticketCode: string, qrCodeUrl: string) => {
        const message = `Here's my ticket for the event:\n\nTicket Code: ${ticketCode}`;
        const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
        window.open(url, '_blank');
    };

    return (
        <Grid item xs={12} md={6} sx={{ display: "flex" }}>
            <Card sx={{
                p: 2,
                borderRadius: "12px",
                width: "100%",
                boxShadow: 3,
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100%'
            }}>
                <HeadingCommon variant="body1" title="Ticket QR Code Display" weight={600} />
                <HeadingCommon variant="body2" color="text.secondary" title="Please keep your QR code visible for quick scanning." weight={600} baseSize="16px" />


                <Divider sx={{ border: "1px solid #C3C3C3" }} />

                {selectedOrder ? (
                    <>
                        {/* QR Code Section */}
                        <Box
                            sx={{
                                flex: 1,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                textAlign: 'center',
                                my: 3
                            }}
                        >
                            <HeadingCommon variant="body1" title="Your Ticket" weight={600} />
                            <Box
                                onMouseEnter={() => setIsHovered(true)}
                                onMouseLeave={() => setIsHovered(false)}
                                sx={{
                                    transition: 'transform 0.3s ease',
                                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                                    cursor: 'pointer'
                                }}
                            >
                                <img
                                    src={selectedOrder.qrCode}
                                    alt={`QR Code for order ${selectedOrder.ticketCode}`}
                                    loading="lazy"
                                    style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        transition: 'transform 0.3s ease'
                                    }}
                                />
                            </Box>
                            <HeadingCommon variant="body1" title={`Ticket ID: ${selectedOrder.ticketCode}`} baseSize="16px" weight={600} />
                        </Box>

                        {/* Buttons */}
                        <Box mt={2} display="flex" gap={1} justifyContent="center">
                            <Button
                                variant="outlined"
                                onClick={() => shareOnWhatsApp(selectedOrder.ticketCode, selectedOrder.qrCode)}
                                sx={{
                                    fontWeight: 500,
                                    color: "#0B2E4C",
                                    borderColor: "#0B2E4C",
                                    fontSize: { xs: "12px", sm: "14px", md: "16px" }
                                }}
                            >
                                Share My Ticket
                            </Button>
                            <Button
                                variant="outlined"
                                onClick={handleOpenModal}
                                sx={{
                                    color: "#0B2E4C",
                                    borderColor: "#0B2E4C",
                                    fontWeight: 500,
                                    fontSize: { xs: "12px", sm: "14px", md: "16px" }
                                }}
                            >
                                View Ticket Details
                            </Button>
                        </Box>

                        {/* Ticket Details Modal */}
                        <Modal
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="ticket-details-modal"
                            aria-describedby="ticket-details-description"
                        >
                            <Box sx={modalStyle}>
                                <Box mt={3} display="flex" justifyContent="flex-end">
                                    <Button
                                        onClick={handleCloseModal}
                                        variant="contained"
                                        sx={{
                                            backgroundColor: "#0B2E4C",
                                            '&:hover': {
                                                backgroundColor: "#0A2647"
                                            }
                                        }}
                                    >
                                        Close
                                    </Button>
                                </Box>
                                <HeadingCommon variant="h2" title="Ticket Details" mb={2} weight={600} />

                                <Paper elevation={3} sx={{
                                    p: 3,
                                    mb: 3,
                                    borderRadius: '12px',
                                    background: 'linear-gradient(to right, #f5f7fa, #e4e8f0)'
                                }}>
                                    <Box display="flex" alignItems="center" mb={2}>
                                        <ReceiptLongIcon color="primary" sx={{ mr: 1, fontSize: '28px' }} />
                                        <HeadingCommon variant="h6" color="primary" title="Order Summary" weight={600} />
                                    </Box>

                                    <TableContainer>
                                        <Table size="small" sx={{
                                            '& .MuiTableCell-root': {
                                                borderBottom: 'none',
                                                py: 1.5
                                            }
                                        }}>
                                            <TableBody>
                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600, width: '40%' }}>Ticket Code</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={selectedOrder.ticketCode}
                                                            size="small"
                                                            color="info"
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Transaction ID</TableCell>
                                                    <TableCell sx={{ fontFamily: 'monospace' }}>{selectedOrder.transactionId}</TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Payment Status</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={selectedOrder.paymentStatus.toUpperCase()}
                                                            size="small"
                                                            color={selectedOrder.paymentStatus === 'pending' ? 'warning' : 'success'}
                                                            sx={{
                                                                fontWeight: 600,
                                                                textTransform: 'uppercase'
                                                            }}
                                                        />
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Payment Method</TableCell>
                                                    <TableCell sx={{ textTransform: 'capitalize' }}>
                                                        {selectedOrder.paymentMethod}
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Total Amount</TableCell>
                                                    <TableCell sx={{ fontWeight: 700, color: 'primary.main' }}>
                                                        {selectedOrder.totalAmount} XAF
                                                    </TableCell>
                                                </TableRow>

                                                <TableRow>
                                                    <TableCell sx={{ fontWeight: 600 }}>Order Date</TableCell>
                                                    <TableCell>
                                                        <Box display="flex" alignItems="center">
                                                            <EventIcon color="action" sx={{ mr: 1, fontSize: '18px' }} />
                                                            {new Date(selectedOrder.createdAt).toLocaleString('en-IN', {
                                                                day: 'numeric',
                                                                month: 'short',
                                                                year: 'numeric',
                                                                hour: '2-digit',
                                                                minute: '2-digit'
                                                            })}
                                                        </Box>
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>

                                    {/* <Box mt={2} display="flex" justifyContent="flex-end">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            startIcon={<ReceiptIcon />}
                                            sx={{ textTransform: 'none' }}
                                        >
                                            Download Invoice
                                        </Button>
                                    </Box> */}
                                </Paper>

                                <Paper elevation={0} sx={{ p: 2 }}>
                                    <HeadingCommon variant="subtitle1" mb={1} title="Ticket Information" weight={600} />

                                    {selectedOrder?.tickets.map((ticket: any, index: any) => (
                                        <Box key={index} mb={3}>
                                            <TableContainer component={Paper} sx={{ mb: 3 }}>
                                                <Table size="small" aria-label="ticket details">
                                                    <TableHead>
                                                        <TableRow>
                                                            {headers.map((header) => (
                                                                <TableCell
                                                                    key={header}
                                                                    align="center"
                                                                    sx={{
                                                                        bgcolor: "#1F8FCD",
                                                                        fontWeight: "bold",
                                                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                                                        color: "white",
                                                                    }}
                                                                >
                                                                    {header}
                                                                </TableCell>
                                                            ))}
                                                        </TableRow>
                                                    </TableHead>
                                                    <TableBody>
                                                        <TableRow>
                                                            <TableCell sx={{ textTransform: "capitalize", verticalAlign: 'middle', textAlign: 'center', fontWeight: 600, align: "center" }}>
                                                                {index + 1}
                                                            </TableCell>
                                                            <TableCell sx={{ textTransform: "capitalize", verticalAlign: 'middle', textAlign: 'center', fontWeight: 600, align: "center" }}>
                                                                {ticket.ticketType}
                                                            </TableCell>
                                                            <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center', fontWeight: 600, align: "center" }}>
                                                                {ticket.quantity}
                                                            </TableCell>
                                                            <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center', fontWeight: 600, align: "center" }}>
                                                                {ticket.unitPrice} XAF
                                                            </TableCell>
                                                            <TableCell sx={{ verticalAlign: 'middle', textAlign: 'center', fontWeight: 600, align: "center" }}>
                                                                {ticket.quantity * ticket.unitPrice} XAF
                                                            </TableCell>
                                                        </TableRow>
                                                    </TableBody>
                                                </Table>
                                            </TableContainer>
                                        </Box>
                                    ))}
                                </Paper>


                            </Box>
                        </Modal>
                    </>
                ) : (
                    <Box
                        sx={{
                            flex: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            textAlign: 'center',
                            color: 'text.secondary',
                            my: 3
                        }}
                    >
                        <HeadingCommon variant="body1" title="Please select an event and order to display the ticket QR code" color="text.secondary" weight={600} baseSize="14px" />
                    </Box>
                )}
            </Card>
        </Grid>
    );
}