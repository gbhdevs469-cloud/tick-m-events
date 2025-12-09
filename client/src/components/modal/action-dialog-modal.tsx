import React from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Grid,
    Box,
    Button
} from "@mui/material";

export default function ActionDialogModal({
    open,
    onClose,
    selectedAction,
    selectedRow
}: {
    open: boolean;
    onClose: () => void;
    selectedAction: string;
    selectedRow: any;
}) {
    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle fontWeight="bold">
                {selectedAction === "View Details" ? "EventPro" : "Transaction Details"}
            </DialogTitle>

            <DialogContent>
                {selectedAction === "View Details" && selectedRow && (
                    <Grid container spacing={1}>
                        <Grid item xs={4}><Typography fontWeight="bold">Organizer:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.organizer}</Typography></Grid>

                        <Grid item xs={4}><Typography fontWeight="bold">Service:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.requestedService}</Typography></Grid>

                        <Grid item xs={4}><Typography fontWeight="bold">Date Posted:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.date}</Typography></Grid>

                        <Grid item xs={4}><Typography fontWeight="bold">Budget:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.budget}</Typography></Grid>

                        <Grid item xs={4}><Typography fontWeight="bold">Location:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.location}</Typography></Grid>

                        <Grid item xs={4}><Typography fontWeight="bold">Preferred Date:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.preferredDate}</Typography></Grid>

                        <Grid item xs={4}><Typography fontWeight="bold">Description:</Typography></Grid>
                        <Grid item xs={8}><Typography>{selectedRow.description}</Typography></Grid>
                    </Grid>
                )}

                {selectedAction === "View Transaction" && selectedRow && (
                    <Box>
                        <Typography fontWeight="bold">Transaction ID:</Typography>
                        <Typography>{selectedRow.id}</Typography>

                        <Typography fontWeight="bold">Transaction Date and Time:</Typography>
                        <Typography>{selectedRow.datetime}</Typography>

                        <Typography fontWeight="bold">Amount to Receive:</Typography>
                        <Typography>{selectedRow.amountToReceive}</Typography>

                        <Typography fontWeight="bold">Received Amount:</Typography>
                        <Typography>{selectedRow.receivedAmount}</Typography>

                        <Typography fontWeight="bold">Payment Method Used:</Typography>
                        <Typography>{selectedRow.paymentMethod}</Typography>

                        <Typography fontWeight="bold">Commission Deducted:</Typography>
                        <Typography>{selectedRow.commission}</Typography>

                        <Typography fontWeight="bold">Payment Processing Status:</Typography>
                        <Typography>{selectedRow.status}</Typography>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ justifyContent: "flex-start", px: 3, pb: 2 }}>
                <Button variant="contained" sx={{ bgcolor: "#0B2E4C" }}>Send a Message</Button>
                <Button
                    variant="outlined"
                    sx={{
                        color: "black",
                        borderColor: "black",
                        "&:hover": {
                            borderColor: "black",
                            backgroundColor: "#f5f5f5",
                        },
                    }}
                >
                    Submit Proposal
                </Button>
            </DialogActions>
        </Dialog>
    );
}
