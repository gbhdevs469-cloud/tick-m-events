import React from 'react';
import {
    Modal,
    Box,
    Avatar,
    Typography,
    Grid,
    Divider,
    Chip,
    Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';

interface Verification {
  emailVerified: boolean;
  whatsappVerified: boolean;
  paymentVerified: boolean;
  identityVerified: boolean;
  identityDocuments?: {
    status: string;
  }[];
}

interface User {
  _id: string;
  name: string;
  email: string;
  number: string;
  gender: string;
  role: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  avatar?: {
    url?: string;
  };
  isVerified: boolean;
  isAdmin: boolean;
  address?: string;
  verification?: Verification | null; 
}

interface Props {
    open: boolean;
    onClose: () => void;
    user: User | null;
}

const ModalContainer = styled(Box)(({ theme }) => ({
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: '800px',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[24],
    padding: theme.spacing(4),
    borderRadius: theme.shape.borderRadius * 2,
    maxHeight: '90vh',
    overflowY: 'auto',
}));

const SectionHeader = styled(Typography)(({ theme }) => ({
    fontWeight: 600,
    color: theme.palette.primary.main,
    marginBottom: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    borderBottom: `2px solid ${theme.palette.divider}`,
}));

const DetailItem = ({
    label,
    value,
}: {
    label: string;
    value: React.ReactNode;
}) => (
    <Grid item xs={12} sm={6}>
        <Typography variant="subtitle2" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" sx={{ wordBreak: 'break-word' }}>
            {value || 'N/A'}
        </Typography>
    </Grid>
);

const UserDetailsModal: React.FC<Props> = ({ open, onClose, user }) => {
    if (!user) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <ModalContainer>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h5" fontWeight={600}>
                        User Details
                    </Typography>
                    <Button onClick={onClose} variant="outlined" color="secondary">
                        Close
                    </Button>
                </Box>

                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    <Avatar
                        src={user.avatar?.url}
                        alt={user.name}
                        sx={{ width: 80, height: 80, mb: 1 }}
                    />
                    <Typography variant="h6">{user.name}</Typography>
                    <Chip
                        label={user.role}
                        size="small"
                        color="primary"
                        sx={{ mt: 1, textTransform: 'capitalize' }}
                    />
                </Box>

                <Divider sx={{ mb: 3 }} />

                <SectionHeader variant="h6">Account Information</SectionHeader>
                <Grid container spacing={2}>
                    <DetailItem label="Email" value={<a href={`mailto:${user.email}`}>{user.email}</a>} />
                    <DetailItem label="Phone" value={user.number} />
                    <DetailItem label="Gender" value={user.gender} />
                    <DetailItem label="Status" value={
                        <Chip
                            label={user.status}
                            color={
                                user.status === 'active'
                                    ? 'success'
                                    : user.status === 'pending'
                                        ? 'warning'
                                        : user.status === 'suspended'
                                            ? 'error'
                                            : 'default'
                            }
                            size="small"
                            sx={{ textTransform: 'capitalize' }}
                        />
                    } />
                    <DetailItem label="Verified" value={user.isVerified ? 'Yes' : 'No'} />
                    <DetailItem label="Admin" value={user.isAdmin ? 'Yes' : 'No'} />
                </Grid>

                <Divider sx={{ my: 3 }} />

                <SectionHeader variant="h6">Additional Details</SectionHeader>
                <Grid container spacing={2}>
                    <DetailItem
                        label="Created At"
                        value={user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}
                    />
                    <DetailItem
                        label="Updated At"
                        value={user.updatedAt ? new Date(user.updatedAt).toLocaleString() : 'N/A'}
                    />
                    <DetailItem label="User ID" value={user._id} />
                </Grid>
                  <Divider sx={{ my: 3 }} />

                <SectionHeader variant="h6">Verification Status</SectionHeader>
                <Grid container spacing={2}>
                    <DetailItem
                        label="Email Verified"
                        value={user.verification?.emailVerified ? 'Yes' : 'No'}
                    />
                    <DetailItem
                        label="WhatsApp Verified"
                        value={user.verification?.whatsappVerified ? 'Yes' : 'No'}
                    />
                    <DetailItem
                        label="Payment Verified"
                        value={user.verification?.paymentVerified ? 'Yes' : 'No'}
                    />
                    <DetailItem
                        label="Identity Verified"
                        value={user.verification?.identityVerified ? 'Yes' : 'No'}
                    />
                </Grid>

            </ModalContainer>


        </Modal>
    );
};

export default UserDetailsModal;
