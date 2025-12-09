// src/components/reservations-table/reservations-table.tsx
import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  Button,
  Box,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { Close, Visibility } from "@mui/icons-material";
import { formatDateTimeCustom } from "src/hooks/formate-time";

interface Project {
  _id: string;
  projectId?: {
    _id: string;
    eventId: {
      eventName: string;
      date: string;
      location: string;
    };
    categoryId: {
      name: string;
    };
    serviceTime: string;
    orgBudget: string;
  };
  eventId?: {
    eventName: string;
    date: string;
    location: string;
  };
  serviceRequestId?: {
    serviceType?: string;
  };
  orgBudget?: number;
  bidAmount?: number;
  winningBid?: number;
  organizrAmount?: number;
  status: string;
  projectType: "Bid" | "EventReq";
  projectStatus: "active" | "completed";
  createdAt: string;
}

interface ReservationsTableProps {
  projects: Project[];
  type: "active" | "completed";
}

export function ReservationsTable({ projects, type }: ReservationsTableProps) {
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleViewDetails = (project: Project) => {
    setSelectedProject(project);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedProject(null);
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formatCurrency = (amount: number) => `${amount?.toLocaleString()} XAF`;


  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "accepted":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "primary";
      case "Bid":
        return "primary";
      case "EventReq":
        return "warning";
      default:
        return "default";
    }
  };

  const tableHeaders = [
    "Event Name",
    "Category / Service Type",
    "Service Date",
    "Winning Amount",
    "Status",
    "Type",
    "Actions",
  ];

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 2 }}>
        <Table sx={{ minWidth: 650 }} aria-label="reservations table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {tableHeaders.map((header) => (
                <TableCell key={header} sx={{ fontWeight: "bold" }}>
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {projects.map((project) => (
              <TableRow
                key={project._id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { backgroundColor: "#fafafa" },
                }}
              >
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {project.projectId?.eventId?.eventName ||
                      project.eventId?.eventName ||
                      "N/A"}
                  </Typography>
                </TableCell>
                <TableCell>
                  {project.projectId?.categoryId?.name || project?.serviceRequestId?.serviceType || "N/A"}
                </TableCell>
                <TableCell>
                  {formatDate(
                    project.projectId?.serviceTime ||
                    project.createdAt
                  )}
                </TableCell>
                {/* <TableCell>
                  {project.projectId?.orgBudget ?
                    `${project.projectId.orgBudget} XAF` :
                    formatCurrency(project.organizrAmount || 0)}
                </TableCell> */}
                <TableCell>
                  {project.orgBudget ?
                    formatCurrency(project.orgBudget) :
                    project.winningBid ?
                      formatCurrency(project.winningBid) :
                      "N/A"}
                </TableCell>
                <TableCell>
                  <Chip
                    sx={{ textTransform: 'capitalize' }}
                    label={project.projectStatus}
                    color={getStatusColor(project.projectStatus)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    label={project.projectType}
                    color={getStatusColor(project.projectType)}
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<Visibility />}
                    onClick={() => handleViewDetails(project)}
                    sx={{
                      textTransform: "none",
                      borderColor: "#2295D4",
                      color: "#2295D4",
                      "&:hover": {
                        borderColor: "#1976d2",
                        backgroundColor: "rgba(34, 149, 212, 0.04)",
                      },
                    }}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {projects.length === 0 && (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="h6" color="textSecondary">
              No {type} projects found
            </Typography>
          </Box>
        )}
      </TableContainer>

      {/* Project Details Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="lg"
        fullWidth
        scroll="paper"
      >
        <DialogTitle sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          backgroundColor: "#2295D4",
          color: "white"
        }}>
          <Box>
            <Typography variant="h6" component="div">
              Project Details
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
              <Chip
                label={selectedProject?.projectType}
                color={selectedProject?.projectType === "Bid" ? "primary" : "warning"}
                size="small"
                sx={{ color: 'white' }}
              />
              <Chip
                label={selectedProject?.projectStatus}
                color={selectedProject?.projectStatus === "active" ? "success" : "primary"}
                size="small"
                sx={{ color: 'white' }}
              />
            </Box>
          </Box>
          <IconButton onClick={handleCloseDialog} sx={{ color: "white" }}>
            <Close />
          </IconButton>
        </DialogTitle>

        <DialogContent sx={{ mt: 2 }}>
          {selectedProject && (
            <Box sx={{ p: 1 }}>
              {/* Common Information */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1 }}>
                    Basic Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project ID
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {selectedProject._id}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project Type
                  </Typography>
                  <Chip
                    label={selectedProject.projectType}
                    color={selectedProject.projectType === "Bid" ? "primary" : "warning"}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Project Status
                  </Typography>
                  <Chip
                    label={selectedProject.projectStatus}
                    color={selectedProject.projectStatus === "active" ? "success" : "primary"}
                    size="small"
                  />
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Created Date
                  </Typography>
                  <Typography variant="body2">
                    {formatDateTimeCustom(selectedProject.createdAt)}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Updated Date
                  </Typography>
                  <Typography variant="body2">
                    {selectedProject.updatedAt ? formatDateTimeCustom(selectedProject.updatedAt) : "N/A"}
                  </Typography>
                </Grid>
              </Grid>

              {/* Event Information */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                    Event Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Event Name
                  </Typography>
                  <Typography variant="body1" fontWeight="medium">
                    {selectedProject.projectId?.eventId?.eventName ||
                      selectedProject.eventId?.eventName ||
                      "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Event Date
                  </Typography>
                  <Typography variant="body2">
                    {selectedProject.projectId?.eventId?.date ?
                      formatDate(selectedProject.projectId.eventId.date) :
                      selectedProject.eventId?.date ?
                        formatDate(selectedProject.eventId.date) :
                        "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Event Time
                  </Typography>
                  <Typography variant="body2">
                    {selectedProject.projectId?.eventId?.time ||
                      selectedProject.eventId?.time ||
                      "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Event Location
                  </Typography>
                  <Typography variant="body2">
                    {selectedProject.projectId?.eventId?.location ||
                      selectedProject.eventId?.location ||
                      selectedProject.eventLocation ||
                      "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Event Format
                  </Typography>
                  <Typography variant="body2">
                    {selectedProject.projectId?.eventId?.format ||
                      selectedProject.eventId?.format ||
                      "N/A"}
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Event Type
                  </Typography>
                  <Typography variant="body2">
                    {selectedProject.projectId?.eventId?.eventType ||
                      selectedProject.eventId?.eventType ||
                      "N/A"}
                  </Typography>
                </Grid>

                {/* Event Description */}
                {(selectedProject.projectId?.eventId?.description || selectedProject.eventId?.description) && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Event Description
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        backgroundColor: '#f8f9fa',
                        borderRadius: 1,
                        border: '1px solid #e0e0e0'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedProject.projectId?.eventId?.description || selectedProject.eventId?.description || ""
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Service/Project Details */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                    {selectedProject.projectType === "EventReq" ? "Service Request Details" : "Project Details"}
                  </Typography>
                </Grid>

                {/* EventReq Specific Fields */}
                {selectedProject.projectType === "EventReq" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Service Type
                      </Typography>
                      <Typography variant="body2" fontWeight="medium">
                        {selectedProject.serviceRequestId?.serviceType || "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Service Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.serviceTime ? formatDateTimeCustom(selectedProject.serviceTime) : "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Service Budget Range
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.serviceRequestId?.budget || "N/A"}
                      </Typography>
                    </Grid>

                    {selectedProject.serviceRequestId?.description && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Service Description
                        </Typography>
                        <Box
                          sx={{
                            mt: 1,
                            p: 2,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: selectedProject.serviceRequestId.description
                          }}
                        />
                      </Grid>
                    )}
                  </>
                )}

                {/* Bid Specific Fields */}
                {selectedProject.projectType === "Bid" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Category
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.projectId?.categoryId?.name || "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Service Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.projectId?.serviceTime ? formatDateTimeCustom(selectedProject.projectId.serviceTime) : "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Organizer Budget Range
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.projectId?.orgBudget || "N/A"}
                      </Typography>
                    </Grid>

                    {selectedProject.projectId?.orgRequirement && (
                      <Grid item xs={12}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Organizer Requirements
                        </Typography>
                        <Box
                          sx={{
                            mt: 1,
                            p: 2,
                            backgroundColor: '#f8f9fa',
                            borderRadius: 1,
                            border: '1px solid #e0e0e0'
                          }}
                          dangerouslySetInnerHTML={{
                            __html: selectedProject.projectId.orgRequirement
                          }}
                        />
                      </Grid>
                    )}
                  </>
                )}
              </Grid>

              {/* Financial Information */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                    Financial Information
                  </Typography>
                </Grid>

                {/* EventReq Financials */}
                {selectedProject.projectType === "EventReq" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Organizer Budget
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color="#2295D4">
                        {selectedProject.orgBudget ? formatCurrency(selectedProject.orgBudget) : "N/A"}
                      </Typography>
                    </Grid>

                    {selectedProject.providerProposal && (
                      <>
                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Proposed Amount
                          </Typography>
                          <Typography variant="body1" fontWeight="medium">
                            {formatCurrency(selectedProject.providerProposal.amount)}
                          </Typography>
                        </Grid>

                        <Grid item xs={12} sm={6} md={4}>
                          <Typography variant="subtitle2" color="textSecondary">
                            Delivery Days
                          </Typography>
                          <Typography variant="body2">
                            {selectedProject.providerProposal.days} days
                          </Typography>
                        </Grid>
                      </>
                    )}
                  </>
                )}

                {/* Bid Financials */}
                {selectedProject.projectType === "Bid" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Your Bid Amount
                      </Typography>
                      <Typography variant="body1" fontWeight="medium">
                        {selectedProject.bidAmount ? formatCurrency(selectedProject.bidAmount) : "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Winning Bid
                      </Typography>
                      <Typography variant="body1" fontWeight="medium" color="success.main">
                        {selectedProject.winningBid ? formatCurrency(selectedProject.winningBid) : "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Organizer Amount
                      </Typography>
                      <Typography variant="body1">
                        {selectedProject.organizrAmount ? formatCurrency(selectedProject.organizrAmount) : "N/A"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Admin Fee
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.adminFeePaid ?
                          `Paid - ${formatCurrency(selectedProject.adminFeeAmount || 0)}` :
                          "Not Paid"}
                      </Typography>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Delivery Time
                      </Typography>
                      <Typography variant="body2">
                        {selectedProject.deliveryTime} {selectedProject.deliveryUnit}
                      </Typography>
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Proposal & Requirements */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                    {selectedProject.projectType === "EventReq" ? "Proposal & Requirements" : "Bid Proposal"}
                  </Typography>
                </Grid>

                {/* EventReq Proposal */}
                {selectedProject.projectType === "EventReq" && selectedProject.providerProposal && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Provider Proposal Message
                    </Typography>
                    <Box sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: '#f0f7ff',
                      borderRadius: 1,
                      border: '1px solid #b3d9ff'
                    }}>
                      <Typography variant="body2">
                        {selectedProject.providerProposal.message}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* EventReq Requirements */}
                {selectedProject.projectType === "EventReq" && selectedProject.orgRequirement && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Organizer Requirements
                    </Typography>
                    <Box sx={{
                      mt: 1,
                      p: 2,
                      backgroundColor: '#fff8e1',
                      borderRadius: 1,
                      border: '1px solid #ffd54f'
                    }}>
                      <Typography variant="body2">
                        {selectedProject.orgRequirement}
                      </Typography>
                    </Box>
                  </Grid>
                )}

                {/* Bid Proposal */}
                {selectedProject.projectType === "Bid" && selectedProject.proposal && (
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="textSecondary">
                      Your Proposal
                    </Typography>
                    <Box
                      sx={{
                        mt: 1,
                        p: 2,
                        backgroundColor: '#f0f7ff',
                        borderRadius: 1,
                        border: '1px solid #b3d9ff'
                      }}
                      dangerouslySetInnerHTML={{
                        __html: selectedProject.proposal
                      }}
                    />
                  </Grid>
                )}
              </Grid>

              {/* Milestones (Bid Projects) */}
              {selectedProject.projectType === "Bid" && selectedProject.milestones && selectedProject.milestones.length > 0 && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                      Milestones
                    </Typography>
                  </Grid>
                  {selectedProject.milestones.map((milestone:any, index:any) => (
                    <Grid item xs={12} key={milestone._id}>
                      <Box sx={{
                        p: 2,
                        border: '2px solid #e0e0e0',
                        borderRadius: 2,
                        backgroundColor: milestone.isReleased ? '#e8f5e8' : '#f5f5f5'
                      }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            Milestone {index + 1}: {milestone.milestorneName}
                          </Typography>
                          <Chip
                            label={milestone.isReleased ? "Released" : "Pending"}
                            size="small"
                            color={milestone.isReleased ? "success" : "warning"}
                          />
                        </Box>
                        <Typography variant="body2" color="textSecondary">
                          Amount: <strong>{formatCurrency(milestone.amount)}</strong> •
                          Currency: <strong>{milestone.currency}</strong>
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}

              {/* Status Information */}
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                    Status Information
                  </Typography>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                  <Typography variant="subtitle2" color="textSecondary">
                    Contract Status
                  </Typography>
                  <Chip
                    label={selectedProject.status}
                    color={getStatusColor(selectedProject.status)}
                    size="small"
                  />
                </Grid>

                {/* EventReq Status */}
                {selectedProject.projectType === "EventReq" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Provider Status
                      </Typography>
                      <Chip
                        label={selectedProject.providerStatus || "N/A"}
                        color={selectedProject.providerStatus === "accepted" ? "success" : "default"}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Organizer Status
                      </Typography>
                      <Chip
                        label={selectedProject.orgStatus || "N/A"}
                        color={selectedProject.orgStatus === "accepted" ? "success" : "default"}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Contract Signed
                      </Typography>
                      <Chip
                        label={selectedProject.isSigned ? "Yes" : "No"}
                        color={selectedProject.isSigned ? "success" : "error"}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Provider Proposed
                      </Typography>
                      <Chip
                        label={selectedProject.providerHasProposed ? "Yes" : "No"}
                        color={selectedProject.providerHasProposed ? "success" : "error"}
                        size="small"
                      />
                    </Grid>
                  </>
                )}

                {/* Bid Status */}
                {selectedProject.projectType === "Bid" && (
                  <>
                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Organizer Accepted
                      </Typography>
                      <Chip
                        label={selectedProject.isOrgnizerAccepted ? "Yes" : "No"}
                        color={selectedProject.isOrgnizerAccepted ? "success" : "error"}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Provider Accepted
                      </Typography>
                      <Chip
                        label={selectedProject.isProviderAccepted ? "Yes" : "No"}
                        color={selectedProject.isProviderAccepted ? "success" : "error"}
                        size="small"
                      />
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                      <Typography variant="subtitle2" color="textSecondary">
                        Admin Fee Paid
                      </Typography>
                      <Chip
                        label={selectedProject.adminFeePaid ? "Yes" : "No"}
                        color={selectedProject.adminFeePaid ? "success" : "error"}
                        size="small"
                      />
                    </Grid>
                  </>
                )}
              </Grid>

              {/* Organizer Information */}
              {(selectedProject.organizerId || selectedProject.projectId?.createdBy) && (
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom sx={{ color: '#2295D4', borderBottom: '2px solid #2295D4', pb: 1, mt: 3 }}>
                      Organizer Information
                    </Typography>
                  </Grid>

                  {selectedProject.organizerId && (
                    <>
                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Organizer Name
                        </Typography>
                        <Typography variant="body2">
                          {selectedProject.organizerId.name}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Organizer Email
                        </Typography>
                        <Typography variant="body2">
                          {selectedProject.organizerId.email}
                        </Typography>
                      </Grid>

                      <Grid item xs={12} sm={6} md={4}>
                        <Typography variant="subtitle2" color="textSecondary">
                          Phone Number
                        </Typography>
                        <Typography variant="body2">
                          {selectedProject.organizerId.number || "N/A"}
                        </Typography>
                      </Grid>
                    </>
                  )}
                </Grid>
              )}
            </Box>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={handleCloseDialog}
            variant="contained"
            sx={{
              backgroundColor: "#2295D4",
              "&:hover": {
                backgroundColor: "#1976d2",
              },
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}