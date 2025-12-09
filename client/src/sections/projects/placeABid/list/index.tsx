import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Typography,
    Card,
    CardContent,
    Grid,
    Box,
    Chip,
    Button,
    Skeleton,
    Container
} from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";
import { AppDispatch, RootState } from "src/redux/store";
import { EventBreadCrum } from "src/sections/entry-validation/event-status";
import { useNavigate } from "react-router-dom";
import { formatDateTimeCustom } from "src/hooks/formate-time";

export function ListPlaceABid() {
    const { __events } = useSelector((state: RootState) => state.organizer);
    const dispatch = useDispatch<AppDispatch>();
    const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

    const [isLoading, setIsLoading] = useState(true);

    const handleEventSelect = (event: any | null) => {
        setSelectedEvent(event);
        setIsLoading(true);

        // Simulate 2-second loading when event changes
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    };

    useEffect(() => {
        dispatch(fatchOrgEvents());
        // Set initial loading timeout
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, [dispatch]);

    return (
        <>
            <EventBreadCrum events={__events} onEventSelect={handleEventSelect} />
            <DashboardContent>
                <Typography variant="h4" sx={{ mb: 3 }}>
                    Place a Bid
                </Typography>

                {isLoading ? (
                    <LoadingState />
                ) : selectedEvent && selectedEvent.placeABid && selectedEvent.placeABid.length > 0 ? (
                    <BidGrid bids={selectedEvent.placeABid} />
                ) : (
                    <EmptyState hasEvent={!!selectedEvent} />
                )}
            </DashboardContent>
        </>
    );
}

function LoadingState() {
    return (
        <Grid container spacing={3}>
            {[1, 2, 3].map((item) => (
                <Grid item xs={12} md={6} lg={4} key={item}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Skeleton variant="rounded" width={80} height={24} />
                                <Skeleton variant="rounded" width={80} height={24} />
                            </Box>

                            <Skeleton variant="text" height={32} width="60%" sx={{ mb: 2 }} />
                            <Skeleton variant="text" height={20} width="80%" sx={{ mb: 1 }} />
                            <Skeleton variant="text" height={20} width="70%" sx={{ mb: 2 }} />

                            <Skeleton variant="text" height={24} width="40%" sx={{ mb: 1 }} />
                            <Skeleton variant="text" height={20} width="100%" />
                            <Skeleton variant="text" height={20} width="90%" />
                            <Skeleton variant="text" height={20} width="95%" sx={{ mb: 2 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Skeleton variant="text" height={20} width="20%" />
                                <Skeleton variant="text" height={20} width="20%" />
                                <Skeleton variant="text" height={20} width="20%" />
                            </Box>
                        </CardContent>

                        <Box sx={{ p: 2, pt: 0 }}>
                            <Skeleton variant="rounded" width="100%" height={36} />
                        </Box>
                    </Card>
                </Grid>
            ))}
        </Grid>
    );
}

function EmptyState({ hasEvent }: { hasEvent: boolean }) {
    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    textAlign: 'center',
                    py: 8,
                    px: 3,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Box
                    component="img"
                    src="/assets/illustrations/illustration-empty.jpg"
                    sx={{
                        width: 240,
                        maxWidth: '100%',
                        mb: 3
                    }}
                />
                <Typography variant="h5" gutterBottom>
                    {hasEvent ? "No Projects to Bid On" : "Select an Event to View Bids"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 400, mb: 3 }}>
                    {hasEvent
                        ? "This event doesn't have any projects available for bidding at the moment. Please check back later."
                        : "Use the dropdown above to select an event and view available bidding projects."
                    }
                </Typography>
                {!hasEvent && (
                    <Button variant="contained" size="large">
                        Explore Events
                    </Button>
                )}
            </Box>
        </Container>
    );
}

function BidGrid({ bids }: { bids: any[] }) {
    return (
        <Grid container spacing={3}>
            {bids.map((bid) => (
                <Grid item xs={12} md={6} lg={4} key={bid._id}>
                    <BidCard bid={bid} />
                </Grid>
            ))}
        </Grid>
    );
}

function BidCard({ bid }: { bid: any }) {
    const navigate = useNavigate();

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'warning';
            case 'approved': return 'success';
            case 'rejected': return 'error';
            default: return 'default';
        }
    };

    const getBidStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'success';
            case 'closed': return 'error';
            default: return 'default';
        }
    };

    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
            <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                        sx={{
                            textTransform: "capitalize"
                        }}
                        label={bid.status}
                        color={getStatusColor(bid.status)}
                        size="small"
                    />
                    <Chip
                        sx={{
                            textTransform: "capitalize"
                        }}
                        label={bid.bidStatus}
                        color={getBidStatusColor(bid.bidStatus)}
                        size="small"
                        variant="outlined"
                    />
                </Box>

                <Typography variant="h6" gutterBottom>
                    Budget: {bid.orgBudget}
                </Typography>

                <Typography variant="body2" fontWeight={600} gutterBottom>
                    Service Time: <span style={{ color: "#3CB1F1" }}>{formatDateTimeCustom(bid.serviceTime)}</span>
                </Typography>

                <Typography variant="body2" fontWeight={600} gutterBottom>
                    Event Location: <span style={{ color: "#3CB1F1" }}>{bid.eventLocation}</span>
                </Typography>

                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Category:
                    </Typography>
                    <Box sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                    }}>
                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mb: 0.5
                        }}>
                            <Box sx={{
                                width: 12,
                                height: 12,
                                borderRadius: '50%',
                                backgroundColor: 'success.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mr: 1
                            }}>
                                <Box sx={{
                                    width: 4,
                                    height: 4,
                                    borderRadius: '50%',
                                    backgroundColor: 'white'
                                }} />
                            </Box>
                            <Typography variant="body2" sx={{
                                fontWeight: 'bold',
                                textTransform: "capitalize",
                                color: 'success.main'
                            }}>
                                {bid?.categoryId?.name}
                            </Typography>
                        </Box>

                        <Box sx={{
                            display: 'flex',
                            alignItems: 'center',
                            ml: 3
                        }}>
                            <Box sx={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                backgroundColor: 'primary.main',
                                mr: 1
                            }} />
                            <Typography variant="body2" sx={{
                                textTransform: "capitalize",
                                color: 'primary.main'
                            }}>
                                {bid?.subcategoryId?.name}
                            </Typography>
                        </Box>
                    </Box>
                </Box>
                <Box sx={{ my: 2 }}>
                    <Typography variant="subtitle2" gutterBottom>
                        Requirements:
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'text.secondary'
                        }}
                        dangerouslySetInnerHTML={{ __html: bid.orgRequirement }}
                    />
                </Box>

                {bid.orgAdditionalRequirement && (
                    <Box sx={{ my: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            Additional Requirements:
                        </Typography>
                        <Typography variant="body2" sx={{
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            color: 'text.secondary'
                        }}>
                            {bid.orgAdditionalRequirement}
                        </Typography>
                    </Box>
                )}

                <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" color="text.secondary">
                        Bids: {bid.bidsCount}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Avg: {bid.avgBidAmount} XAF
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Total: {bid.totalBidAmount} XAF
                    </Typography>
                </Box>
            </CardContent>

            <Box sx={{ p: 2, pt: 0 }}>
                <Button
                    variant="contained"
                    fullWidth
                    disabled={bid.bidsCount === 0}
                    onClick={() => {
                        navigate(`/place-a-bid/bids/${bid?._id}`);
                    }}
                    sx={{ py: 1 }}
                >
                    View Proposals
                </Button>
            </Box>
        </Card>
    );
}

export default ListPlaceABid;