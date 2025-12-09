import {
  Typography,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Box,
  Chip,
  Avatar,
  Button,
  CircularProgress,
  Alert,
  TextField,
  MenuItem,
  InputAdornment,
  Card,
  CardContent, Modal,
  Grid,
  IconButton,
  Stack
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';
import ReceiptIcon from '@mui/icons-material/Receipt';
import PaymentIcon from '@mui/icons-material/Payment';
import NotesIcon from '@mui/icons-material/Notes';
import DescriptionIcon from '@mui/icons-material/Description';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import InfoIcon from '@mui/icons-material/Info';
import { toast } from "react-toastify";

import { getAdminRefundReq } from "src/redux/actions/admin/refund-requests";
import { AppDispatch, RootState } from "src/redux/store";
import { formatEventDate } from "src/hooks/formate-time";
import { DashboardContent } from "src/layouts/dashboard";
import { RefundRequestTyp } from "./utils";
import axios from '../../redux/helper/axios';

// Modal Style
const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: {
    xs: '95%',
    sm: '90%',
    md: '85%',
    lg: '80%',
    xl: '75%'
  },
  maxWidth: '1200px',
  maxHeight: {
    xs: '85vh',
    sm: '90vh',
  },
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: {
    xs: 2,
    sm: 3,
    md: 4
  },
  overflow: 'auto'
};

// Types for API Response
interface ApiResponseData {
  paymentStatusCheck?: {
    url: string;
    status: number;
    data: any;
    error?: string;
  };
  payoutRequest?: {
    url: string;
    status: number;
    data: any;
    requestBody: any;
    error?: string;
  };
  error?: {
    message: string;
    stack?: string;
    fullError?: any;
  };
}

// Status Card Component
const StatusCard = ({ status, amount, date }: { status: string; amount: number; date: string }) => {
  const getStatusConfig = (statuss: string) => {
    const config = {
      approved: { color: '#4CAF50', bgcolor: '#E8F5E8', label: 'Approved' },
      pending: { color: '#FF9800', bgcolor: '#FFF3E0', label: 'Pending' },
      rejected: { color: '#F44336', bgcolor: '#FFEBEE', label: 'Rejected' },
      refunded: { color: '#2196F3', bgcolor: '#E3F2FD', label: 'Refunded' },
      cancelled: { color: '#9E9E9E', bgcolor: '#F5F5F5', label: 'Cancelled' }
    };
    return config[statuss as keyof typeof config] || config.pending;
  };

  const statusConfig = getStatusConfig(status);

  return (
    <Card sx={{ bgcolor: statusConfig.bgcolor, border: `1px solid ${statusConfig.color}20` }}>
      <CardContent>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center" justifyContent="between">
          <Box>
            <Typography variant="h6" fontWeight="bold" color={statusConfig.color}>
              {statusConfig.label}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Requested on {formatEventDate(date)}
            </Typography>
          </Box>
          <Box textAlign={{ xs: 'left', sm: 'right' }}>
            <Typography variant="h5" fontWeight="bold" color={statusConfig.color}>
              {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'XAF' }).format(amount)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Refund Amount
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

// API Response Display Component - Human Readable
const ApiResponseDisplay = ({ responseData, title }: { responseData: any; title: string }) => {
  if (!responseData) return null;

  const getDisplayStatus = () => {
    // If there's an explicit error message
    if (responseData.error) {
      return responseData.error;
    }
    // For payment status check
    if (responseData.data?.status) {
      return responseData.data.status;
    }
    // For payout response - show the actual message
    if (responseData.data?.message) {
      return responseData.data.message;
    }
    // Fallback to HTTP status with description
    return `HTTP ${responseData.status} ${responseData.status >= 400 ? 'Error' : 'Success'}`;
  };

  const getStatusIcon = () => {
    const status = getDisplayStatus().toLowerCase();
    if (status.includes('successful') || status.includes('success') || responseData.status < 400) return <CheckCircleIcon color="success" />;
    if (status.includes('error') || status.includes('failed') || status.includes('rejected') || status.includes('not found') || responseData.status >= 400) return <ErrorIcon color="error" />;
    if (status.includes('pending')) return <InfoIcon color="info" />;
    return <InfoIcon color="info" />;
  };

  const getStatusColor = () => {
    const status = getDisplayStatus().toLowerCase();
    if (status.includes('successful') || status.includes('success') || responseData.status < 400) return 'success.main';
    if (status.includes('error') || status.includes('failed') || status.includes('rejected') || status.includes('not found') || responseData.status >= 400) return 'error.main';
    if (status.includes('pending')) return 'warning.main';
    return 'info.main';
  };

  const hasError = () => {
    const status = getDisplayStatus().toLowerCase();
    return status.includes('error') || status.includes('failed') || status.includes('rejected') || status.includes('not found') || responseData.status >= 400;
  };

  return (
    <Card sx={{ mt: 2, border: hasError() ? '2px solid' : 'none', borderColor: hasError() ? 'error.main' : 'transparent' }}>
      <CardContent>
        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <DescriptionIcon color={hasError() ? "error" : "primary"} />
          {title}
        </Typography>

        {/* Error Alert Box */}
        {hasError() && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">
              {getDisplayStatus()}
            </Typography>
          </Alert>
        )}

        {/* Request Info */}
        <Box sx={{ mb: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
            Request Details:
          </Typography>
          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1 }}>
            <strong>Status:</strong>
            {getStatusIcon()}
            <Box component="span" color={getStatusColor()}>
              {getDisplayStatus()}
            </Box>
          </Typography>
        </Box>

        {/* Request Body for Payout */}
        {responseData.requestBody && (
          <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, mt: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              Request Sent:
            </Typography>
            {Object.entries(responseData.requestBody).map(([key, value]: [string, any]) => (
              <Typography key={key} variant="body2" sx={{ mb: 1 }}>
                <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong>{' '}
                {String(value)}
              </Typography>
            ))}
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

export function RefundReq() {
  const dispatch = useDispatch<AppDispatch>();
  const { refundReqs, loading, error } = useSelector((state: RootState) => state?.admin);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedRequest, setSelectedRequest] = useState<RefundRequestTyp | null>(null);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<ApiResponseData | null>(null);
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [loadingRefund, setLoadingRefund] = useState(false);
  const [savingNotes, setSavingNotes] = useState(false);

  useEffect(() => {
    dispatch(getAdminRefundReq());
  }, [dispatch]);

  // Get status chip color
  const getStatusColor = (status: string): "success" | "warning" | "error" | "info" | "default" => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      case 'refunded':
        return 'info';
      case 'cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  // Format currency
  const formatCurrency = (amount: number): string =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF'
    }).format(amount);

  // Filter refund requests
  const filteredRefundReqs: RefundRequestTyp[] = refundReqs?.filter((request: RefundRequestTyp) => {
    const matchesSearch =
      request.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || request.refundStatus === statusFilter;

    return matchesSearch && matchesStatus;
  }) || [];

  // Handler functions
  const handleViewDetails = (request: RefundRequestTyp): void => {
    setSelectedRequest(request);
    setModalOpen(true);
    setApiResponse(null);
    setAdminNotes(request.adminNotes || '');
  };

  const handleCloseModal = (): void => {
    setModalOpen(false);
    setSelectedRequest(null);
    setApiResponse(null);
    setAdminNotes('');
  };

  const handleApprove = async (request: RefundRequestTyp) => {
    try {
      const res = await axios.put(`/refund-request/${request._id}`, {
        refundStatus: 'approved',
        adminNotes: adminNotes || 'Refund request approved by admin',
      });
      console.log("✅ Refund request approved:", res.data);
      toast.success("Refund request approved successfully!");
      setTimeout(() => handleCloseModal(), 1500); // close after 1.5 sec
      dispatch(getAdminRefundReq()); // Refresh the list
      handleCloseModal();
    } catch (err: any) {
      console.error("❌ Failed to approve refund:", err.response?.data || err.message);
      toast.error(`Failed to approve refund: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleReject = async (request: RefundRequestTyp) => {
    try {
      const res = await axios.put(`/refund-request/${request._id}`, {
        refundStatus: 'rejected',
        adminNotes: adminNotes || 'Refund request rejected by admin',
      });
      console.log("✅ Refund request rejected:", res.data);
      toast.success("Refund request rejected successfully!");
      setTimeout(() => handleCloseModal(), 1500);
      dispatch(getAdminRefundReq()); // Refresh the list
      handleCloseModal();
    } catch (err: any) {
      console.error("❌ Failed to reject refund:", err.response?.data || err.message);
      toast.error(`Failed to reject refund: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleProceedRefund = async (request: RefundRequestTyp) => {
    try {
      console.log("🟢 Starting refund process for:", request);
      setLoadingRefund(true);
      setApiResponse(null);

      // Step 1: Check payment status
      const transId = request.transactionId;
      console.log("🔍 Checking payment status for transId:", transId);

      const statusRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'https://sandbox.fapshi.com'}/payment-status/${transId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "apiuser": import.meta.env.VITE_API_USER || 'f046347f-8d27-40cd-af94-90bc44f3d2c7',
          "apikey": import.meta.env.VITE_API_KEY || 'FAK_TEST_177a608c18c0db8c50be',
        },
      });
      const safeJson = async (response: Response) => {
        try {
          const clone = response.clone(); // 🔥 so we don't consume the original
          const text = await clone.text();
          return text ? JSON.parse(text) : {};
        } catch {
          return {};
        }
      };

      console.log("📡 Payment status response status:", statusRes.status);
      const statusData = await safeJson(statusRes);
      console.log("RAW TEXT:", await statusRes.text());

      // Check if transaction not found or other error
      let paymentError = '';
      if (statusRes.status === 404) {
        paymentError = 'Transaction not found';
      } else if (statusRes.status >= 400) {
        paymentError = statusData.message || `Payment status check failed with status ${statusRes.status}`;
      } else if (statusData?.status !== "SUCCESSFUL") {
        paymentError = `Transaction status: ${statusData.status}. Refund cannot proceed.`;
      }

      // Store payment status response with proper typing
      setApiResponse((prev: ApiResponseData | null) => ({
        ...prev,
        paymentStatusCheck: {
          url: `${import.meta.env.VITE_BASE_URL || 'https://sandbox.fapshi.com'}/payment-status/${transId}`,
          status: statusRes.status,
          data: statusData,
          error: paymentError
        }
      }));

      if (paymentError) {
        setAdminNotes(`Payment status check failed: ${paymentError}`);
        return;
      }

      console.log("✅ Transaction successful. Proceeding with payout...");

      let phoneNumber = request.user.phone || "";
      // Ensure it includes country code (Cameroon = 237)
      if (phoneNumber && !phoneNumber.startsWith("237")) {
        phoneNumber = phoneNumber.replace(/^\+/, "");
      }

      // Step 2: Proceed with payout
      const payoutBody = {
        amount: request.refundAmount,
        phone: phoneNumber,
        medium: request.paymentMethod?.replace("_", " "),
        name: request.user.name,
        email: request.user.email,
        userId: request.user._id,
        externalId: request.transactionId,
      };

      console.log("📤 Payout request body:", payoutBody);

      const payoutRes = await fetch(`${import.meta.env.VITE_BASE_URL || 'https://sandbox.fapshi.com'}/payout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "apiuser": import.meta.env.VITE_API_USER || 'f046347f-8d27-40cd-af94-90bc44f3d2c7',
          "apikey": import.meta.env.VITE_API_KEY || 'FAK_TEST_177a608c18c0db8c50be',
        },
        body: JSON.stringify(payoutBody),
      });

      console.log("📡 Payout response status:", payoutRes.status);
      const payoutData = await safeJson(payoutRes);

      // FIXED: Check for payout success/failure
      let payoutError = '';
      let isSuccess = false;

      if (payoutRes.status >= 400) {
        // HTTP error (400, 500, etc.)
        payoutError = payoutData.message || `Payout failed with status ${payoutRes.status}`;
      } else if (payoutData.message === "Accepted" && payoutData.transId) {
        // SUCCESS: "Accepted" with transaction ID means successful
        isSuccess = true;
      } else if (payoutData.status && payoutData.status !== "SUCCESSFUL") {
        // Other status checks
        payoutError = payoutData.message || `Payout status: ${payoutData.status}`;
      } else if (!payoutData.transId) {
        // No transaction ID indicates failure
        payoutError = payoutData.message || 'Payout failed: No transaction ID received';
      } else {
        // Default success case
        isSuccess = true;
      }

      // Store payout response with proper typing - include error if any
      setApiResponse((prev: ApiResponseData | null) => ({
        ...prev,
        payoutRequest: {
          url: `${import.meta.env.VITE_BASE_URL || 'https://sandbox.fapshi.com'}/payout`,
          status: payoutRes.status,
          data: payoutData,
          requestBody: payoutBody,
          error: payoutError || undefined // Use undefined instead of empty string for no error
        }
      }));

      if (isSuccess) {
        // SUCCESS CASE
        const transactionId = payoutData.transId || payoutData.transactionId || 'N/A';
        const notes = `Refund processed successfully via Fapshi. Transaction ID: ${transactionId}`;
        setAdminNotes(notes);

        // Update backend to 'refunded' status
        try {
          const res = await axios.put(`/refund-request/${request._id}`, {
            refundStatus: 'refunded',
            adminNotes: notes,
            refundTransactionId: transactionId,
          });
          console.log("✅ Refund request updated in backend:", res.data);
          toast.success("Refund processed successfully!");
          setTimeout(() => handleCloseModal(), 1500);
          dispatch(getAdminRefundReq()); // Refresh the list
        } catch (err: any) {
          console.error("❌Failed to update refund request in backend:", err.response?.data || err.message);
          toast.error("Failed to update refund status in backend!");
          setAdminNotes(`${notes} (Failed to update backend)`);
        }
      } else {
        // FAILURE CASE
        const notes = adminNotes || `Refund failed: ${payoutError}`;
        setAdminNotes(notes);

        // Update backend to 'rejected' status
        try {
          const res = await axios.put(`/refund-request/${request._id}`, {
            refundStatus: 'rejected',
            adminNotes: notes,
          });
          console.log("ℹ️ Backend notes updated for failed refund:", res.data);
          toast.error(`Refund failed: ${payoutError}`);
          dispatch(getAdminRefundReq()); // Refresh the list
        } catch (err: any) {
          console.error("❌ Failed to update backend notes for failed refund:", err.response?.data || err.message);
          toast.error("Failed to update backend after refund failure!");
        }
      }

    } catch (err: any) {
      console.group("❌ Error during refund process");
      console.error("Full error object:", err);
      console.error("Error message:", err.message);
      console.error("Error stack:", err.stack);
      console.groupEnd();

      const errorMsg = err.message || "Unknown error occurred";
      alert("❌ Something went wrong while processing the refund.");

      // Store error in API response with proper typing
      setApiResponse((prev: ApiResponseData | null) => ({
        ...prev,
        error: {
          message: err.message,
          stack: err.stack,
          fullError: err
        }
      }));

      // Auto-fill admin notes with error
      setAdminNotes(`System error: ${errorMsg}. Please check API response for technical details.`);
    } finally {
      setLoadingRefund(false);
      console.log("🟡 Refund process ended for:", request.transactionId);
    }
  };
  const handleSaveAdminNotes = async () => {
    if (selectedRequest && adminNotes.trim()) {
      try {
        setSavingNotes(true);
        const res = await axios.put(`/refund-request/${selectedRequest._id}`, {
          adminNotes: adminNotes.trim(),
        });
        console.log("✅ Admin notes saved:", res.data);
        toast.success("Admin notes saved successfully!");
        dispatch(getAdminRefundReq()); // Refresh the list
      } catch (err: any) {
        console.error("❌ Failed to save admin notes:", err.response?.data || err.message);
        toast.error(`Failed to save admin notes: ${err.response?.data?.message || err.message}`);
      } finally {
        setSavingNotes(false);
      }
    }
  };

  // Check if process refund button should be disabled
  const isProcessRefundDisabled = (request: RefundRequestTyp) =>
    request.refundStatus === 'rejected' ||
    request.refundStatus === 'refunded' ||
    request.refundStatus === 'cancelled';

  // Check if admin notes section should be shown
  const shouldShowAdminNotes = (request: RefundRequestTyp) =>
    request.refundStatus !== 'rejected';

  // Table headers
  const headers: string[] = [
    'User',
    'Event Date',
    'Refund Amount',
    'Tickets',
    'Status',
    'Request Date',
    'Actions'
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }


  return (
    <DashboardContent>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Refund Requests
      </Typography>

      {/* Filters and Search */}
      <Card sx={{ mb: 3, p: 2 }}>
        <CardContent>
          <Box display="flex" gap={2} alignItems="center" flexWrap="wrap">
            <TextField
              placeholder="Search by name, email or reason..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 300 }}
              size="small"
            />

            <TextField
              select
              label="Status"
              value={statusFilter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setStatusFilter(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <FilterListIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 150 }}
              size="small"
            >
              <MenuItem value="all">All Status</MenuItem>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
              <MenuItem value="refunded">Refunded</MenuItem>
              <MenuItem value="cancelled">Cancelled</MenuItem>
            </TextField>

            <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>
              Showing {filteredRefundReqs.length} of {refundReqs?.length || 0} requests
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Table or No Data */}
      {filteredRefundReqs.length > 0 ? (
        <TableContainer component={Paper} elevation={3}>
          <Table sx={{ minWidth: 650 }} aria-label="refund requests table">
            <TableHead>
              <TableRow sx={{ bgcolor: '#1F8FCD' }}>
                {headers.map((header: string) => (
                  <TableCell
                    key={header}
                    sx={{
                      color: 'white',
                      fontWeight: 'bold',
                      fontSize: '0.9rem',
                      py: 2,
                      bgcolor: '#1F8FCD'
                    }}
                    align="center"
                  >
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRefundReqs.map((request: RefundRequestTyp) => (
                <TableRow
                  key={request._id}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '&:hover': { backgroundColor: '#f5f5f5' }
                  }}
                >
                  {/* User */}
                  <TableCell align="center">
                    <Box display="flex" alignItems="center" justifyContent="center">
                      <Avatar
                        src={request.user?.avatar?.url}
                        sx={{ width: 32, height: 32, mr: 1 }}
                      >
                        {request.user?.name?.charAt(0)}
                      </Avatar>
                      <Box textAlign="left">
                        <Typography variant="body2" fontWeight="medium">
                          {request.user?.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {request.user?.email}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>

                  {/* Event Date */}
                  <TableCell align="center">
                    <Typography variant="body2">
                      {formatEventDate(request.eventDate)}
                    </Typography>
                  </TableCell>

                  {/* Refund Amount */}
                  <TableCell align="center">
                    <Typography
                      variant="body2"
                      fontWeight="bold"
                      color="error.main"
                    >
                      {request.refundAmount} XAF
                    </Typography>
                  </TableCell>

                  {/* Tickets */}
                  <TableCell align="center">
                    <Box>
                      {request.tickets?.slice(0, 2).map((ticket: any, index: number) => (
                        <Typography key={ticket._id || index} variant="caption" display="block">
                          {ticket.quantity}x {ticket.ticketType}
                        </Typography>
                      ))}
                      {request.tickets?.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{request.tickets.length - 2} more
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  {/* Status */}
                  <TableCell align="center">
                    <Chip
                      label={request.refundStatus.charAt(0).toUpperCase() + request.refundStatus.slice(1)}
                      color={getStatusColor(request.refundStatus)}
                      size="small"
                    />
                  </TableCell>

                  {/* Request Date */}
                  <TableCell align="center">
                    <Typography variant="body2">
                      {formatEventDate(request.createdAt)}
                    </Typography>
                  </TableCell>

                  {/* Actions */}
                  <TableCell align="center">
                    <Box display="flex" gap={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        color="primary"
                        onClick={() => handleViewDetails(request)}
                      >
                        View
                      </Button>

                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Paper
          elevation={3}
          sx={{
            p: 6,
            textAlign: 'center',
            mt: 2,
            backgroundColor: '#fafafa'
          }}
        >
          <Box sx={{ color: 'text.secondary' }}>
            <Typography variant="h5" gutterBottom color="text.secondary">
              {searchTerm || statusFilter !== 'all' ? '🔍 No Matching Results' : '📭 No Refund Requests'}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
              {searchTerm || statusFilter !== 'all'
                ? 'No refund requests match your search criteria. Try adjusting your filters.'
                : 'There are no refund requests to display at the moment.'
              }
            </Typography>
            {(searchTerm || statusFilter !== 'all') && (
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Box>
        </Paper>
      )}

      {/* Summary Stats */}
      {filteredRefundReqs.length > 0 && (
        <Box mt={2} display="flex" gap={2} flexWrap="wrap">
          <Chip
            label={`Total: ${filteredRefundReqs.length}`}
            variant="outlined"
            color="primary"
          />
          <Chip
            label={`Pending: ${filteredRefundReqs.filter((req: RefundRequestTyp) => req.refundStatus === 'pending').length}`}
            variant="outlined"
            color="warning"
          />
          <Chip
            label={`Approved: ${filteredRefundReqs.filter((req: RefundRequestTyp) => req.refundStatus === 'approved').length}`}
            variant="outlined"
            color="success"
          />
          <Chip
            label={`Rejected: ${filteredRefundReqs.filter((req: RefundRequestTyp) => req.refundStatus === 'rejected').length}`}
            variant="outlined"
            color="error"
          />
        </Box>
      )}

      {/* Refund Details Modal */}
      <Modal
        open={modalOpen}
        onClose={handleCloseModal}
        aria-labelledby="refund-details-modal"
        aria-describedby="refund-request-details"
      >
        <Box sx={modalStyle}>
          {selectedRequest && (
            <>
              {/* Header */}
              <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    Refund Request Details
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Request ID: {selectedRequest._id}
                  </Typography>
                </Box>
                <IconButton onClick={handleCloseModal} size="small">
                  <CloseIcon />
                </IconButton>
              </Box>

              <Grid container spacing={3}>
                {/* Left Column - Status and Basic Info */}
                <Grid item xs={12} lg={8}>
                  <StatusCard
                    status={selectedRequest.refundStatus}
                    amount={selectedRequest.refundAmount}
                    date={selectedRequest.createdAt}
                  />

                  {/* User Information */}
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon color="primary" />
                        User Information
                      </Typography>
                      <Stack spacing={2}>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar
                            src={selectedRequest.user?.avatar?.url}
                            sx={{ width: 50, height: 50 }}
                          >
                            {selectedRequest.user?.name?.charAt(0)}
                          </Avatar>
                          <Box>
                            <Typography variant="body1" fontWeight="bold">
                              {selectedRequest.user?.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {selectedRequest.user?.email}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Phone: {selectedRequest.user?.phone || 'N/A'}
                            </Typography>
                          </Box>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Ticket Details */}
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <ReceiptIcon color="primary" />
                        Ticket Details
                      </Typography>
                      <Stack spacing={2}>
                        {selectedRequest.tickets?.map((ticket, index) => (
                          <Box key={ticket._id} sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                            <Grid container spacing={2} alignItems="center">
                              <Grid item xs={12} sm={6}>
                                <Typography variant="body1" fontWeight="medium">
                                  {ticket.ticketType}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Quantity: {ticket.quantity}
                                </Typography>
                              </Grid>
                              <Grid item xs={12} sm={6} textAlign={{ xs: 'left', sm: 'right' }}>
                                <Typography variant="body1" fontWeight="bold">
                                  {formatCurrency(ticket.unitPrice)}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Total: {formatCurrency(ticket.unitPrice * ticket.quantity)}
                                </Typography>
                              </Grid>
                            </Grid>
                          </Box>
                        ))}
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* API Response Data - Human Readable */}
                  {apiResponse && (
                    <>
                      {apiResponse.paymentStatusCheck && (
                        <ApiResponseDisplay
                          responseData={apiResponse.paymentStatusCheck}
                          title="Payment Status Check"
                        />
                      )}
                      {apiResponse.payoutRequest && (
                        <ApiResponseDisplay
                          responseData={apiResponse.payoutRequest}
                          title="Payout Request"
                        />
                      )}
                      {apiResponse.error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                          <Typography variant="body1" fontWeight="bold">
                            System Error: {apiResponse.error.message}
                          </Typography>
                        </Alert>
                      )}
                    </>
                  )}

                  {/* Rejection Reason Section - Show when status is rejected */}
                  {selectedRequest.refundStatus === 'rejected' && selectedRequest.adminNotes && (
                    <Card sx={{ mt: 3, border: '2px solid', borderColor: 'error.main' }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                          <ErrorIcon color="error" />
                          Rejection Reason
                        </Typography>
                        <Alert severity="error" sx={{ mt: 1 }}>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedRequest.adminNotes}
                          </Typography>
                        </Alert>
                        {apiResponse && (
                          <Box sx={{ mt: 2 }}>
                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                              Technical Details:
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {apiResponse.payoutRequest?.error || apiResponse.paymentStatusCheck?.error || 'No technical details available'}
                            </Typography>
                          </Box>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Admin Notes Section - Hide when status is rejected */}
                  {shouldShowAdminNotes(selectedRequest) && (
                    <Card sx={{ mt: 3 }}>
                      <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <NotesIcon color="primary" />
                          Admin Notes & Feedback
                        </Typography>
                        <TextField
                          fullWidth
                          multiline
                          rows={4}
                          value={adminNotes}
                          onChange={(e) => setAdminNotes(e.target.value)}
                          placeholder="Add notes about this refund request... (This field auto-fills with API response messages)"
                          variant="outlined"
                          sx={{ mt: 1 }}
                        />
                        <Box sx={{ mt: 2, display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
                          <Button
                            variant="outlined"
                            onClick={() => setAdminNotes('')}
                            disabled={!adminNotes}
                          >
                            Clear
                          </Button>
                          <Button
                            variant="contained"
                            onClick={handleSaveAdminNotes}
                            disabled={!adminNotes || savingNotes}
                          >
                            {savingNotes ? <CircularProgress size={20} /> : 'Save Notes'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  )}
                </Grid>

                {/* Right Column - Event and Payment Info */}
                <Grid item xs={12} lg={4}>
                  {/* Event Information */}
                  <Card>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EventIcon color="primary" />
                        Event Information
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Event Date
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatEventDate(selectedRequest.eventDate)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Event ID
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {selectedRequest.event?._id}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PaymentIcon color="primary" />
                        Payment Information
                      </Typography>
                      <Stack spacing={2}>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Payment Method
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" textTransform="capitalize">
                            {selectedRequest.paymentMethod?.replace('_', ' ')}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Transaction ID
                          </Typography>
                          <Typography variant="body1" fontWeight="medium" fontFamily="monospace" fontSize="0.8rem">
                            {selectedRequest.transactionId}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Order Total
                          </Typography>
                          <Typography variant="body1" fontWeight="bold" color="primary.main">
                            {formatCurrency(selectedRequest.totalAmount)}
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Refund Amount
                          </Typography>
                          <Typography variant="h6" fontWeight="bold" color="success.main">
                            {formatCurrency(selectedRequest.refundAmount)}
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>

                  {/* Reason & Notes */}
                  <Card sx={{ mt: 3 }}>
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <NotesIcon color="primary" />
                        Refund Reason
                      </Typography>
                      <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'grey.50', borderRadius: 1, fontStyle: 'italic' }}>
                        {selectedRequest.reason}
                      </Typography>

                      {selectedRequest.adminNotes && selectedRequest.refundStatus !== 'rejected' && (
                        <>
                          <Typography variant="h6" fontWeight="bold" gutterBottom sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <NotesIcon color="secondary" />
                            Existing Admin Notes
                          </Typography>
                          <Typography variant="body1" sx={{ mt: 1, p: 2, bgcolor: 'warning.light', borderRadius: 1 }}>
                            {selectedRequest.adminNotes}
                          </Typography>
                        </>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Action Buttons */}
              <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid', borderColor: 'divider' }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={handleCloseModal}>
                    Close
                  </Button>
                  {selectedRequest.refundStatus === 'processed' && (
                    <>
                      <Button variant="contained" color="error" onClick={() => handleReject(selectedRequest)}>
                        Reject Request
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        disabled={loadingRefund || isProcessRefundDisabled(selectedRequest)}
                        onClick={() => handleProceedRefund(selectedRequest)}
                      >
                        {loadingRefund ? "Processing..." : "Proceed Refund"}
                      </Button>
                    </>
                  )}


                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Modal>
    </DashboardContent>
  );
}