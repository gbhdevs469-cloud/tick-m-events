import {
  Box,
  Paper,
  Typography,
  Button,
  Stack, Dialog, DialogTitle, DialogContent, IconButton
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from "src/redux/store";
import { useEffect, useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { toast } from 'react-toastify';

import { getAllAdminVerifications, approveIdentity, rejectIdentity } from '../../redux/actions/verificationActions';


const documentTypeLabels: Record<string, string> = {
  passport: "Passport",
  driving_license: "Driving License",
  national_id: "National ID",
};

export function KycDocumentTableCard() {
  const dispatch = useDispatch<AppDispatch>();
  const [openPreview, setOpenPreview] = useState(false);
  const [selectedDocUrl, setSelectedDocUrl] = useState<string>();
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const { loading, data: verifications, error } = useSelector(
    (state: RootState) => state.adminVerificationList
  );
  useEffect(() => {
    dispatch(getAllAdminVerifications());
  }, [dispatch]);

  const getFirstValidDocument = (docs: any[]) =>
    docs?.find((doc) => doc?.url && doc?.type && doc?.status);


  const getActions = (item: any) => {
    const status = item.identityDocuments?.[0]?.status;
    const hasDocuments = Array.isArray(item.identityDocuments) &&
      item.identityDocuments.some((doc: any) => doc?.url);
    let actions: string[] = [];
    if (status === 'pending') actions = ['Approved', 'Reject'];
    else if (status === 'approved') actions = ['Download'];
    else actions = ['Review'];

    if (hasDocuments) {
      actions.unshift('View'); 
    }

    return actions;
  };


  return (
    <Paper
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: 3,
        border: '1px solid #E0E0E0',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.4)',
        backgroundColor: '#fff',
      }}
    >
      <Typography variant="h6" fontWeight="bold" mb={3}>
        KYC Document Verification
      </Typography>

     
      <Box sx={{ overflowX: 'auto', borderRadius: 1 }}>
        <Box sx={{ minWidth: 700 }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr',
              backgroundColor: '#1F8FCD',
              color: 'white',
              py: 1.5,
              px: 2,
              fontWeight: 600,
              textAlign: 'center',
            }}
          >
            <Box>User</Box>
            <Box>Document Type</Box>
            <Box>Submission Date</Box>
            <Box>Status</Box>
            <Box>Actions</Box>
          </Box>

          <Box
            sx={{
              maxHeight: 300,
              overflowY: 'auto',
              borderTop: '1px solid #ddd',
              '&::-webkit-scrollbar': {
                width: '2px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: '#0B2E4C',
                borderRadius: '10px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: '#e0e0e0',
                borderRadius: '10px',
              },
            }}
          >

            {/* kyc validattion */}
            {verifications && verifications.length > 0 ? (
              verifications.map((item: any, idx: number) => (
                <Box
                  key={idx}
                  sx={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr 1fr 1fr 2fr',
                    alignItems: 'center',
                    py: 1.5,
                    px: 2,
                    borderBottom:
                      idx !== verifications.length - 1
                        ? '1px solid rgba(195, 195, 195, 1)'
                        : 'none',
                    backgroundColor: '#f5f5f5',
                    textAlign: 'center',
                  }}
                >
                  <Box>{item?.user?.name || 'N/A'}</Box>
                  <Box>{documentTypeLabels[item?.identityDocuments?.[0]?.type] || 'Unknown'}</Box>
                  <Box>{new Date(item?.identityDocuments?.[0]?.uploadedAt).toLocaleDateString()}</Box>
                  <Box>
                    <Typography
                      sx={{
                        color:
                          item.identityDocuments?.[0]?.status === 'pending'
                            ? 'orange'
                            : item.identityDocuments?.[0]?.status === 'approved'
                              ? 'green'
                              : 'red',
                        fontWeight: 'bold',
                      }}
                    >
                      {item.identityDocuments?.[0]?.status
                        ? item.identityDocuments[0].status.charAt(0).toUpperCase() +
                        item.identityDocuments[0].status.slice(1)
                        : 'N/A'}
                    </Typography>
                  </Box>
                  <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={1}
                    flexWrap="wrap"
                    useFlexGap
                    justifyContent="center"
                    sx={{
                      mt: { xs: 1, sm: 0 },
                      '& button': {
                        flex: { xs: '1 1 auto', sm: 'none' },
                        minWidth: { xs: '100%', sm: '100%', md: 10, lg: 5 },
                      },
                    }}
                  >
                    {getActions(item).map((label, i) => (
                      <StyledActionButton
                        key={i}
                        label={label}
                        onClick={async () => {
                          if (label === 'View') {
                            const doc = item.identityDocuments.find((d: any) => d?.url);
                            if (doc?.url) {
                              setSelectedDocUrl(doc.url);
                              setOpenPreview(true);
                            }
                          } else if (label === 'Approved') {
                            if (item.user && item.user._id) {
                              const result = await dispatch(approveIdentity(item.user._id));
                              if (result.success) {
                                toast.success('Identity approved successfully!');
                                dispatch(getAllAdminVerifications());
                              } else {
                                toast.error(result.message || 'Approval failed.');
                              }
                            } else {
                              console.error('User ID missing');
                            }
                          } else if (label === 'Reject') {
                            if (item.user && item.user._id) {
                              setSelectedUserId(item.user._id);
                              setRejectReason('');
                              setOpenRejectDialog(true);
                            } else {
                              console.error('User ID missing');
                            }
                          }
                        }}
                      />
                    ))}
                  </Stack>
                </Box>
              ))
            ) : (
              <Box
                sx={{
                  textAlign: 'center',
                  py: 4,
                  fontStyle: 'italic',
                  fontWeight: 'bold',
                  color: 'red',
                  backgroundColor: '#f9f9f9',
                }}
              >
                No KYC records found. KYC Verification required.
              </Box>
            )}
          </Box>
        </Box>
      </Box>
      <Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          Document Preview
          <IconButton onClick={() => setOpenPreview(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent dividers>
          {selectedDocUrl?.endsWith('.pdf') ? (
            <iframe
              src={selectedDocUrl}
              title="Document PDF"
              width="100%"
              height="600px"
              style={{ border: 'none' }}
            />
          ) : (
            <img
              src={selectedDocUrl}
              alt="Document Preview"
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* reject modal */}
      <Dialog open={openRejectDialog} onClose={() => setOpenRejectDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Reject Identity Verification</DialogTitle>
        <DialogContent>
          <Typography>Please provide a reason for rejection:</Typography>
          <textarea
            rows={4}
            style={{ width: '100%', marginTop: 10, padding: 8, fontSize: 14 }}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="Enter rejection reason here..."
          />
        </DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, p: 2 }}>
          <Button onClick={() => setOpenRejectDialog(false)} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              if (!selectedUserId) return;
              if (!rejectReason.trim()) {
                toast.error('Please enter a rejection reason');
                return;
              }
              try {
                const response = await dispatch(rejectIdentity(selectedUserId, rejectReason));
                if (response.success) {
                  toast.success('Identity rejected successfully!');
                  dispatch(getAllAdminVerifications());
                  setOpenRejectDialog(false);
                } else {
                  toast.error(response.message || 'Rejection failed.');
                }
              } catch (err) {
                toast.error('Something went wrong');
              }
            }}
          >
            Submit
          </Button>
        </Box>
      </Dialog>


    </Paper>

  );
}

function StyledActionButton({
  label,
  onClick,
}: {
  label: string;
  onClick?: () => void;
}) {
  const getButtonColor = () => {
    switch (label) {
      case 'Approve':
      case 'Download':
      case 'Request Modification':
        return '#0B2E4C';
      case 'Reject':
        return '#D32F2F';
      default:
        return '#0B2E4C';
    }
  };

  return (
    <Button
      variant="contained"
      onClick={onClick}
      sx={{
        backgroundColor: getButtonColor(),
        borderRadius: 1,
        textTransform: 'none',
        fontSize: 12,
        width:80,
        color: '#fff',
        '&:hover': {
          backgroundColor: '#071E33',
        },
      }}
    >
      {label}
    </Button>
  );
}
