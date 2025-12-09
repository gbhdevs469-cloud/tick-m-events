import {
    Typography, Box, Card, CardContent, Grid,
    Chip, Avatar, Fade, Collapse, Tooltip, CircularProgress,
    Modal, IconButton, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow,
    Button, Dialog, DialogTitle, DialogContent,
    DialogActions, Stack, Paper
} from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ExpandMore, ExpandLess, Chat, Assignment, People, MonetizationOn, CheckCircle, ArrowForward,
    Print as PrintIcon, Close as CloseIcon,
    Event as EventIcon, LocationOn as LocationIcon,
    AttachMoney as MoneyIcon, Schedule as ScheduleIcon,
    Description as DescriptionIcon, Person as PersonIcon
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";

import { Iconify } from "src/components/iconify";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";
import { DashboardContent } from "src/layouts/dashboard";
import { AppDispatch, RootState } from "src/redux/store";
import { EventBreadCrum } from "src/sections/entry-validation/event-status";
import { formatDateTimeCustom } from "src/hooks/formate-time";

import { SignedStatusModal } from "./signed-modal";

// Types
interface Provider {
    _id: string;
    name: string;
    email: string;
    experience: string;
    avatar: {
        public_id: string;
        url: string;
    };
    isVerified: boolean;
    reviewCount: number;
}

interface Milestone {
    milestorneName: string;
    amount: number;
    currency: string;
    isReleased: boolean;
    _id: string;
}

interface WinningBid {
    _id: string;
    providerId: Provider;
    bidAmount: number;
    deliveryTime: number;
    deliveryUnit: string;
    winningBid: number;
    organizrAmount: number;
    isOrgnizerAccepted: boolean;
    isProviderAccepted: boolean;
    proposal: string;
    milestones: Milestone[];
    status: string;
    createdAt: string;
}

interface ProjectDetails {
    _id: string;
    eventId: string;
    categoryId: {
        _id: string;
        name: string;
    };
    subcategoryId: string;
    eventLocation: string;
    createdBy: string;
    isSigned: boolean;
    status: string;
    bidStatus: string;
    bidsCount: number;
    avgBidAmount: number;
    totalBidAmount: number;
    orgBudget: string;
    orgRequirement: string;
    orgAdditionalRequirement: string;
    providerHasProposed: boolean;
    serviceTime: string;
    createdAt: string;
    updatedAt: string;
}

interface SignedProject {
    projectDetails: ProjectDetails;
    winningBid: WinningBid;
    totalBids: number;
    bidsStatistics: {
        totalBids: number;
        averageBid: number;
        pendingBids: number;
        acceptedBids: number;
        rejectedBids: number;
    };
    projectStatus: string;
    bidStatus: string;
}

interface ProjectStatistics {
    totalProjects: number;
    signedProjects: number;
    openForBidding: number;
    closedProjects: number;
    cancelledProjects: number;
}

// Helper function for status colors
function getStatusColor(status: string) {
    switch (status) {
        case 'pending': return 'warning';
        case 'ongoing': return 'info';
        case 'completed': return 'success';
        case 'rejected': return 'error';
        default: return 'default';
    }
}

// Enhanced Project Details Modal Component
function ProjectDetailsModal({
    open,
    onClose,
    project
}: {
    open: boolean;
    onClose: () => void;
    project: SignedProject | null;
}) {
    const printRef = useRef<HTMLDivElement>(null);

    if (!project) return null;

    const handlePrint = () => {
        const printContent = printRef.current;
        if (!printContent) return;

        const printWindow = window.open('', '_blank');
        if (!printWindow) return;

        const allStyles = Array.from(document.querySelectorAll('style, link[rel="stylesheet"]'))
            .map(style => style.outerHTML)
            .join('\n');

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
                <head>
                    <title>Project Contract - ${project.projectDetails._id}</title>
                    <meta charset="utf-8">
                    <style>
                        @media print {
                            body { margin: 0; padding: 20px; background: white !important; color: black !important; }
                            .no-print { display: none !important; }
                            .print-section { break-inside: avoid; margin-bottom: 20px; }
                            * { -webkit-print-color-adjust: exact !important; color-adjust: exact !important; }
                        }
                        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; }
                        .watermark { 
                            position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%) rotate(-45deg);
                            opacity: 0.03; z-index: 0; pointer-events: none; 
                        }
                        .stamp { 
                            background: linear-gradient(45deg, #FF6B6B 0%, #FF8E53 100%) !important;
                            color: white !important; border: 3px solid white !important; 
                        }
                        .section-paper { 
                            border: 1px solid #E8EAF6; border-radius: 12px; padding: 20px; 
                            margin-bottom: 20px; background: white !important; position: relative;
                            box-shadow: 0 2px 12px rgba(0,0,0,0.08); 
                        }
                    </style>
                    ${allStyles}
                </head>
                <body>
                    <div class="print-content">${printContent.innerHTML}</div>
                    <script>window.onload = function() { window.print(); setTimeout(() => window.close(), 100); };</script>
                </body>
            </html>
        `);
        printWindow.document.close();
    };

    const ContractDetailsContent = () => (
        <div ref={printRef}>
            {/* Enhanced Header with Logo */}
            <Box className="contract-header">
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">
                            📄 Project Contract & Agreement
                        </Typography>
                        <Typography variant="subtitle1" sx={{ mt: 1 }}>
                            Contract ID: <strong>{project.projectDetails._id}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ opacity: 0.9, transform: 'rotate(5deg)' }}>
                        <Box className="stamp" sx={{ 
                            width: 45, 
                            height: 45, 
                            borderRadius: '50%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            fontWeight: 'bold', 
                            fontSize: '11px', 
                            textAlign: 'center', 
                            lineHeight: 1.1 
                        }}>
                            TICK-M<br />EVENTS
                        </Box>
                    </Box>
                </Box>
            </Box>

            {/* Enhanced Content */}
            <Box sx={{ py: 3, position: 'relative', minHeight: '100vh' }}>
                {/* Watermark */}
                <Box className="watermark">
                    <Typography variant="h1" fontWeight="bold" sx={{ fontSize: '120px', color: '#667eea', whiteSpace: 'nowrap' }}>
                      TICK-M EVENTS
                    </Typography>
                </Box>

                {/* Status Bar */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4, position: 'relative', zIndex: 1 }}>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip 
                            label={`Status: ${project.projectStatus}`} 
                            color={getStatusColor(project.projectStatus)} 
                            variant="filled" 
                            sx={{ fontWeight: 'bold' }} 
                        />
                        <Chip 
                            label={`Signed: ${project.projectDetails.isSigned ? '✅ Yes' : '❌ No'}`} 
                            color={project.projectDetails.isSigned ? "success" : "error"} 
                            variant="filled" 
                        />
                        <Chip 
                            label={`Budget: ${project.projectDetails.orgBudget} XAF`} 
                            color="primary" 
                            variant="outlined" 
                        />
                    </Box>
                </Box>

                <Grid container spacing={3} position="relative" zIndex={1}>
                    {/* Left Column */}
                    <Grid item xs={12} md={6}>
                        {/* Project Information Card */}
                        <Paper className="section-paper" sx={{ 

                        }}>
                            <Box className="stamp" sx={{ 
                                position: 'absolute', 
                                top: -12, 
                                right: -12, 
                                width: 28, 
                                height: 28, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 'bold', 
                                fontSize: '11px', 
                                boxShadow: '0 3px 10px rgba(0,0,0,0.2)' 
                            }}>
                                TM
                            </Box>
                            <Typography variant="h6" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                fontWeight: 'bold', 
                                  borderBottom: '2px solid #667eea',
                                pb: 1
                            }}>
                                 <EventIcon sx={{ mr: 1, color: '#667eea' }} /> Project Information
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Box sx={{ 
                                    p: 2, 
                                   
                                }}>
                                    <Typography variant="subtitle2" color="#667eea" fontWeight="bold">
                                        <EventIcon sx={{ fontSize: 16, mr: 1 }} />
                                        Category
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                                        {project.projectDetails.categoryId.name}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 2, 
                                   
                                }}>
                                    <Typography variant="subtitle2" color="#667eea" fontWeight="bold">
                                        <LocationIcon sx={{ fontSize: 16, mr: 1 }} />
                                        Location
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                                        {project.projectDetails.eventLocation}
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 2, 
                                   
                                }}>
                                    <Typography variant="subtitle2" color="#667eea" fontWeight="bold">
                                        <MoneyIcon sx={{ fontSize: 16, mr: 1 }} />
                                        Budget
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                                        {project.projectDetails.orgBudget} XAF
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 2, 
                                   
                                }}>
                                    <Typography variant="subtitle2" color="#667eea" fontWeight="bold">
                                        <ScheduleIcon sx={{ fontSize: 16, mr: 1 }} />
                                        Service Time
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                                        {formatDateTimeCustom(project.projectDetails.serviceTime)}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Requirements Card */}
                        <Paper className="section-paper" sx={{ 
                           mt:2
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                fontWeight: 'bold', 
                                color: '#37474f',
                                borderBottom: '2px solid #ff6b6b',
                                pb: 1
                            }}>
                                <DescriptionIcon sx={{ mr: 1, color: '#ff6b6b' }} /> Project Requirements
                            </Typography>
                            <Box sx={{ 
                                mt: 2, 
                                p: 2, 

                            }}>
                                <div dangerouslySetInnerHTML={{ __html: project.projectDetails.orgRequirement }} />
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Right Column */}
                    <Grid item xs={12} md={6}>
                        {/* Winning Bid Details Card */}
                        <Paper className="section-paper" sx={{ 
                           
                        }}>
                            <Box className="stamp" sx={{ 
                                position: 'absolute', 
                                top: -12, 
                                right: -12, 
                                width: 28, 
                                height: 28, 
                                borderRadius: '50%', 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                fontWeight: 'bold', 
                                fontSize: '11px', 
                                boxShadow: '0 3px 10px rgba(0,0,0,0.2)' 
                            }}>
                                TM
                            </Box>
                            <Typography variant="h6" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                fontWeight: 'bold', 
                                color: '#37474f',
                                borderBottom: '2px solid #4caf50',
                                pb: 1
                            }}>
                                <MoneyIcon sx={{ mr: 1, color: '#4caf50' }} /> Winning Bid Details
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                <Box sx={{ 
                                    p: 2, 
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="subtitle2" color="#4caf50" fontWeight="bold">
                                        Bid Amount
                                    </Typography>
                                    <Typography variant="h5" color="#4caf50" fontWeight="bold">
                                        {project.winningBid.bidAmount.toLocaleString()} XAF
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 2, 
                                    
                                    borderRadius: 2,
                                   
                                    textAlign: 'center'
                                }}>
                                    <Typography variant="subtitle2" color="#2e7d32" fontWeight="bold">
                                        Accepted Amount
                                    </Typography>
                                    <Typography variant="h5" color="#2e7d32" fontWeight="bold">
                                        {project.winningBid.winningBid.toLocaleString()} XAF
                                    </Typography>
                                </Box>
                                <Box sx={{ 
                                    p: 2,  
                                    borderRadius: 2,
                                   
                                }}>
                                    <Typography variant="subtitle2" color="#4caf50" fontWeight="bold">
                                        Delivery Time
                                    </Typography>
                                    <Typography variant="body1" fontWeight="500" sx={{ mt: 0.5 }}>
                                        {project.winningBid.deliveryTime} {project.winningBid.deliveryUnit}
                                    </Typography>
                                </Box>
                            </Stack>
                        </Paper>

                        {/* Milestones Card */}
                        <Paper className="section-paper" sx={{ 
                            mt:2
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                fontWeight: 'bold', 
                                color: '#37474f',
                                borderBottom: '2px solid #9c27b0',
                                pb: 1
                            }}>
                                <DescriptionIcon sx={{ mr: 1, color: '#9c27b0' }} /> Payment Milestones
                            </Typography>
                            <Stack spacing={2} sx={{ mt: 2 }}>
                                {project.winningBid.milestones.map((milestone, index) => (
                                    <Box key={milestone._id} sx={{ 
                                        p: 2, 
                                         
                                        borderRadius: 2,
                                       
                                        position: 'relative'
                                    }}>
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Box sx={{ 
                                                    width: 24, 
                                                    height: 24, 
                                                    borderRadius: '50%', 
                                                    backgroundColor: milestone.isReleased ? '#4caf50' : '#ff9800',
                                                    display: 'flex', 
                                                    alignItems: 'center', 
                                                    justifyContent: 'center',
                                                    color: 'white',
                                                    fontSize: '12px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {index + 1}
                                                </Box>
                                                <Typography variant="subtitle1" fontWeight="500">
                                                    {milestone.milestorneName}
                                                </Typography>
                                            </Box>
                                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                <Typography variant="h6" color="#9c27b0" fontWeight="bold">
                                                    {milestone.amount.toLocaleString()} {milestone.currency}
                                                </Typography>
                                                {milestone.isReleased && (
                                                    <Chip
                                                        label="Released"
                                                        size="small"
                                                        color="success"
                                                        variant="filled"
                                                        sx={{ fontWeight: 'bold' }}
                                                    />
                                                )}
                                            </Box>
                                        </Box>
                                    </Box>
                                ))}
                            </Stack>
                        </Paper>
                    </Grid>
                </Grid>

                {/* Footer */}
                <Box sx={{ 
                    textAlign: 'center', 
                    mt: 4, 
                    pt: 3, 
                    borderTop: '2px dashed #e0e0e0', 
                    opacity: 0.8, 
                    fontSize: '12px', 
                    color: 'text.secondary', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center' 
                }}>
                    <Box className="stamp" sx={{ 
                        width: 22, 
                        height: 22, 
                        borderRadius: '50%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontWeight: 'bold', 
                        fontSize: '10px', 
                        marginRight: '10px' 
                    }}>
                        TM
                    </Box>
                    Tick-M Events Official Contract Document • Generated on {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </Box>
            </Box>
        </div>
    );

    return (
        <Dialog 
            open={open} 
            onClose={onClose} 
            maxWidth="lg" 
            fullWidth 
            PaperProps={{ 
                sx: { 
                    borderRadius: 3,
                    
                } 
            }}
        >
            <DialogTitle sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                color: 'white', 
                py: 3, 
                position: 'relative', 
                borderRadius: '12px 12px 0 0' 
            }}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        📄 Project Contract
                    </Typography>
                    <Typography variant="subtitle1" sx={{ opacity: 0.9 }}>
                        Contract ID: {project.projectDetails._id}
                    </Typography>
                </Box>
                <IconButton 
                    onClick={onClose} 
                    sx={{ 
                        color: 'white', 
                        backgroundColor: 'rgba(255,255,255,0.2)', 
                        '&:hover': { backgroundColor: 'rgba(255,255,255,0.3)' } 
                    }}
                >
                    <CloseIcon />
                </IconButton>
                <Box sx={{ 
                    position: 'absolute', 
                    top: 20, 
                    right: 70, 
                    opacity: 0.9, 
                    transform: 'rotate(5deg)' 
                }}>
                    <Box sx={{ 
                        width: 45, 
                        height: 45, 
                        borderRadius: '50%', 
                        background: 'linear-gradient(45deg, #FF6B6B 0%, #FF8E53 100%)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        color: 'white', 
                        fontWeight: 'bold', 
                        fontSize: '12px', 
                        border: '3px solid white', 
                        textAlign: 'center', 
                        lineHeight: 1.1 
                    }}>
                        TICK-M<br />EVENTS
                    </Box>
                </Box>
            </DialogTitle>

            <DialogContent dividers sx={{ py: 3, position: 'relative' }}>
                <ContractDetailsContent />
            </DialogContent>

            <DialogActions sx={{ 
                px: 3, 
                py: 2, 
                position: 'relative', 
                zIndex: 1, 
                background: 'white', 
                borderRadius: '0 0 12px 12px' 
            }}>
                <Button 
                    onClick={onClose} 
                    variant="outlined" 
                    sx={{ borderRadius: 2, px: 3 }}
                >
                    Close
                </Button>
                <Button 
                    onClick={handlePrint} 
                    variant="contained" 
                    startIcon={<PrintIcon />} 
                    sx={{ 
                        borderRadius: 2, 
                        px: 3, 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    }}
                >
                    Download
                </Button>
            </DialogActions>
        </Dialog>
    );
}

// Statistics Cards Component
function StatisticsCards({ statistics }: { statistics: ProjectStatistics }) {
    const cards = [
        {
            label: "Total Projects",
            value: statistics.totalProjects,
            icon: <Assignment />,
            color: "#1976d2"
        },
        {
            label: "Signed Projects",
            value: statistics.signedProjects,
            icon: <CheckCircle />,
            color: "#2e7d32"
        },
        {
            label: "Open for Bidding",
            value: statistics.openForBidding,
            icon: <People />,
            color: "#ed6c02"
        },
        {
            label: "Closed Projects",
            value: statistics.closedProjects,
            icon: <MonetizationOn />,
            color: "#9c27b0"
        }
    ];

    return (
        <Grid container spacing={3} sx={{ mb: 4 }}>
            {cards.map((card, index) => (
                <Grid item xs={12} sm={6} md={3} key={card.label}>
                    <Fade in timeout={500 + (index * 100)}>
                        <Card
                            sx={{
                                background: `linear-gradient(135deg, ${card.color}20, ${card.color}40)`,
                                border: `1px solid ${card.color}30`,
                                borderRadius: 3,
                                transition: 'transform 0.3s ease',
                                '&:hover': {
                                    transform: 'translateY(-4px)'
                                }
                            }}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" justifyContent="space-between">
                                    <Box>
                                        <Typography variant="h4" fontWeight="bold" color={card.color}>
                                            {card.value}
                                        </Typography>
                                        <Typography variant="body2" fontWeight={600} color="dark">
                                            {card.label}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ color: card.color, opacity: 0.8 }}>
                                        {card.icon}
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    </Fade>
                </Grid>
            ))}
        </Grid>
    );
}

// Project Row Component
function ProjectRow({
    project,
    onRowClick,
    onChatClick
}: {
    project: SignedProject;
    onRowClick: (project: SignedProject) => void;
    onChatClick: (provider: Provider) => void;
}) {
    const [expanded, setExpanded] = useState(false);
    const [selectedContractForStatus, setSelectedContractForStatus] = useState<any>(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);

    const handleStatusChangeClick = (contract: any) => {
        setSelectedContractForStatus(contract);
        setStatusModalOpen(true);
    };

    return (
        <>
            <TableRow
                sx={{
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                        backgroundColor: 'action.hover',
                        transform: 'translateX(4px)'
                    }
                }}
                onClick={() => onRowClick(project)}
            >
                <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                        <Avatar
                            src={project.winningBid?.providerId?.avatar?.url}
                            alt={project.winningBid?.providerId?.name}
                        >
                            {project?.winningBid?.providerId?.name.charAt(0)}
                        </Avatar>
                        <Box>
                            <Typography variant="subtitle2" fontWeight="bold">
                                {project.winningBid?.providerId?.name}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" fontSize={9}>
                                {project.projectDetails?.categoryId?.name}
                            </Typography>
                        </Box>
                    </Box>
                </TableCell>

                <TableCell>
                    <Typography variant="body2">
                        {project.winningBid.bidAmount.toLocaleString()} XAF
                    </Typography>
                    <Typography variant="caption" color="text.secondary" fontSize={9}>
                        Accepted: {project.winningBid.winningBid.toLocaleString()} XAF
                    </Typography>
                </TableCell>

                <TableCell>
                    <Chip
                        label={project.projectStatus}
                        sx={{ textTransform: "capitalize" }}
                        size="small"
                        color={getStatusColor(project.projectStatus)}
                        variant="outlined"
                    />
                </TableCell>

                <TableCell>
                    <Typography variant="body2">
                        {project.winningBid?.deliveryTime} {project.winningBid?.deliveryUnit}
                    </Typography>
                </TableCell>

                <TableCell>
                    <Typography variant="body2">
                        {formatDateTimeCustom(project.projectDetails?.serviceTime)}
                    </Typography>
                </TableCell>

                <TableCell align="center">
                    <Box display="flex" gap={1}>
                        <Tooltip title="Chat with Provider">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onChatClick(project.winningBid.providerId);
                                }}
                                color="primary"
                            >
                                <Chat />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="We can change project status here.">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleStatusChangeClick(project)
                                }}
                                disabled={project?.projectDetails?.status === 'completed'}
                                color="primary"
                            >
                                <Iconify width={24} icon="f7:status" />

                            </IconButton>
                        </Tooltip>
                        <Tooltip title="View Details">
                            <IconButton
                                size="small"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setExpanded(!expanded);
                                }}
                            >
                                {expanded ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                        </Tooltip>
                    </Box>
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                Quick Overview
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2">
                                        <strong>Total Bids:</strong> {project.bidsStatistics.totalBids}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Average Bid:</strong> {project.bidsStatistics.averageBid.toLocaleString()} XAF
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="body2">
                                        <strong>Location:</strong> {project.projectDetails.eventLocation}
                                    </Typography>
                                    <Typography variant="body2">
                                        <strong>Original Budget:</strong> {project.projectDetails.orgBudget} XAF
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>

            <SignedStatusModal
                open={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                currentStatus={selectedContractForStatus?.projectDetails?.status || ''}
                contract={selectedContractForStatus}
            />
        </>
    );
}

// Main Component
export function SignedProjectList() {
    const { __events } = useSelector((state: RootState) => state.organizer);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
    const [selectedProject, setSelectedProject] = useState<SignedProject | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>()
    
    useEffect(() => {
        dispatch(fatchOrgEvents())
    }, [dispatch,__events])
    
    const handleEventSelect = (event: any | null) => {
        setSelectedEvent(event);
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 2000);
    };

    const handleProjectClick = (project: SignedProject) => {
        setSelectedProject(project);
        setModalOpen(true);
    };

    const handleChatClick = (provider: Provider) => {
        navigate("/messaging-relationship");
        sessionStorage.setItem('currentChatProvider', JSON.stringify(provider));
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    if (!selectedEvent) {
        return (
            <>
                <EventBreadCrum events={__events} onEventSelect={handleEventSelect} />
                <DashboardContent>
                    <Typography variant="h6" color="text.secondary" textAlign="center" mt={4}>
                        Select an event to view signed projects
                    </Typography>
                </DashboardContent>
            </>
        );
    }

    const signedProjects = selectedEvent.signedProjects || [];
    const projectStatistics = selectedEvent.projectStatistics || {
        totalProjects: 0,
        signedProjects: 0,
        openForBidding: 0,
        closedProjects: 0,
        cancelledProjects: 0
    };

    return (
        <>
            <EventBreadCrum events={__events} onEventSelect={handleEventSelect} />
            <DashboardContent>
                {isLoading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
                        <CircularProgress />
                    </Box>
                ) : (
                    <Fade in timeout={500}>
                        <Box>
                            {/* Statistics Cards */}
                            <StatisticsCards statistics={projectStatistics} />

                            {/* Projects Table */}
                            <Card
                                sx={{
                                    borderRadius: 3,
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                                    overflow: 'hidden'
                                }}
                            >
                                <CardContent sx={{ p: 0 }}>
                                    <Box p={3} bgcolor="primary.main" color="white">
                                        <Typography variant="h5" fontWeight="bold">
                                            Signed Projects
                                        </Typography>
                                        <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                            {signedProjects.length} projects signed with providers
                                        </Typography>
                                    </Box>

                                    {signedProjects?.length === 0 ? (
                                        <Box p={4} textAlign="center">
                                            <Typography variant="h6" color="text.secondary">
                                                No signed projects found for this event
                                            </Typography>
                                        </Box>
                                    ) : (
                                        <TableContainer>
                                            <Table>
                                                <TableHead>
                                                    <TableRow sx={{ bgcolor: 'grey.50' }}>
                                                        <TableCell><strong>Provider</strong></TableCell>
                                                        <TableCell><strong>Bid Amount</strong></TableCell>
                                                        <TableCell><strong>Status</strong></TableCell>
                                                        <TableCell><strong>Delivery Time</strong></TableCell>
                                                        <TableCell><strong>Service Date</strong></TableCell>
                                                        <TableCell align="center"><strong>Actions</strong></TableCell>
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {signedProjects.map((project: any, index: any) => (
                                                        <ProjectRow
                                                            key={project.projectDetails._id}
                                                            project={project}
                                                            onRowClick={handleProjectClick}
                                                            onChatClick={handleChatClick}
                                                        />
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableContainer>
                                    )}
                                </CardContent>
                            </Card>
                        </Box>
                    </Fade>
                )}

                {/* Enhanced Project Details Modal */}
                <ProjectDetailsModal
                    open={modalOpen}
                    onClose={handleCloseModal}
                    project={selectedProject}
                />
            </DashboardContent>
        </>
    );
}