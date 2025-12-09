import {
  Dialog, DialogTitle, DialogContent,
  DialogActions, Button, Typography, useTheme
} from '@mui/material';

interface ConfirmActionModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
}

export default function ConfirmActionModal({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  description = "Are you sure you want to perform this action?",
}: ConfirmActionModalProps) {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="confirm-action-dialog"
      aria-describedby="confirm-action-description"
      PaperProps={{
        sx: {
          backgroundColor: '#fff',
          borderRadius: 2,
          padding: 2,
          minWidth: 320,
          boxShadow: 'none', // ⛔ Remove box shadow
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(6px)', // 💫 Smooth background blur
          backgroundColor: 'rgba(0, 0, 0, 0.3)', // Slight dimming
        }
      }}
    >
      <DialogTitle id="confirm-action-dialog" sx={{ fontWeight: 600 }}>
        {title}
      </DialogTitle>
      <DialogContent>
        <Typography id="confirm-action-description">
          {description}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'flex-end', px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined" color="primary">
          No
        </Button>
        <Button onClick={onConfirm} variant="contained" color="primary">
          Yes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
