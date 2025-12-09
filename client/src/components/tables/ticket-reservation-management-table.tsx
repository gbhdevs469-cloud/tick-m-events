import {
    TableContainer, Typography, CircularProgress, Table, TableRow, TableBody, Paper, TableHead,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Alert, TableCell, Button, TextField, Box
} from "@mui/material";
import { useCallback, useState } from "react";
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';
import { useDispatch } from "react-redux";
import { AppDispatch } from "src/redux/store";
import { updateTicketType } from "src/redux/actions/ticket-&-reservation-management.action";
import { formatEventDate } from "src/hooks/formate-time";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";
import axios from "../../redux/helper/axios";

interface ApiResult {
    status: number;
    type: string;
    message: any;
}

export function TicketReservationManagementTable({
    headers,
    data,
    type,
    selectedEvent
}: any) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editedData, setEditedData] = useState<any>({});
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'approve' | 'deny' | null>(null);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [adminNotes, setAdminNotes] = useState('');

    const handleEditClick = (row: any) => {
        setEditingId(row._id);
        setEditedData({
            _id: row._id,
            price: row.price,
            quantity: row.quantity,
            ticketDescription: row.ticketDescription
        });
    };

    const handleFieldChange = (field: string, value: string) => {
        setEditedData({
            ...editedData,
            [field]: value
        });
    };

    const handleApplyClick = async () => {
        try {
            const result = await dispatch(updateTicketType({ editedData }));
            if ((result as ApiResult)?.status === 200) {

                toast.success(result.message);

                setEditingId(null);
                setEditedData({});
            }
        } catch (error) {
            toast.error(error.message);
        }
        // Reset editing state

    };

    const handleApproveDeny = useCallback((row: any, action: 'approve' | 'deny') => {
        setSelectedRow(row);
        setModalType(action);
        setModalOpen(true);

        // Reset admin notes when opening modal
        if (action === 'deny') {
            setAdminNotes('');
        }
    }, []);

    const handleConfirmAction = async () => {
        if (!selectedRow || !modalType) return;

        setLoading(true);
        try {
            const payload = {
                status: modalType === 'approve' ? 'processed' : 'denied',
                ...(modalType === 'deny' && { adminNotes })
            };

            // Call your API here
            const response = await updateRefundStatus(selectedRow._id, payload);

            if (response.status === 200) {
                toast.success(`Refund request ${modalType === 'approve' ? 'approved' : 'denied'} successfully`);
                dispatch(fatchOrgEvents())
            }
        } catch (error) {
            toast.error('An error occurred while processing the request');
        } finally {
            setLoading(false);
            handleCloseModal();
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setModalType(null);
        setSelectedRow(null);
        setAdminNotes('');
    };

    // API call function (replace with your actual API call)
    const updateRefundStatus = async (refundId: string, payload: any) => {
        // Replace this with your actual API endpoint
        const response = await axios.put(`/refund-request/${refundId}/action`, payload);

        return response

    };

    const getModalTitle = () => {
        if (modalType === 'approve') return 'Approve Refund Request';
        if (modalType === 'deny') return 'Deny Refund Request';
        return '';
    };

    const getModalContent = () => {
        if (!selectedRow) return null;

        if (modalType === 'approve') {
            return (
                <Box>
                    <Alert severity="warning" sx={{ mb: 2 }}>
                        Are you sure you want to approve this refund request?
                    </Alert>
                    <Typography variant="body1">
                        This action will approve the refund request for:
                    </Typography>
                    <Box sx={{ mt: 1, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="body2">
                            <strong>User:</strong> {selectedRow.userId?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                            <strong>Amount:</strong> {selectedRow.refundAmount || '0'} XAF
                        </Typography>
                        <Typography variant="body2">
                            <strong>Reason:</strong> {selectedRow.reason || 'No reason provided'}
                        </Typography>
                    </Box>
                </Box>
            );
        }

        if (modalType === 'deny') {
            return (
                <Box>
                    <Alert severity="error" sx={{ mb: 2 }}>
                        Are you sure you want to deny this refund request?
                    </Alert>
                    <Typography variant="body1" sx={{ mb: 2 }}>
                        Please provide a reason for denying this refund request:
                    </Typography>
                    <TextField
                        fullWidth
                        multiline
                        rows={4}
                        label="Admin Notes"
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        placeholder="Enter the reason for denying this refund request..."
                        required
                        error={!adminNotes.trim()}
                        helperText={!adminNotes.trim() ? "Admin notes are required when denying a refund request" : ""}
                    />
                    <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
                        <Typography variant="body2">
                            <strong>Request Details:</strong>
                        </Typography>
                        <Typography variant="body2">
                            User: {selectedRow.userId?.name || 'N/A'}
                        </Typography>
                        <Typography variant="body2">
                            Amount: {selectedRow.refundAmount || '0'} XAF
                        </Typography>
                    </Box>
                </Box>
            );
        }

        return null;
    };
    console.log('==<', data)

    return (
        <>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {headers.map((header: any) => (
                                <TableCell
                                    key={header}
                                    align="center"
                                    sx={{
                                        bgcolor: "#1F8FCD",
                                        fontWeight: "bold",
                                        fontSize: { xs: "0.8rem", sm: "1rem" },
                                        color: 'white',
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!data || data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center" sx={{ py: 4 }}>
                                    <Typography variant="body1" color="text.secondary">
                                        No records found.
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data?.map((row: any, index: any) => (

                                <TableRow key={row._id} sx={{ backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0" }}>
                                    {
                                        type === '4' ? <TableCell align="center" sx={{ fontWeight: "bold", textTransform: 'capitalize' }}>
                                            #{row?.orderId?.transactionId}
                                        </TableCell>
                                            : <TableCell align="center" sx={{ fontWeight: "bold", textTransform: 'capitalize' }}>
                                                {row.name || row.userId.name}
                                            </TableCell>
                                    }

                                    {
                                        type === "4" ? <TableCell align="center">
                                            {row.userId.name}
                                        </TableCell> : type !== "3" ? (
                                            <TableCell align="center" >
                                                {editingId === row._id ? (
                                                    <TextField
                                                        value={editedData.price}
                                                        onChange={(e) => handleFieldChange('price', e.target.value)}
                                                        sx={{ width: '100px' }}
                                                        size="small"
                                                    />
                                                ) : (
                                                    <span style={{ textTransform: row.price ? 'uppercase' : 'capitalize' }}>

                                                        {selectedEvent === 'paid' ?
                                                            (row.price || 'Free') :
                                                            (row.email || row.price==="0"?"Free":row.price)}
                                                    </span>
                                                )}
                                            </TableCell>
                                        ) : null
                                    }

                                    {
                                        type === "3" || type === "4" ? (
                                            <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                                {row.tickets && row.tickets.length > 0
                                                    ? row.tickets
                                                        .map((t: any) => t.ticketType)
                                                        .join(" | ")
                                                    : "-"}
                                            </TableCell>
                                        ) : <TableCell align="center" >
                                            {editingId === row._id ? (
                                                <TextField
                                                    value={editedData.quantity}
                                                    onChange={(e) => handleFieldChange('quantity', e.target.value)}
                                                    sx={{ width: '100px' }}
                                                    size="small"
                                                />
                                            ) : (
                                                <span style={{ textTransform: 'capitalize' }}>
                                                    {row.quantity > 5000 ? 'Unlimited' : (row.quantity || row.reservationTicketType)}
                                                </span>
                                            )}
                                        </TableCell>
                                    }


                                    {
                                        type === '3' || type === "4" ?
                                            <TableCell align="center">{formatEventDate(row.createdAt)}</TableCell> : <TableCell align="center" >
                                                {editingId === row._id ? (
                                                    <TextField
                                                        value={editedData.ticketDescription}
                                                        onChange={(e) => handleFieldChange('ticketDescription', e.target.value)}
                                                        multiline
                                                        rows={3}
                                                        sx={{ width: '200px' }}
                                                        size="small"
                                                    />
                                                ) : (
                                                    type === "1" ? ReactHtmlParser(row?.ticketDescription) :
                                                        type === '3' || type === '4' ?
                                                            row.purchaseDate : row.quantity === "Unlimited" ?
                                                                row.quantity : parseInt(row.quantity, 10) - parseInt(row.sold || 0, 10)
                                                )}
                                            </TableCell>
                                    }
                                    {/* totalAmount */}
                                    {
                                        type === '4' ? <TableCell align="center">{`${row.refundAmount} XAF`}</TableCell> : null
                                    }

                                    {

                                        type === "3" || type === "4" ?
                                            <TableCell align="center" sx={{ textTransform: "capitalize" }} >{row?.paymentStatus || row?.orderId?.paymentStatus}</TableCell>
                                            :
                                            <TableCell align="center" >
                                                {type === "3" ?
                                                    row.reservationStatus : type === "1" ? row.quantity === "Unlimited" ?
                                                        row.quantity : parseInt(row.quantity, 10) - parseInt(row.sold || 0, 10) :
                                                        `${row.sold === undefined ? 0 : row.sold}` || 0}
                                            </TableCell>
                                    }

                                    {type === "3" || type === '4' ? null : <TableCell align="center">
                                        {
                                            type === "1" ? editingId === row._id ? (
                                                <Button
                                                    variant="contained"
                                                    onClick={handleApplyClick}
                                                    sx={{
                                                        backgroundColor: '#4CAF50',
                                                        color: 'white',
                                                        "&:hover": {
                                                            backgroundColor: "#388E3C"
                                                        },
                                                        fontSize: { xs: "0.7rem", sm: "1rem" },
                                                        width: { xs: "100%", sm: "auto" },
                                                    }}
                                                >
                                                    Apply
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleEditClick(row)}
                                                    sx={{
                                                        backgroundColor: '#0B2E4E',
                                                        color: 'white',
                                                        "&:hover": {
                                                            backgroundColor: "#0b243d"
                                                        },
                                                        fontSize: { xs: "0.7rem", sm: "1rem" },
                                                        width: { xs: "100%", sm: "auto" },
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            ) : <span>
                                                {selectedEvent === "free"
                                                    ? 'FREE'
                                                    : `${parseInt(row.price, 10) * parseInt(row.sold || 0, 10)} XAF`
                                                }
                                            </span>
                                        }
                                    </TableCell>}
                                    {/* Actions column */}
                                    {type === "4" && (
                                        <TableCell align="center">
                                            <Box sx={{
                                                display: 'flex',
                                                gap: 1,
                                                justifyContent: 'center',
                                                alignItems: 'center'
                                            }}>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleApproveDeny(row, 'approve')}
                                                    disabled={row.refundStatus !== 'pending'}
                                                    sx={{
                                                        backgroundColor: '#0B2E4E',
                                                        color: 'white',
                                                        "&:hover": {
                                                            backgroundColor: "#0b243d"
                                                        },
                                                        fontSize: { xs: "0.65rem", sm: "0.8rem" },
                                                        padding: { xs: "4px 8px", sm: "6px 12px" },
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    Approve
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    onClick={() => handleApproveDeny(row, 'deny')}
                                                    disabled={row.refundStatus !== 'pending'}
                                                    sx={{
                                                        backgroundColor: 'red',
                                                        color: 'white',
                                                        "&:hover": {
                                                            backgroundColor: "darkred"
                                                        },
                                                        fontSize: { xs: "0.65rem", sm: "0.8rem" },
                                                        padding: { xs: "4px 8px", sm: "6px 12px" },
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    Deny
                                                </Button>
                                            </Box>
                                            {row.refundStatus !== 'pending' && (
                                                <Typography
                                                    variant="caption"
                                                    color="text.secondary"
                                                    sx={{ display: 'block', mt: 0.5 }}
                                                >
                                                    {row.refundStatus.charAt(0).toUpperCase() + row.refundStatus.slice(1)}
                                                </Typography>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer >

            {/* Confirmation Modal */}
            <Dialog
                open={modalOpen}
                onClose={handleCloseModal}
                maxWidth="sm"
                fullWidth
            >
                <DialogTitle>
                    {getModalTitle()}
                </DialogTitle>
                <DialogContent>
                    {getModalContent()}
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={handleCloseModal}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmAction}
                        disabled={
                            loading ||
                            (modalType === 'deny' && !adminNotes.trim())
                        }
                        variant="contained"
                        color={modalType === 'approve' ? 'success' : 'error'}
                        startIcon={loading && <CircularProgress size={16} />}
                    >
                        {loading ? 'Processing...' : `Confirm ${modalType === 'approve' ? 'Approve' : 'Deny'}`}
                    </Button>
                </DialogActions>
            </Dialog>

        </>
    );
}

function renderCellContent(row: any, header: string) {
    switch (header.toLowerCase()) {
        case 'user':
            return row.userId?.name || 'N/A';
        case 'event':
            return row.eventId?.title || 'N/A';
        case 'amount':
            return `$${row.refundAmount || '0'}`;
        case 'status':
            return (
                <Typography
                    sx={{
                        color: getStatusColor(row.refundStatus),
                        fontWeight: 'bold',
                        textTransform: 'capitalize'
                    }}
                >
                    {row.refundStatus}
                </Typography>
            );
        case 'date':
            return formatEventDate(row.createdAt);
        case 'reason':
            return row.reason || 'No reason provided';
        default:
            return row[header] || 'N/A';
    }
}

// Helper function to get status color
function getStatusColor(status: string) {
    switch (status) {
        case 'approved':
            return 'green';
        case 'rejected':
            return 'red';
        case 'pending':
            return 'orange';
        case 'refunded':
            return 'blue';
        case 'cancelled':
            return 'gray';
        default:
            return 'black';
    }
}