import {
    Typography, Box, TextField, Button, Alert, Dialog, DialogTitle,
    DialogContent, DialogActions
} from "@mui/material";

export function ConfirmAcceptanceDialog({
    actionType, handleCancelAction, selectedBid, errors,
    bidData, setAcceptedAmount, setErrors, handleConfirmAction
}: any) {
    return (
        <Dialog open={actionType === 'isOrgnizerAccepted'} onClose={handleCancelAction} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Acceptance</DialogTitle>
            <DialogContent>
                <Alert severity="info" sx={{ mb: 2 }}>
                    Are you sure you want to accept this bid?
                </Alert>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="error">
                        {
                            errors.message
                        }
                    </Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="body2" color="text.secondary">
                        Original Bid Amount: {selectedBid?.bidAmount} XAF
                    </Typography>
                </Box>
                <TextField
                    fullWidth
                    type="number"
                    label="Accepted Amount (XAF)"
                    value={bidData.bidAmount}
                    disabled
                    onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setAcceptedAmount(value ? 0 : value);
                        if (errors.acceptedAmount) setErrors({ ...errors, acceptedAmount: '' });
                    }}
                    error={!!errors.acceptedAmount}
                    helperText={errors.acceptedAmount || "Enter the final accepted amount"}
                    required
                    inputProps={{
                        min: 1,
                        max: selectedBid?.bidAmount || 0
                    }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelAction}>Cancel</Button>
                <Button
                    onClick={handleConfirmAction}
                    color="success"
                    variant="contained"
                >
                    Confirm Acceptance
                </Button>
            </DialogActions>
        </Dialog>
    )
}