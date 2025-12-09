import {
    TableContainer, Typography, Table, TableRow, TableBody, Paper,
    TableHead, TableCell, Button, Box
} from "@mui/material";
import { useDispatch } from "react-redux";
import { useTheme } from "@mui/material/styles";
import { useCallback, useState } from "react";
import { updateAcceptProviderStatus } from "src/redux/actions/service-request";
import { AppDispatch } from "src/redux/store";
import { ServiceRequestModal } from "../modal/service-request-modal";
import { ProposalDetailsModal } from "../modal/provider-dashboard-modal";

export function HomeAndGlobalTable({
    headers,
    data,
    type,
    onApply,
    onViewDetails,
    onMarkCompleted,
}: {
    headers: string[];
    type: string;
    data: any[];
    onApply?: (row: any) => void;
    onViewDetails?: (row: any) => void;
    onMarkCompleted?: (row: any) => void;
}) {
    const dispatch = useDispatch<AppDispatch>();

    const theme = useTheme();
    const [selectedItem, setSelectedItem] = useState<any>(null);

    const [modalOpen, setModalOpen] = useState(false);

    const handleViewDetails = (row: any) => {
        console.log(row);

        setSelectedItem(row);
        setModalOpen(true);
        onViewDetails?.(row);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    const proStatusChage = useCallback(async (row: any, proStatus: string) => {
        await dispatch(updateAcceptProviderStatus(row, proStatus))
    }, [dispatch])
    return (
        <>
            <TableContainer component={Paper}>
                <Table>
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
                                        color: theme.palette.common.white,
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
                                    <Typography variant="body1" color="textSecondary">
                                        No Reqest available
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row, index) => (
                                <TableRow
                                    key={row._id || index}
                                    sx={{
                                        backgroundColor: index % 2 === 0 ? "#f5f5f5" : "#e0e0e0",
                                    }}
                                >
                                    {type === "2" ? (
                                        <>
                                            <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                                {row.serviceRequestId?.serviceType}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.eventId?.location}
                                            </TableCell>
                                            <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                                {row.eventId?.date}
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell align="center" sx={{ fontWeight: "bold", textTransform: "capitalize" }}>
                                                {row.service || row.eventId?.eventName}
                                            </TableCell>
                                            <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                                {row.organizer || row?.location || row?.client || row.organizerId?.name}
                                            </TableCell>
                                            <TableCell align="center">
                                                {row.amountDue || row.datePosted || row.dateTime || row.lastMessage || row.eventId?.date}
                                            </TableCell>
                                        </>
                                    )}


                                    {
                                        type === "2" ? null : (
                                            <TableCell align="center">
                                                <Box display="flex" alignItems="center" justifyContent="center">
                                                    <Typography variant="body2">
                                                        {`${row.orgBudget} XAF`}
                                                    </Typography>
                                                    <Typography
                                                        variant="caption"
                                                        color="text.secondary"
                                                        sx={{ ml: 0.5 }}
                                                        fontWeight={700}
                                                    >
                                                        (NB)
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                        )
                                    }
                                    {type === "1" && (
                                        <TableCell align="center" sx={{ width: "35%" }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => handleViewDetails(row)}
                                                sx={{
                                                    marginX: 0.5,
                                                    color: "white",
                                                    borderColor: "gray",
                                                    backgroundColor: "#0B2E4C"
                                                }}
                                            >
                                                View Details
                                            </Button>
                                            {row.providerHasProposed ? (
                                                <Button
                                                    onClick={() => onApply?.(row)}
                                                    variant="outlined"
                                                    size="small"
                                                    sx={{
                                                        marginX: 0.5,
                                                        color: "white",
                                                        borderColor: "gray",
                                                        backgroundColor: "#0B2E4C"
                                                    }}
                                                >
                                                    Edit
                                                </Button>
                                            ) : (
                                                <>
                                                    {
                                                        row?.providerStatus === 'accepted' && (
                                                            <Button
                                                                onClick={() => onApply?.(row)}
                                                                variant="outlined"
                                                                size="small"
                                                                sx={{
                                                                    marginX: 0.5,
                                                                    color: "white",
                                                                    borderColor: "gray",
                                                                    backgroundColor: "#0B2E4C"
                                                                }}
                                                            >
                                                                Apply
                                                            </Button>
                                                        )
                                                    }
                                                    {
                                                        row?.providerStatus === 'pending' && (
                                                            <>
                                                                <Button
                                                                    onClick={() => proStatusChage?.(row, "accepted")}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{
                                                                        marginX: 0.5,
                                                                        color: "white",
                                                                        borderColor: "gray",
                                                                        backgroundColor: "#3ab354ff"
                                                                    }}
                                                                >
                                                                    Accept
                                                                </Button>
                                                                <Button
                                                                    onClick={() => proStatusChage?.(row, 'rejected')}
                                                                    variant="outlined"
                                                                    size="small"
                                                                    sx={{
                                                                        marginX: 0.5,
                                                                        color: "white",
                                                                        borderColor: "gray",
                                                                        backgroundColor: "#a01723ff"
                                                                    }}
                                                                >
                                                                    Reject
                                                                </Button>
                                                            </>
                                                        )
                                                    }

                                                </>
                                            )}

                                        </TableCell>
                                    )}

                                    {type === "2" && (
                                        <TableCell align="center" sx={{ width: "35%" }}>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => console.log("Contact Client", row)}
                                                sx={{
                                                    marginX: 0.5,
                                                    color: "white",
                                                    borderColor: "gray",
                                                    backgroundColor: "#0B2E4C"
                                                }}
                                            >
                                                Contact Client
                                            </Button>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                onClick={() => onMarkCompleted?.(row)}
                                                disabled={new Date(row.eventId?.date) > new Date()}
                                                sx={{
                                                    marginX: 0.5,
                                                    color: "white",
                                                    borderColor: "gray",
                                                    backgroundColor: "#0B2E4C",
                                                    opacity: new Date(row.eventId?.date) > new Date() ? 0.5 : 1,
                                                    pointerEvents: new Date(row.eventId?.date) > new Date() ? "none" : "auto",
                                                }}
                                            >
                                                Mark as Completed
                                            </Button>
                                        </TableCell>
                                    )}


                                </TableRow>
                            ))
                        )
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <ProposalDetailsModal
                open={modalOpen}
                onClose={() => setModalOpen(false)}
                data={selectedItem}
                title="Proposal Information"
            />
        </>
    );
}
