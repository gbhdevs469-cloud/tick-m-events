import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ChatIcon from '@mui/icons-material/Chat';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import StarIcon from '@mui/icons-material/Star';
import {
    Typography, Box, Card, Grid, Chip, Button, Avatar, Divider,
    Container, Paper, Tabs, Tab, Skeleton, Alert, IconButton
} from "@mui/material";
import { ArrowBack, Schedule, Person, Work, LocationOn, Event } from "@mui/icons-material";

import { fatchOrgProjectBids } from "src/redux/actions/organizer/pageEvents";
import { AppDispatch, RootState } from "src/redux/store";
import { formatDateTimeCustom } from "src/hooks/formate-time";
import { TextWithShowMore } from "src/components/text-with-show-more";

import { BidActionDialog } from "./bidActionDialog";

// Define TypeScript interfaces for better type safety
interface Provider {
    _id: string;
    name: string;
    email: string;
    experience?: string;
    avatar?: {
        public_id: string;
        url: string;
    };
    reviewCount: number;
}

interface Milestone {
    milestorneName: string;
    amount: number;
    currency: string;
    _id: string;
}

interface Bid {
    _id: string;
    projectId: string;
    providerId: Provider;
    bidAmount: number;
    deliveryTime: number;
    deliveryUnit: string;
    proposal: string;
    milestones: Milestone[];
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
    winningBid: number;
    rejectionReason: string
}


export function BidsOnPlaceABid() {
    const dispatch = useDispatch<AppDispatch>();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState(0);
    const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const { __projectWithBids } = useSelector((state: RootState) => state.organizer);
   
    const { projectId } = useParams();

    useEffect(() => {
        if (projectId) {
            dispatch(fatchOrgProjectBids(projectId));
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }, [dispatch, projectId]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleBidSelect = (bid: Bid) => {
        setSelectedBid(bid);
        setDialogOpen(true);
    };

    const handleDialogClose = () => {
        setDialogOpen(false);
        setSelectedBid(null);
    };

    // Filter bids based on active tab
    const getFilteredBids = () => {
        if (!__projectWithBids?.bids) return [];

        const allBids = __projectWithBids.bids;

        switch (activeTab) {
            case 0: // All Bids
                return allBids;
            case 1: // Pending
                return allBids.filter((bid: any) => bid.status === 'pending');
            case 2: // Accepted
                return allBids.filter((bid: any) => bid.status === 'accepted');
            case 3: // Rejected
                return allBids.filter((bid: any) => bid.status === 'rejected');
            default:
                return allBids;
        }
    };

    const filteredBids = getFilteredBids();

    // Calculate counts for each tab
    const getStatusCounts = () => {
        if (!__projectWithBids?.bids) return { pending: 0, accepted: 0, rejected: 0 };

        const bids = __projectWithBids.bids;
        return {
            pending: bids.filter((bid: any) => bid.status === 'pending').length,
            accepted: bids.filter((bid: any) => bid.status === 'accepted').length,
            rejected: bids.filter((bid: any) => bid.status === 'rejected').length
        };
    };

    const statusCounts = getStatusCounts();

    if (isLoading) {
        return <LoadingSkeleton />;
    }

    if (!__projectWithBids || !__projectWithBids.project) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error" sx={{ mt: 3 }}>
                    Project not found or failed to load.
                </Alert>
            </Container>
        );
    }

    const { project, bidStats } = __projectWithBids;



    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            {/* Header with Back Button */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <IconButton sx={{ mr: 1 }} onClick={() => window.history.back()}>
                    <ArrowBack />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Project Bids
                </Typography>
            </Box>

            {/* Project Details Card */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Box display="flex" justifyContent="space-between">
                    <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                        <Work sx={{ mr: 1 }} /> {project.eventId.eventName}
                    </Typography>
                    {project?.isSigned && (
                        <Chip
                            label="Signed"
                            color="success"
                            size="small"
                            sx={{ textTransform: "capitalize", p: 2, fontWeight: 700 }}
                        />
                    )}
                </Box>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                    <Chip
                        icon={<Event />}
                        label={project.eventId.date}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        icon={<LocationOn />}
                        label={project.eventLocation}
                        size="small"
                        variant="outlined"
                    />
                    <Chip
                        label={project.categoryId.name}
                        color="primary"
                        size="small"
                    />
                    {project.subcategoryId && (
                        <Chip
                            label={project.subcategoryId.name}
                            color="secondary"
                            size="small"
                        />
                    )}
                </Box>

                <Grid container spacing={3}>
                    <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>Project Requirements</Typography>
                        <Typography variant="body1" paragraph>
                            <TextWithShowMore text={project.orgRequirement} wordLimit={150}/>
                            
                        </Typography>

                        {project.orgAdditionalRequirement && (
                            <>
                                <Typography variant="h6" gutterBottom>Additional Requirements</Typography>
                                <Typography variant="body1" paragraph>
                                    {project.orgAdditionalRequirement}
                                </Typography>
                            </>
                        )}
                    </Grid>

                    <Grid item xs={12} md={4}>
                        <Card variant="outlined" sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                Budget
                            </Typography>
                            <Typography variant="h5" color="primary" gutterBottom>
                                {project.orgBudget} XAF
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Schedule sx={{ mr: 1 }} /> Service Time
                            </Typography>
                            <Typography variant="body1">
                                {formatDateTimeCustom(project.serviceTime)}
                            </Typography>

                            <Divider sx={{ my: 2 }} />

                            <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                <Person sx={{ mr: 1 }} /> Posted By
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <Avatar sx={{ width: 32, height: 32, mr: 1 }}>
                                    {project.createdBy.name.charAt(0)}
                                </Avatar>
                                <Typography variant="body1">
                                    {project.createdBy.name}
                                </Typography>
                            </Box>
                        </Card>
                    </Grid>
                </Grid>
            </Paper>

            {/* Bids Section */}
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={activeTab} onChange={handleTabChange}>
                        <Tab label={`All Bids (${__projectWithBids.bids.length})`} />
                        <Tab label={`Pending (${statusCounts.pending})`} sx={{ color: "#db9052ff" }} />
                        <Tab label={`Accepted (${statusCounts.accepted})`} sx={{ color: "#3cbe1bff" }} />
                        <Tab label={`Rejected (${statusCounts.rejected})`} sx={{ color: "#db2f2fff" }} />
                    </Tabs>
                </Box>

                {/* Bid Stats - Only show for "All Bids" tab */}
                {activeTab === 0 && (
                    <Box sx={{ p: 2, bgcolor: 'grey.50', display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Total Bids</Typography>
                            <Typography variant="h6">{bidStats.totalBids}</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Average Bid</Typography>
                            <Typography variant="h6">{Math.round(bidStats.averageBid)} XAF</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Lowest Bid</Typography>
                            <Typography variant="h6">{bidStats.lowestBid} XAF</Typography>
                        </Box>
                        <Box>
                            <Typography variant="body2" color="text.secondary">Highest Bid</Typography>
                            <Typography variant="h6">{bidStats.highestBid} XAF</Typography>
                        </Box>
                    </Box>
                )}

                {/* Bids List */}
                <Box sx={{ p: 2 }}>
                    {filteredBids.length === 0 ? (
                        <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            {activeTab === 0
                                ? 'No bids have been placed on this project yet.'
                                : `No ${getTabLabel(activeTab).toLowerCase()} bids found.`
                            }
                        </Typography>
                    ) : (
                        filteredBids.map((bid: any) => (
                            <BidCard key={bid._id} bid={bid} onSelect={handleBidSelect} />
                        ))
                    )}
                </Box>
            </Paper>

            {/* // In your main component, replace the existing Dialog with: */}
            <BidActionDialog
                open={dialogOpen}
                selectedBid={selectedBid}
                project={__projectWithBids?.project}
                onClose={handleDialogClose}
                onAction={(bidId: any, actionType: any, data: any) => {
                    // Handle the action here
                    if (actionType === 'rejected') {
                        // Call API to reject bid with data.rejectionReason
                        console.log('Rejecting bid:', bidId, 'Reason:', data.rejectionReason);
                    } else if (actionType === 'accepted') {
                        // Call API to accept bid with data.acceptedAmount
                        console.log('Accepting bid:', bidId, 'Amount:', data.acceptedAmount);
                    }
                }}
            />
        </Container>
    );
}

// Helper function to get tab label
const getTabLabel = (tabIndex: number) => {
    switch (tabIndex) {
        case 0: return 'All';
        case 1: return 'Pending';
        case 2: return 'Accepted';
        case 3: return 'Rejected';
        default: return 'All';
    }
};

interface BidCardProps {
    bid: Bid;
    onSelect: (bid: Bid) => void;
}

function BidCard({ bid, onSelect }: any) {
    const navigate = useNavigate();

    const handleChatClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent triggering the card click
        navigate("/messaging-relationship");
        sessionStorage.setItem('currentChatProvider', JSON.stringify(bid?.providerId));
    };

    return (
        <Card
            sx={{
                mb: 2,
                p: 2,
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' }
            }}
        >
            <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} md={8}>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Avatar
                            src={bid.providerId?.avatar?.url}
                            sx={{ mr: 2 }}
                        >
                            {bid?.providerId?.name?.charAt(0) || 'U'}
                        </Avatar>
                        <Box>
                            <Typography variant="h6">{bid.providerId?.name || 'Unknown Provider'}</Typography>
                            <Box mt={1} display="flex" alignItems="center" gap={1}>
                                <Box display="flex" alignItems="center">
                                    {[...Array(5)].map((_, index) => (
                                        <StarIcon
                                            key={index}
                                            fontSize="small"
                                            sx={{
                                                color: index < Math.floor(bid?.providerId?.averageRating || 0) ? '#f39c12' : '#ddd',
                                            }}
                                        />
                                    ))}
                                </Box>
                                <Typography variant="body2">| {bid?.providerId?.reviewCount} Reviews</Typography>
                                <Typography variant="body2">| 90% Completion</Typography>
                                <Typography variant="body2" textTransform="capitalize">| {bid?.providerId?.address}</Typography>
                            </Box>
                        </Box>
                    </Box>

                    <Box onClick={(e) => e.stopPropagation()}>
                        <TextWithShowMore text={bid.proposal} wordLimit={20} />
                    </Box>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Box sx={{ textAlign: { md: 'right' } }}>
                        <Typography variant="h5" color="primary" gutterBottom>
                            {bid.bidAmount} XAF
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                            Delivery in {bid.deliveryTime} {bid.deliveryUnit}
                        </Typography>
                        <Typography variant="caption" display="block" color="text.secondary">
                            {formatDateTimeCustom(bid.createdAt)}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, justifyContent: "end", mt: 2, textTransform: "capitalize" }}>
                            {/* <Chip
                                label={bid.status}
                                color={
                                    bid.status === 'accepted' ? 'success' :
                                        bid.status === 'rejected' ? 'error' : 'default'
                                }
                                size="small"
                                // Add delete icon for rejected status with tooltip
                                {...(bid.status === 'rejected' && bid.rejectionReason && {
                                    deleteIcon: (
                                        <Tooltip title={bid.rejectionReason} arrow>
                                            <IconButton size="small">
                                                <InfoIcon fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    ),
                                    onDelete: () => { } // Empty function to make the delete icon appear
                                })}
                            /> */}
                            <Button
                                variant="outlined"
                                startIcon={<ChatIcon />}
                                onClick={handleChatClick}
                                size="small"
                            >
                                Chat
                            </Button>
                            <Button
                                variant="outlined"
                                sx={{ border: "1px solid green", color: "green" }}
                                startIcon={<EmojiEventsIcon />}
                                onClick={() => onSelect(bid)}
                                size="small"
                                disabled={bid?.status !== 'pending'}

                            >
                                Award
                            </Button>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Card>
    );
}

function LoadingSkeleton() {
    return (
        <Container maxWidth="lg" sx={{ py: 3 }}>
            <Skeleton variant="text" height={60} width="40%" sx={{ mb: 3 }} />

            {/* Project Skeleton */}
            <Paper elevation={2} sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Skeleton variant="text" height={40} width="60%" sx={{ mb: 2 }} />
                <Skeleton variant="text" height={25} width="30%" sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={100} sx={{ mb: 2 }} />
                <Skeleton variant="rectangular" height={200} />
            </Paper>

            {/* Bids Skeleton */}
            <Paper elevation={2} sx={{ borderRadius: 2 }}>
                <Skeleton variant="rectangular" height={48} />
                {[1, 2, 3].map((item) => (
                    <Box key={item} sx={{ p: 2 }}>
                        <Skeleton variant="rectangular" height={120} sx={{ mb: 2 }} />
                    </Box>
                ))}
            </Paper>
        </Container>
    );
}

export default BidsOnPlaceABid;




