import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  Chip,
  Typography,
  Alert,
  Divider
} from "@mui/material";
import { useState, useEffect, ReactElement } from "react";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { updateServiceProjectStatus } from "src/redux/actions/organizer/pageEvents";
import { AppDispatch } from "src/redux/store";
import { useDispatch } from "react-redux";

interface StatusConfirmationModalProps {
  open: boolean;
  contract: any
  onClose: () => void;
  currentStatus: string;
}

interface StatusUpdateResponse {
  status: number;
  // Add other properties that might be in the response
  data?: any;
  message?: string;
}

export const ProjectConfirmationModal = ({
  open,
  onClose,
  currentStatus,
  contract
}: StatusConfirmationModalProps) => {
  const [selectedStatus, setSelectedStatus] = useState(currentStatus);
  const dispatch = useDispatch<AppDispatch>();

  // Update selectedStatus when currentStatus changes
  useEffect(() => {
    setSelectedStatus(currentStatus);
  }, [currentStatus]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'ongoing': return 'primary';
      case 'cancelled': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getStatusIcon = (status: string): ReactElement => {
    switch (status) {
      case 'completed': return <CheckCircleIcon />;
      case 'ongoing': return <PlayCircleIcon />;
      case 'cancelled': return <CancelIcon />;
      case 'pending': return <PendingIcon />;
      default: return <PendingIcon />; // Default case returns an icon instead of null
    }
  };

  const getStatusDescription = (status: string) => {
    switch (status) {
      case 'completed': return 'The contract has been successfully completed.';
      case 'ongoing': return 'The contract is currently in progress.';
      case 'cancelled': return 'The contract has been cancelled.';
      case 'pending': return 'The contract is awaiting action.';
      default: return 'Status information not available.';
    }
  };

  const handleStatusConfirm = async (newStatus: string, id: any) => {
    try {
      const res = await dispatch(updateServiceProjectStatus(id, newStatus)) as unknown as StatusUpdateResponse;
      
      if (res?.status === 200) {
        onClose();
      }
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        Change Contract Status
      </DialogTitle>
      <DialogContent sx={{ mt: 2 }}>
        <Alert severity="info" sx={{ mb: 2 }}>
          You are about to change the status of this contract. Please confirm your selection.
        </Alert>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Typography variant="body2" sx={{ mr: 1 }}>Current Status:</Typography>
          <Chip
            icon={getStatusIcon(currentStatus)}
            label={currentStatus ? currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1) : 'Unknown'}
            color={getStatusColor(currentStatus)}
            variant="outlined"
          />
        </Box>

        <Divider sx={{ my: 2 }} />

        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>New Status</InputLabel>
          <Select
            value={selectedStatus}
            label="New Status"
            onChange={(e) => setSelectedStatus(e.target.value)}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Chip
                  icon={getStatusIcon(selected)}
                  label={selected.charAt(0).toUpperCase() + selected.slice(1)}
                  color={getStatusColor(selected)}
                  size="small"
                  sx={{ mr: 1 }}
                />
              </Box>
            )}
          >
            <MenuItem value="pending">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PendingIcon color="warning" sx={{ mr: 1 }} />
                <span>Pending</span>
              </Box>
            </MenuItem>
            <MenuItem value="ongoing">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <PlayCircleIcon color="primary" sx={{ mr: 1 }} />
                <span>Ongoing</span>
              </Box>
            </MenuItem>
            <MenuItem value="completed">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="success" sx={{ mr: 1 }} />
                <span>Completed</span>
              </Box>
            </MenuItem>
            <MenuItem value="cancelled">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CancelIcon color="error" sx={{ mr: 1 }} />
                <span>Cancelled</span>
              </Box>
            </MenuItem>
          </Select>
        </FormControl>

        <Box sx={{
          mt: 2,
          p: 2,
          backgroundColor: 'grey.50',
          borderRadius: 1,
          borderLeft: `4px solid`,
          borderColor: `${getStatusColor(selectedStatus)}.main`
        }}>
          <Typography variant="body2" color="text.secondary">
            {getStatusDescription(selectedStatus)}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={() => handleStatusConfirm(selectedStatus, contract._id)}
          variant="contained"
          sx={{
            color: getStatusColor(selectedStatus)

          }}
          disabled={selectedStatus === currentStatus}
        >
          Update Status
        </Button>
      </DialogActions>
    </Dialog>
  );
};