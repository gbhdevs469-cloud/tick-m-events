import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  IconButton,
  Box,
  Button
} from '@mui/material';
import { Close, CheckCircle, Error } from '@mui/icons-material';

export function SubscriptionModal({ open, onClose, status, message }:any) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6">
            {status === 'success' ? 'Subscription Successful' : 'Subscription Failed'}
          </Typography>
          <IconButton onClick={onClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
          {status === 'success' ? (
            <CheckCircle sx={{ fontSize: 60, color: 'success.main' }} />
          ) : (
            <Error sx={{ fontSize: 60, color: 'error.main' }} />
          )}
          <Typography variant="body1" align="center">
            {message}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};
