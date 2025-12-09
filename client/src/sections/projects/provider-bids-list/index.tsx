import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Box, Typography, TableContainer, Table, TableHead, TableRow, TableCell,
  TableBody, Paper, Chip, IconButton, Button, Dialog, DialogActions, Tooltip,
  DialogContent, DialogContentText, DialogTitle, Grid, Stack, TextField,
  Divider, MenuItem, CircularProgress, Select, FormControl, InputLabel,
  Avatar
} from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';
import {
  Visibility as EyeIcon,
  Chat as ChatIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Close as CloseIcon,
  Print as PrintIcon,
  Event as EventIcon,
  Schedule as ScheduleIcon,
  AttachMoney as AttachMoneyIcon,
  Description as DescriptionIcon,
  Person as PersonIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'src/redux/store';
import { getMyBids, withdrawnMyBids, updateBid } from 'src/redux/actions/provider/projects/place-a-bd.action';
import { Link, useNavigate } from 'react-router-dom';
import { formatEventDate } from 'src/hooks/formate-time';
import { ProviderOrganizerInfoModal } from 'src/components/modal/provider-orgnizer-info-modal';
import { TextWithShowMore } from 'src/components/text-with-show-more';
import { confirmAcceptanceProvider } from 'src/redux/actions/organizer/pageEvents';

export function ProviderBidsList() {
  const dispatch = useDispatch<AppDispatch>();
  const { _mybids } = useSelector((state: RootState) => state?.provider);
  const [openDetailModal, setOpenDetailModal] = useState(false);
  const [selectedBidDetail, setSelectedBidDetail] = useState<any>(null);
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedBid, setSelectedBid] = useState<any>(null);
  const [openViewDialog, setOpenViewDialog] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<any>({});

  // ✨ New state for Edit Form
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [bidData, setBidData] = useState<any>({
    bidAmount: '',
    deliveryTime: '',
    deliveryUnit: 'Days',
    proposal: ''
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [milestones, setMilestones] = useState<any[]>([
    { id: Date.now(), milestorneName: '', amount: '', currency: 'XAF' }
  ]);
  const [charCount, setCharCount] = useState(0);

  // Print functionality ref
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getMyBids());
  }, [dispatch]);

  const handleViewOpenDialog = (bid: any) => {
    setSelectedOrg(bid);
    setOpenViewDialog(true);
  };

  const handleOpenDialog = (bid: any) => {
    setSelectedBid(bid);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedBid(null);
  };

  const handleWithdrawBid = async () => {
    if (selectedBid) {
      await dispatch(withdrawnMyBids(selectedBid?._id) as any);
      handleCloseDialog();
    }
  };

  // ---- Bid Detail Modal ----
  const handleOpenDetailModal = (bid: any) => {
    setSelectedBidDetail(bid);
    setOpenDetailModal(true);
  };

  const handleCloseDetailModal = () => {
    setOpenDetailModal(false);
    setSelectedBidDetail(null);
  };

  // ---- Print Functionality ----
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    // Get all styles from the current document
    const allStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
      .map(style => style.outerHTML)
      .join('\n');

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Bid Details - ${selectedBidDetail?._id}</title>
          <meta charset="utf-8">
          <style>
            @media print {
              body { 
                margin: 0; 
                padding: 20px; 
                background: white !important;
                color: black !important;
              }
              .no-print { display: none !important; }
              .print-section { 
                break-inside: avoid;
                margin-bottom: 20px;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
            body { 
              font-family: 'Roboto', 'Arial', sans-serif;
              line-height: 1.6;
            }
            .bid-header {
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
              color: white !important;
              padding: 20px;
              border-radius: 8px 8px 0 0;
              position: relative;
            }
            .watermark {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) rotate(-30deg);
              opacity: 0.03;
              z-index: 0;
              pointer-events: none;
            }
            .stamp {
              background: linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%) !important;
              color: white !important;
              border: 2px solid white !important;
            }
            .section-paper {
              border: 1px solid #e0e0e0;
              border-radius: 8px;
              padding: 20px;
              margin-bottom: 20px;
              background: white !important;
              position: relative;
            }
            .status-chip {
              border: 1px solid !important;
              text-transform: capitalize;
            }
            table {
              width: 100%;
              border-collapse: collapse;
            }
            th, td {
              border: 1px solid #ddd;
              padding: 8px;
              text-align: left;
            }
            th {
              background-color: #f5f5f5;
              font-weight: bold;
            }
          </style>
          ${allStyles}
        </head>
        <body>
          <div class="print-content">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => window.close(), 100);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // ---- New Handlers for Edit ----
  const handleEditOpen = (bid: any) => {
    setSelectedBid(bid);
    setBidData({
      bidAmount: bid.bidAmount || '',
      deliveryTime: bid.deliveryTime || '',
      deliveryUnit: bid.deliveryUnit || 'Days',
      proposal: bid.proposal || ''
    });
    setMilestones(bid.milestones || [
      { id: Date.now(), milestorneName: '', amount: '', currency: 'XAF' }
    ]);
    setCharCount(bid.proposal?.length || 0);
    setOpenEditDialog(true);
  };

  const handleEditClose = () => {
    setOpenEditDialog(false);
    setSelectedBid(null);
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setBidData({ ...bidData, [name]: value });
    if (name === 'proposal') {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    const bidAmount = Number(bidData.bidAmount);
    const milestoneSum = milestones.reduce((acc: any, m: any) => acc + Number(m.amount || 0), 0);

    // ✅ Proposal validation
    if (bidData.proposal.length < 100) {
      setErrors({ proposal: "Proposal must be at least 100 characters" });
      setLoading(false);
      return;
    }

    // ✅ Milestone validation
    if (bidAmount !== milestoneSum) {
      setErrors({ milestones: `Milestone total (${milestoneSum}) must equal Bid Amount (${bidAmount}).` });
      setLoading(false);
      return;
    }

    const updatedBid = {
      ...bidData,
      milestones,
    };

    try {
      await dispatch(updateBid(selectedBid?._id, updatedBid) as any);
      handleEditClose();
    } catch (err) {
      console.error("Error updating bid:", err);
    } finally {
      setLoading(false);
    }
  };

  const addMilestone = () => {
    setMilestones([...milestones, { id: Date.now(), milestorneName: '', amount: '', currency: 'XAF' }]);
  };

  const removeMilestone = (id: any) => {
    setMilestones(milestones.filter((m: any) => m.id !== id));
  };

  const handleMilestoneChange = (id: any, field: string, value: string) => {
    setMilestones(milestones.map((m: any) => m.id === id ? { ...m, [field]: value } : m));
  };

  const handleProviderAcceptance = useCallback(async (bid: any) => {
    const data = {
      status: "isProviderAccepted"
    }

    try {
      await dispatch(confirmAcceptanceProvider(data, bid?.projectId?._id, bid?._id));
      handleCloseDetailModal(); // Close modal after acceptance
    } catch (error) {
      console.error("Verification error:", error);
    }
  }, [dispatch]);

  // Format functions
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const formatDateTime = (dateString: string) => {
    if (!dateString) return '-';
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    return new Date(dateString).toLocaleString('en-US', options);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'success';
      case 'ongoing': return 'info';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      case 'rejected': return 'error';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  // Bid Details Content Component for Print
  const BidDetailsContent = () => (
    <div ref={printRef}>
      {/* Header */}
      <Box className="bid-header">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Bid Details & Proposal
            </Typography>
            <Typography variant="subtitle1">
              Bid ID: {selectedBidDetail?._id}
            </Typography>
          </Box>

          {/* Tick-M Events Stamp */}
          <Box
            sx={{
              opacity: 0.9,
              transform: 'rotate(5deg)',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              className="stamp"
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
                fontSize: '12px',
                textAlign: 'center',
                lineHeight: 1.1
              }}
            >
              TICK-M<br />EVENTS
            </Box>
          </Box>
        </Box>
      </Box>

      {/* Content */}
      <Box sx={{ py: 3, position: 'relative', background: 'white', color: 'black' }}>
        {/* Watermark Stamp */}
        <Box className="watermark">
          <Typography
            variant="h1"
            fontWeight="bold"
            sx={{
              fontSize: '120px',
              color: '#667eea',
              whiteSpace: 'nowrap'
            }}
          >
            TICK-M EVENTS
          </Typography>
        </Box>

        {/* Header Status Bar */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3, position: 'relative', zIndex: 1 }}>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip
              className="status-chip"
              label={`Bid Status: ${selectedBidDetail?.status || 'active'}`}
              color={getStatusColor(selectedBidDetail?.status)}
              variant="outlined"
            />
            <Chip
              className="status-chip"
              label={`Organizer Acceptance: ${selectedBidDetail?.isOrgnizerAccepted ? 'Accepted' : 'Pending'}`}
              color={selectedBidDetail?.isOrgnizerAccepted ? 'success' : 'warning'}
              variant="outlined"
            />
            <Chip
              className="status-chip"
              label={`Your Acceptance: ${selectedBidDetail?.isProviderAccepted ? 'Accepted' : 'Pending'}`}
              color={selectedBidDetail?.isProviderAccepted ? 'success' : 'warning'}
              variant="outlined"
            />
          </Box>
          <Chip
            label={selectedBidDetail?.status === 'withdrawn' ? "Bid Withdrawn" : "Active Bid"}
            color={selectedBidDetail?.status === 'withdrawn' ? "error" : "success"}
            sx={{ fontWeight: 'bold' }}
          />
        </Box>

        <Grid container spacing={3} position="relative" zIndex={1}>
          {/* Left Column - Project Information */}
          <Grid item xs={12} md={6}>
            {/* Project Information */}
            <Paper className="section-paper">
              {/* Small stamp on project section */}
              <Box
                className="stamp"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                TM
              </Box>

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <EventIcon sx={{ mr: 1 }} /> Project Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Event Name</Typography>
                <Typography>{selectedBidDetail?.projectId?.eventId?.eventName}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                <Typography>{selectedBidDetail?.projectId?.eventLocation}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Budget Range</Typography>
                <Typography>{selectedBidDetail?.projectId?.orgBudget}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Service Time</Typography>
                <Typography>{formatDateTime(selectedBidDetail?.projectId?.serviceTime)}</Typography>
              </Box>
              {selectedBidDetail?.isProviderAccepted && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Project Status</Typography>
                  <Typography textTransform="capitalize">
                    {selectedBidDetail?.projectId?.status}
                  </Typography>
                </Box>
              )}
            </Paper>

            {/* Client Information */}
            <Paper className="section-paper">
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <PersonIcon sx={{ mr: 1 }} /> Client Information
              </Typography>
              <Box display="flex" alignItems="center" mb={2}>
                <Avatar
                  src={selectedBidDetail?.projectId?.createdBy?.avatar?.url}
                  alt={selectedBidDetail?.projectId?.createdBy?.name}
                  sx={{ width: 60, height: 60, mr: 2 }}
                />
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {selectedBidDetail?.projectId?.createdBy?.name}
                  </Typography>
                  <Typography variant="body2">
                    {selectedBidDetail?.projectId?.createdBy?.email}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Bid Information */}
          <Grid item xs={12} md={6}>
            {/* Bid Information */}
            <Paper className="section-paper">
              {/* Small stamp on bid section */}
              <Box
                className="stamp"
                sx={{
                  position: 'absolute',
                  top: -10,
                  right: -10,
                  width: 24,
                  height: 24,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '10px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                }}
              >
                TM
              </Box>

              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <AttachMoneyIcon sx={{ mr: 1 }} /> Your Bid Information
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Bid Amount</Typography>
                <Typography variant="h6" color="primary">
                  {selectedBidDetail?.bidAmount} XAF
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Delivery Time</Typography>
                <Typography>
                  {selectedBidDetail?.deliveryTime} {selectedBidDetail?.deliveryUnit}
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Time to Bid</Typography>
                <Typography>{formatEventDate(selectedBidDetail?.createdAt)}</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Bid Rank</Typography>
                <Typography>
                  #{selectedBidDetail?.bidInfo?.yourBidRank} of {selectedBidDetail?.bidInfo?.totalBidsOnProject} bids
                </Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Winning Bid</Typography>
                <Typography>
                  {selectedBidDetail?.winningBid} XAF
                </Typography>
              </Box>
            </Paper>

            {/* Acceptance Status */}
            <Paper className="section-paper">
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
                <AssignmentIcon sx={{ mr: 1 }} /> Acceptance Status
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Organizer Acceptance</Typography>
                <Chip
                  label={selectedBidDetail?.isOrgnizerAccepted ? "Accepted" : "Pending"}
                  color={selectedBidDetail?.isOrgnizerAccepted ? "success" : "warning"}
                  size="small"
                />
              </Box>
              {selectedBidDetail?.isOrgnizerAccepted && (
                <Box sx={{ mb: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">Your Acceptance</Typography>
                  {selectedBidDetail?.isProviderAccepted ? (
                    <Chip label="Accepted" color="success" size="small" />
                  ) : (
                    <Typography variant="body2" color="warning.main">
                      Pending your acceptance
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>

        {/* Milestones Section */}
        {selectedBidDetail?.milestones && selectedBidDetail.milestones.length > 0 && (
          <Paper className="section-paper">
            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
              <DescriptionIcon sx={{ mr: 1 }} /> Milestone Payments
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Milestone Name</strong></TableCell>
                    <TableCell align="right"><strong>Amount</strong></TableCell>
                    <TableCell><strong>Currency</strong></TableCell>
                    <TableCell><strong>Status</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBidDetail.milestones?.map((milestone: any, idx: number) => (
                    <TableRow key={idx}>
                      <TableCell>{milestone.milestorneName}</TableCell>
                      <TableCell align="right">{milestone.amount}</TableCell>
                      <TableCell>{milestone.currency}</TableCell>
                      <TableCell>
                        <Chip
                          label={milestone.isReleased ? 'Released' : 'Pending'}
                          color={milestone.isReleased ? 'success' : 'default'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Proposal Section */}
        <Paper className="section-paper">
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            <DescriptionIcon sx={{ mr: 1 }} /> Your Proposal
          </Typography>
          <Paper sx={{ p: 2, backgroundColor: 'grey.50' }}>
            <TextWithShowMore text={selectedBidDetail?.proposal} />
          </Paper>
        </Paper>

        {/* Timeline Information */}
        <Paper className="section-paper">
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', fontWeight: 'bold' }}>
            <ScheduleIcon sx={{ mr: 1 }} /> Timeline
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Bid Created</Typography>
                <Typography>{formatDateTime(selectedBidDetail?.createdAt)}</Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">Last Updated</Typography>
                <Typography>{formatDateTime(selectedBidDetail?.updatedAt)}</Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Footer Stamp for Print */}
        <Box
          sx={{
            textAlign: 'center',
            mt: 4,
            pt: 2,
            borderTop: '1px solid #e0e0e0',
            opacity: 0.7,
            fontSize: '12px',
            color: 'text.secondary',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Box
            className="stamp"
            sx={{
              width: 20,
              height: 20,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 'bold',
              fontSize: '10px',
              marginRight: '8px'
            }}
          >
            TM
          </Box>
          Tick-M Events Official Document - Generated on {new Date().toLocaleDateString()}
        </Box>
      </Box>
    </div>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Withdraw Confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Withdraw Bid Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to withdraw your bid on {selectedBid?.projectId?.eventId?.eventName}?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleWithdrawBid} color="error">Yes, Withdraw Bid</Button>
        </DialogActions>
      </Dialog>

      {/* Updated Bid Detail Modal */}
      <Dialog
        open={openDetailModal}
        onClose={handleCloseDetailModal}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          py: 2,
          position: 'relative'
        }}>
          <Box>
            <Typography variant="h5" fontWeight="bold">
              Bid Details & Proposal
            </Typography>
            <Typography variant="subtitle1">
              Bid ID: {selectedBidDetail?._id}
            </Typography>
          </Box>
          <IconButton onClick={handleCloseDetailModal} sx={{ color: 'white' }}>
            <CloseIcon />
          </IconButton>

          {/* Tick-M Events Stamp */}
          <Box
            sx={{
              position: 'absolute',
              top: 16,
              right: 60,
              opacity: 0.9,
              transform: 'rotate(5deg)',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '50%',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #ff6b6b 0%, #ff8e53 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '12px',
                border: '2px solid white',
                textAlign: 'center',
                lineHeight: 1.1
              }}
            >
              TICK-M<br />EVENTS
            </Box>
          </Box>
        </DialogTitle>

        <DialogContent dividers sx={{ py: 3, position: 'relative' }}>
          <BidDetailsContent />
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2, position: 'relative', zIndex: 1 }}>
          <Button onClick={handleCloseDetailModal} variant="outlined">
            Close
          </Button>
          <Button onClick={handlePrint} variant="outlined" startIcon={<PrintIcon />}>
            Download
          </Button>
          {selectedBidDetail && !selectedBidDetail.isProviderAccepted && selectedBidDetail.isOrgnizerAccepted && (
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleProviderAcceptance(selectedBidDetail)}
            >
              Accept Project
            </Button>
          )}
          {/* <Button
            onClick={() => handleEditOpen(selectedBidDetail)}
            variant="outlined"
            startIcon={<EditIcon />}
            disabled={selectedBidDetail?.status === 'withdrawn'}
          >
            Edit Bid
          </Button> */}

          {/* Footer Stamp */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 8,
              right: 16,
              opacity: 0.7,
              fontSize: '10px',
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <Box
              sx={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #667eea 0%, #764ba2 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '8px',
                marginRight: '4px'
              }}
            >
              TM
            </Box>
            Tick-M Events Official Document
          </Box>
        </DialogActions>
      </Dialog>

      {/* Edit Bid Form Dialog */}
      <Dialog open={openEditDialog} onClose={handleEditClose} maxWidth="md" fullWidth>
        <DialogTitle>Edit Your Bid</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ p: 2 }}>
            <Typography variant="h6" mb={2}>Bid Details</Typography>
            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={5}>
                <TextField
                  fullWidth
                  name="bidAmount"
                  label="Bid Amount (XAF)"
                  value={bidData.bidAmount}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12} md={7}>
                <Stack direction="row" spacing={2}>
                  <TextField
                    name="deliveryTime"
                    label="Delivery Time"
                    value={bidData.deliveryTime}
                    onChange={handleInputChange}
                    fullWidth
                  />
                  <TextField
                    select
                    name="deliveryUnit"
                    value={bidData.deliveryUnit}
                    onChange={handleInputChange}
                    sx={{ minWidth: 120 }}
                  >
                    <MenuItem value="Days">Days</MenuItem>
                    <MenuItem value="Weeks">Weeks</MenuItem>
                    <MenuItem value="Months">Months</MenuItem>
                  </TextField>
                </Stack>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={1}>Proposal</Typography>
            <TextField
              fullWidth
              multiline
              minRows={4}
              name="proposal"
              value={bidData.proposal}
              onChange={handleInputChange}
              helperText={`${charCount} characters (min 100 required)`}
              sx={{ mb: 3 }}
            />

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" mb={2}>Milestone Payments</Typography>
            {milestones.map((milestone: any, index: any) => (
              <Grid container spacing={2} key={milestone.id} mb={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    placeholder={`Milestone ${index + 1}`}
                    value={milestone.milestorneName}
                    onChange={(e) => handleMilestoneChange(milestone.id, 'milestorneName', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={3}>
                  <TextField
                    fullWidth
                    placeholder="Amount"
                    value={milestone.amount}
                    onChange={(e) => handleMilestoneChange(milestone.id, 'amount', e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} md={2}>
                  <TextField
                    select
                    fullWidth
                    value={milestone.currency}
                    onChange={(e) => handleMilestoneChange(milestone.id, 'currency', e.target.value)}
                  >
                    <MenuItem value="XAF">XAF</MenuItem>
                    <MenuItem value="USD">USD</MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={12} md={1}>
                  <IconButton onClick={() => removeMilestone(milestone.id)}>
                    <RemoveIcon />
                  </IconButton>
                </Grid>
              </Grid>
            ))}
            {errors?.milestones && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {errors.milestones}
              </Typography>
            )}

            <Button onClick={addMilestone} startIcon={<AddIcon />}>Add Milestone</Button>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="success"
              sx={{ mt: 3 }}
            >
              {loading ? <CircularProgress size={16} /> : "Update Bid"}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Client Info */}
      <ProviderOrganizerInfoModal
        isModalOpen={openViewDialog}
        handleCloseModal={() => setOpenViewDialog(false)}
        select={selectedOrg}
      />

      {/* Bids Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="bids table">
          <TableHead>
            <TableRow sx={{ backgroundColor: 'grey.800' }} >
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Project</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Time to bid</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Bid Rank</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Winning Bid</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Your Bid</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Client Details</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Conversation</TableCell>
              <TableCell sx={{ color: 'black', fontWeight: 'bold', py: 2 }}>Actions</TableCell>

            </TableRow>
          </TableHead>
          <TableBody>
            {
              _mybids?.length > 0 ? (
                _mybids?.map((bid: any, index: number) => (
                  <TableRow
                    key={index}
                    sx={{
                      boxShadow: bid?.status === 'withdrawn' ? 'inset 0 0 8px rgba(244, 67, 54, 0.6)' : 'none',
                      borderTop: '1px solid',
                      borderColor: 'grey.700',
                      '&:hover': { backgroundColor: 'grey.600' },
                      cursor: 'pointer'
                    }}
                    onClick={() => handleOpenDetailModal(bid)}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Typography
                        component={Link}
                        to={`/project/${bid.projectId?._id}`}
                        fontSize={12}
                        sx={{
                          color: 'black',
                          textDecoration: 'none',
                          cursor: 'pointer',
                          '&:hover': {
                            textDecoration: 'underline',
                          }
                        }}
                      >
                        {bid.projectId?.eventId?.eventName}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ py: 2, fontSize: 12 }}>{formatEventDate(bid?.createdAt)}</TableCell>
                    <TableCell sx={{ py: 2 }}>#{bid?.bidInfo?.yourBidRank} of {bid?.bidInfo?.totalBidsOnProject} bids</TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Chip
                        label={`${bid?.winningBid} XAF`}
                        size="small"
                        sx={{
                          backgroundColor: 'primary.main',
                          color: 'white',
                          fontWeight: 'bold'
                        }}
                      />
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>{bid?.bidAmount} XAF</TableCell>

                    <TableCell sx={{ py: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<EyeIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewOpenDialog(bid?.projectId?.createdBy);
                        }}
                        disabled={bid?.status === 'withdrawn'}
                        sx={{
                          backgroundColor: bid.chat ? 'success.main' : 'grey.700',
                          color: bid.chat ? 'white' : 'grey.400',
                        }}
                      >
                        View
                      </Button>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ChatIcon />}
                        disabled={bid?.status === 'withdrawn'}
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate("/messaging-&-client-relationship");
                          sessionStorage.setItem('currentChatProvider', JSON.stringify(bid.projectId?.createdBy?._id));
                        }}
                        sx={{
                          backgroundColor: bid.chat ? 'success.main' : 'grey.700',
                          color: bid.chat ? 'white' : 'grey.400',
                        }}
                      >
                        Chat
                      </Button>
                    </TableCell>
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          size="small"
                          sx={{ color: 'green' }}
                          disabled={bid?.status === 'withdrawn'}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditOpen(bid);
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          sx={{ color: 'red' }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenDialog(bid);
                          }}
                          disabled={bid?.status === 'withdrawn'}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 4,
                      }}
                    >
                      <Box
                        sx={{
                          width: 120,
                          height: 120,
                          borderRadius: '50%',
                          backgroundColor: 'grey.100',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          mb: 3,
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="60"
                          height="60"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" />
                          <polyline points="13 2 13 9 20 9" />
                        </svg>
                      </Box>

                      <Typography variant="h6" color="textSecondary" gutterBottom>
                        No Bids Yet
                      </Typography>

                      <Typography variant="body2" color="textSecondary" sx={{ mb: 3, textAlign: 'center', maxWidth: 400 }}>
                        You haven&apos;t placed any bids on projects yet. Start bidding to get hired for exciting events and projects.
                      </Typography>

                      <Button
                        variant="contained"
                        color="primary"
                        size="large"
                        startIcon={
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                          </svg>
                        }
                        onClick={() => navigate('/project/view')}
                        sx={{
                          borderRadius: 2,
                          px: 4,
                          py: 1,
                          fontWeight: 'bold',
                        }}
                      >
                        Find Projects to Bid On
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              )
            }
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}