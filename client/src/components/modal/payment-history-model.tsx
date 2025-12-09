import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Grid,
} from "@mui/material";

export const PaymentHistoryModal = ({ open, onClose, rowData }: any) => (

    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
        {/* Modal Title */}
        <DialogTitle sx={{ fontWeight: "bold" }}>Payment History</DialogTitle>

        {/* Modal Content */}
        <DialogContent>
            <Grid container spacing={2}>
                <Grid item xs={6}>
                    <Typography fontWeight="bold">Date:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{rowData?.date}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography fontWeight="bold">Reference:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{rowData?.reference}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography fontWeight="bold">Amount:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{rowData?.amount}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography fontWeight="bold">Type:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{rowData?.type}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography fontWeight="bold">Payment Method:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography>{rowData?.paymentmethod}</Typography>
                </Grid>

                <Grid item xs={6}>
                    <Typography fontWeight="bold">Status:</Typography>
                </Grid>
                <Grid item xs={6}>
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            color: rowData?.status === "Approved"
                                ? "green"
                                : rowData?.status === "Pending"
                                    ? "orange"
                                    : "red",
                        }}
                    >
                        {rowData?.status}
                    </Typography>
                </Grid>
            </Grid>

            {/* Cancel Button */}
            <Box sx={{ mt: 3, textAlign: "left" }}>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        backgroundColor: "#0a2940",
                        color: "white",
                        "&:hover": { backgroundColor: "#072135" },
                    }}
                >
                    Cancel
                </Button>
            </Box>
        </DialogContent>
    </Dialog>
)
