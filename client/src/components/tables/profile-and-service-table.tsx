import {
    TableContainer,
    Table,
    TableRow,
    TableBody,
    Paper,
    TableHead,
    TableCell,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "@mui/material";
import { memo, useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { serviceReqDelete } from "src/redux/actions";
import { AppDispatch } from "src/redux/store";
import { HeadingCommon } from "../multiple-responsive-heading/heading";

interface ApiResult {
    status: number;
    type: string;
    message: any;
}

const ProfileAndServiceTable = ({
    headers,
    data,
    onModify,
    activeSection,
    setActiveSection
}: {
    headers: string[];
    activeSection: any;
    data: any[];
    setActiveSection: any;
    onModify: (rowData: any) => void;
}) => {
    const [editingRowId, setEditingRowId] = useState<string | null>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);

    const dispatch = useDispatch<AppDispatch>();

    const handleModifyClick = useCallback((rowData: any) => {
        setEditingRowId(rowData._id);
        setActiveSection('update');
        onModify(rowData);
    }, [onModify, setActiveSection]);

    const handleDeleteClick = useCallback((rowData: any) => {
        setSelectedRow(rowData);
        setDeleteDialogOpen(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (!selectedRow) return;

        try {
            const result = await dispatch(serviceReqDelete({ serviceId: selectedRow._id }));
            if ((result as ApiResult)?.status === 200) {
                toast.success("Service deleted successfully");
            } else {
                toast.error(result?.message || "Failed to delete service");
            }
        } catch (error) {
            toast.error("Server error");
        } finally {
            setDeleteDialogOpen(false);
            setSelectedRow(null);
        }
    }, [dispatch, selectedRow]);

    const handleCloseDeleteDialog = useCallback(() => {
        setDeleteDialogOpen(false);
        setSelectedRow(null);
    }, []);

    return (
        <>
            <TableContainer component={Paper} sx={{ mt: 3 }}>
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
                                        color: 'white',
                                    }}
                                >
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {!data?.length ? (
                            <TableRow>
                                <TableCell colSpan={headers.length} align="center" sx={{ py: 4 }}>
                                    <HeadingCommon
                                        weight={400}
                                        baseSize="15px"
                                        title="No Active services available"
                                        variant="body1"
                                        color="textSecondary"
                                    />
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((row) => (
                                <TableRow
                                    key={row._id}
                                    sx={{
                                        backgroundColor: "#EEEEEE",
                                        position: "relative",
                                        '&:not(:last-child)::after': {
                                            content: '""',
                                            position: "absolute",
                                            bottom: 0,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: "96%",
                                            borderBottom: "1px solid #C3C3C3",
                                        },
                                    }}
                                >
                                    <TableCell
                                        align="center"
                                        sx={{ fontWeight: "bold", textTransform: "capitalize", width: "35%" }}
                                    >
                                        {row.serviceType}
                                    </TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                        {row.budget}
                                    </TableCell>
                                    <TableCell align="center" sx={{ textTransform: "capitalize" }}>
                                        {row.eventLocation}
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            sx={{
                                                marginX: 0.5,
                                                color: "white",
                                                borderColor: "gray",
                                                backgroundColor: "#0B2E4C",
                                                '&:hover': {
                                                    backgroundColor: "#0A2642",
                                                    borderColor: "gray",
                                                }
                                            }}
                                            onClick={() => handleModifyClick(row)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            onClick={() => handleDeleteClick(row)}
                                            sx={{
                                                marginX: 0.5,
                                                color: "white",
                                                borderColor: "gray",
                                                backgroundColor: "#d32f2f",
                                                '&:hover': {
                                                    backgroundColor: "#b71c1c",
                                                    borderColor: "gray",
                                                }
                                            }}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCloseDeleteDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    Confirm Delete
                </DialogTitle>
                <DialogContent>


                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to delete&nbsp;
                        <span style={{ fontWeight: 'bold', color: 'black', textTransform: "capitalize" }}>{selectedRow?.serviceType}</span>&nbsp;?
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDeleteDialog} color="primary">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleConfirmDelete}
                        color="error"
                        autoFocus
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default memo(ProfileAndServiceTable);