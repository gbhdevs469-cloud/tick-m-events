import {
    TextField, Button, Alert, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";

export default function RejectConfirmationDialog(
    {
        actionType, handleCancelAction, rejectionReason,setRejectionReason,setErrors,errors,handleConfirmAction
    }: any) {
    return (
        <Dialog open={actionType === 'rejected'} onClose={handleCancelAction} maxWidth="sm" fullWidth>
            <DialogTitle>Confirm Rejection</DialogTitle>
            <DialogContent>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    Are you sure you want to reject this bid?
                </Alert>
                <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Reason for rejection"
                    value={rejectionReason}
                    onChange={(e) => {
                        setRejectionReason(e.target.value);
                        if (errors.rejectionReason) setErrors({ ...errors, rejectionReason: '' });
                    }}
                    error={!!errors.rejectionReason}
                    helperText={errors.rejectionReason || "Please provide a detailed reason for rejection"}
                    required
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancelAction}>Cancel</Button>
                <Button
                    onClick={handleConfirmAction}
                    color="error"
                    variant="contained"
                >
                    Confirm Rejection
                </Button>
            </DialogActions>
        </Dialog>
    )
}