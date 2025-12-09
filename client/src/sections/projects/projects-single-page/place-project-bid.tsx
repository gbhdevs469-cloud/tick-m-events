import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Grid, Paper, Divider, Stack,
    TextField, MenuItem, Button, IconButton,
    Alert, CircularProgress, Card, CardContent
} from "@mui/material";
import { Link } from 'react-router-dom';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useDispatch } from 'react-redux';

import { placeBid } from 'src/redux/actions/provider/projects/place-a-bd.action';
import { AppDispatch } from 'src/redux/store';

import axios from '../../../redux/helper/axios';

// Define TypeScript interfaces
interface BidData {
    bidAmount: string;
    deliveryTime: string;
    deliveryUnit: string;
    proposal: string;
}

interface Milestone {
    id: number;
    milestorneName: string;
    amount: string;
    currency: "XAF" | "USD";
}

interface BidErrors {
    bidAmount?: string;
    deliveryTime?: string;
    deliveryUnit?: string;
    proposal?: string;
    [key: string]: string | undefined;
}

interface FormErrors {
    [key: string]: string;
}

interface Project {
    _id: string;
    eventId?: {
        eventName: string;
    };
    bidStatus: string
}

export function PlaceBidOnProject({ project }: { project: Project }) {
    const [bidData, setBidData] = useState<BidData>({
        bidAmount: "",
        deliveryTime: "1",
        deliveryUnit: "Days",
        proposal: ""
    });
    const dispatch = useDispatch<AppDispatch>();

    const [milestones, setMilestones] = useState<Milestone[]>([
        { id: 1, milestorneName: "", amount: "", currency: "XAF" }
    ]);

    const [charCount, setCharCount] = useState(0);
    const [errors, setErrors] = useState<BidErrors>({});
    const [loading, setLoading] = useState(false);
    const [submitError, setSubmitError] = useState("");
    const [hasExistingBid, setHasExistingBid] = useState<boolean | null>(null);
    const [loadingBidCheck, setLoadingBidCheck] = useState(true);
    const [bidCheckError, setBidCheckError] = useState("");
    const [hasExistingBidThisProject, setHasExistingBidThisProject] = useState<any>(null);

     useEffect(() => {
            const textContent = bidData.proposal.replace(/<[^>]*>/g, '');
            setCharCount(textContent.length);
        }, [bidData.proposal]);

    // Use useCallback to memoize the function and prevent infinite re-renders
    const checkExistingBid = useCallback(async () => {
        try {
            setLoadingBidCheck(true);
            setBidCheckError("");

            // Make API call to check if user has already bid on this project
            const response = await axios.get(`/p/project/${project._id}/my-bid`);

            if (response.data.success) {
                setHasExistingBid(response.data.hasBid);
                setHasExistingBidThisProject(response.data.bid);

            } else {
                setBidCheckError(response.data.message || "Failed to check bid status");
                setHasExistingBid(false);
            }
        } catch (error: any) {
            setBidCheckError(error.response?.data?.message || "Failed to check bid status");
            setHasExistingBid(false);
        } finally {
            setLoadingBidCheck(false);
        }
    }, [project._id]); // Include dependencies that the function uses

    useEffect(() => {
        checkExistingBid();
    }, [checkExistingBid]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        if (name === "proposal") {
            const count = value.length;
            setCharCount(count);
        }

        setBidData(prev => ({
            ...prev,
            [name]: value
        }));

        // Trigger re-validation if bidAmount is changed
        if (name === 'bidAmount') {
            setTimeout(() => validateForm(), 0);
        }
    };

    const handleDescriptionChange = (value: string) => {
        setBidData(prev => ({ ...prev, proposal: value }));
        // Clear error when user starts typing
        if (errors.proposal) {
            setErrors(prev => ({ ...prev, proposal: undefined }));
        }
    };

    const addMilestone = () => {
        if (milestones.length < 5) {
            setMilestones(prev => [
                ...prev,
                { id: Date.now(), milestorneName: "", amount: "", currency: "XAF" }
            ]);
        }
    };

    const removeMilestone = (id: number) => {
        if (milestones.length > 1) {
            setMilestones(prev => prev.filter(milestone => milestone.id !== id));
        }
    };

    const handleMilestoneChange = (id: number, field: keyof Milestone, value: string) => {
        setMilestones(prev => {
            const updated = prev.map(milestone =>
                milestone.id === id ? { ...milestone, [field]: value } : milestone
            );
            setTimeout(() => validateForm(), 0);
            return updated;
        });
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        const bidAmountNum = Number(bidData.bidAmount);
        if (!bidData.bidAmount || Number.isNaN(bidAmountNum) || bidAmountNum <= 0) {
            newErrors.bidAmount = "Please enter a valid bid amount";
        }

        const deliveryTimeNum = parseInt(bidData.deliveryTime, 10);
        if (!bidData.deliveryTime || Number.isNaN(deliveryTimeNum) || deliveryTimeNum <= 0) {
            newErrors.deliveryTime = "Please enter a valid delivery time";
        }

        if (!bidData.proposal || bidData.proposal.length < 100) {
            newErrors.proposal = "Proposal must be at least 100 characters";
        }

        // Track milestone total and mark only the violating milestone
        let runningTotal = 0;
        milestones.forEach((milestone, index) => {
            const name = milestone.milestorneName.trim();
            const amountNum = Number(milestone.amount);

            if (!name) {
                newErrors[`milestone_${index}_milestorneName`] = "Milestone name is required";
            }

            if (!milestone.amount || Number.isNaN(amountNum) || amountNum <= 0) {
                newErrors[`milestone_${index}_amount`] = "Valid amount is required";
            } else {
                runningTotal += amountNum;

                if (bidAmountNum > 0 && runningTotal > bidAmountNum) {
                    newErrors[`milestone_${index}_amount`] = "Milestone exceeds the total bid amount";
                }
            }
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleSubmit = async (e: any) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setSubmitError("");

        try {
            const bidPayload = {
                bidAmount: parseFloat(bidData.bidAmount),
                deliveryTime: parseInt(bidData.deliveryTime, 10),
                deliveryUnit: bidData.deliveryUnit,
                proposal: bidData.proposal,
                milestones: milestones.map(m => ({
                    milestorneName: m.milestorneName,
                    amount: parseFloat(m.amount),
                    currency: m.currency
                }))
            };
            await dispatch(placeBid(project._id, bidPayload));
            checkExistingBid()
        } catch (error) {
            setSubmitError(error.message || "Failed to place bid");
        } finally {
            setLoading(false);
        }
    };

    // Show loading state while checking for existing bid
    if (loadingBidCheck) {
        return (
            <Paper sx={{ p: 3, borderRadius: 2, border: "3px solid #2395D4", mt: 3 }}>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="100px">
                    <CircularProgress />
                    <Typography variant="body2" sx={{ ml: 2 }}>
                        Checking your bid status...
                    </Typography>
                </Box>
            </Paper>
        );
    }

    // If there was an error checking bid status
    if (bidCheckError) {
        return (
            <Paper sx={{ p: 3, borderRadius: 2, border: "3px solid #ff9800", mt: 3 }}>
                <Alert severity="warning" sx={{ mb: 2 }}>
                    {bidCheckError}
                </Alert>
                <Button
                    variant="contained"
                    onClick={checkExistingBid}
                    startIcon={<CheckCircleIcon />}
                >
                    Retry Bid Check
                </Button>
            </Paper>
        );
    }

    // If user already has a bid, show a different UI
    if (hasExistingBid) {
        return (
            <Paper sx={{ p: 3, borderRadius: 2, border: "3px solid #4caf50", mt: 3 }}>
                <Box display="flex" alignItems="center" mb={2}>
                    <CheckCircleIcon color="success" sx={{ fontSize: 32, mr: 1.5 }} />
                    <Typography variant="h6" fontWeight="bold">
                        Bid Already Submitted
                    </Typography>
                </Box>

                <Typography variant="body2" color="text.secondary" mb={3}>
                    You have already placed a bid for &quot;{project.eventId?.eventName || 'this project'}&quot;.
                    You can edit your bid until the project is awarded to someone.
                </Typography>

                <Card variant="outlined" sx={{ mb: 2, bgcolor: '#f5f5f5' }}>
                    <CardContent>
                        <Typography variant="subtitle2" gutterBottom>
                            Your Current Bid
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Bid Amount:
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {hasExistingBidThisProject?.bidAmount || '0'} XAF
                                </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                    Delivery Time:
                                </Typography>
                                <Typography variant="body1" fontWeight="medium">
                                    {hasExistingBidThisProject?.deliveryTime} {hasExistingBidThisProject?.deliveryUnit}
                                </Typography>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>

                {/* <Button
                    variant="outlined"
                    color="primary"
                    fullWidth
                    sx={{ mr: 2 }}
                >
                    Edit Bid
                </Button> */}
            </Paper>
        );
    }

    // Show the bid form if no existing bid
    return (
        <Paper
            sx={{
                p: 3,
                borderRadius: 2,
                border: `3px solid ${project?.bidStatus === "closed" ? '#ec0a0aff' : '#2395D4'} `,
                mt: 3,
            }}
        >
            {/* Title */}
            <Typography variant="h6" fontWeight="bold" textTransform="capitalize">
                {project?.bidStatus === "closed"
                    ? `"${project.eventId?.eventName || 'this project'}" is Closed`
                    : `Place a bid on "${project.eventId?.eventName || 'this project'}"`
                }
            </Typography>

            {project?.bidStatus === "closed" ? (
                <>
                    <Alert severity="warning" sx={{ mt: 2, mb: 2 }}>
                        This project is no longer accepting bids. The bidding period has ended.
                    </Alert>
                    <Typography variant="body2" color="text.secondary">
                        Unfortunately, you&apos;re too late to submit a bid for this project. The client has
                        closed the bidding process and is now reviewing submissions. Please check out
                        other open projects that match your skills.
                    </Typography>
                    <Button
                        variant="outlined"
                        sx={{ mt: 2 }}
                        fullWidth
                        component={Link}
                        to="/project/view"
                    >
                        Browse Open Projects
                    </Button>
                </>
            ) : (
                <>
                    {submitError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {submitError}
                        </Alert>
                    )}

                    <Typography variant="body2" color="text.secondary" mb={3}>
                        You will be able to edit your bid until the project is awarded to someone.
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        {/* Bid Amount & Delivery Time */}
                        <Grid container spacing={2} mb={3}>
                            <Grid item xs={12} md={5}>
                                <Typography variant="subtitle2" mb={1}>
                                    Bid Amount (XAF)
                                </Typography>
                                <TextField
                                    fullWidth
                                    name="bidAmount"
                                    variant="outlined"
                                    size="small"
                                    value={bidData.bidAmount}
                                    onChange={handleInputChange}
                                    error={!!errors.bidAmount}
                                    helperText={errors.bidAmount}
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 1
                                        }
                                    }}
                                />
                            </Grid>

                            <Grid item xs={12} md={7}>
                                <Typography variant="subtitle2" mb={1}>
                                    This project will be delivered in
                                </Typography>
                                <Stack direction="row" spacing={1}>
                                    <TextField
                                        name="deliveryTime"
                                        variant="outlined"
                                        size="small"
                                        value={bidData.deliveryTime}
                                        onChange={handleInputChange}
                                        error={!!errors.deliveryTime}
                                        helperText={errors.deliveryTime}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1
                                            }
                                        }}
                                    />
                                    <TextField
                                        select
                                        name="deliveryUnit"
                                        variant="outlined"
                                        size="small"
                                        value={bidData.deliveryUnit}
                                        onChange={handleInputChange}
                                        sx={{
                                            minWidth: 100,
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1
                                            }
                                        }}
                                    >
                                        <MenuItem value="Days">Days</MenuItem>
                                        <MenuItem value="Weeks">Weeks</MenuItem>
                                        <MenuItem value="Months">Months</MenuItem>
                                    </TextField>
                                </Stack>
                            </Grid>
                        </Grid>

                        {/* Proposal */}
                        <Box my={2}>

                            <Typography variant="subtitle2" mb={1}>
                                Describe your proposal (minimum 100 characters)
                            </Typography>
                               <div translate="no" className="notranslate" data-nosnippet>
                            <ReactQuill
                                theme="snow"
                                value={bidData.proposal}
                                onChange={handleDescriptionChange}
                                className="custom-quill"
                                placeholder="Full Description of Requirements (minimum 100 characters)"
                                modules={{
                                    toolbar: [
                                        [{ 'header': [1, 2, false] }],
                                        ['bold', 'italic', 'underline', 'strike'],
                                        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
                                        ['link', 'clean']
                                    ]
                                }}
                            />
                            </div>
                            <Box sx={{ mt: 1, display: 'flex', justifyContent: 'space-between' }}>
                                <Typography
                                    variant="caption"
                                    color={charCount < 100 ? "error" : "textSecondary"}
                                >
                                    {charCount} characters (Minimum 100 required)
                                </Typography>
                                {errors.orgRequirement && (
                                    <Typography variant="caption" color="error">
                                        {errors.orgRequirement}
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Milestone Payment */}
                        <Divider sx={{ my: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                            <Typography fontWeight="bold">
                                Request milestone payments
                            </Typography>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="caption" color="text.secondary">
                                    {milestones.length}/5 milestones
                                </Typography>
                                <IconButton
                                    onClick={addMilestone}
                                    disabled={milestones.length >= 5}
                                    size="small"
                                    sx={{
                                        backgroundColor: milestones.length >= 5 ? 'grey.300' : 'primary.main',
                                        color: 'white',
                                        '&:hover': {
                                            backgroundColor: milestones.length >= 5 ? 'grey.300' : 'primary.dark'
                                        }
                                    }}
                                >
                                    <AddIcon />
                                </IconButton>
                            </Box>
                        </Box>

                        {milestones.map((milestone, index) => (
                            <Grid container spacing={2} key={milestone.id} alignItems="center" mb={2}>
                                <Grid item xs={12} md={6}>
                                    <TextField
                                        fullWidth
                                        placeholder={`Milestone ${index + 1} name`}
                                        variant="outlined"
                                        size="small"
                                        value={milestone.milestorneName}
                                        onChange={(e) => handleMilestoneChange(milestone.id, 'milestorneName', e.target.value)}
                                        error={!!errors[`milestone_${index}_milestorneName`]}
                                        helperText={errors[`milestone_${index}_milestorneName`]}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={3}>
                                    <TextField
                                        fullWidth
                                        placeholder="Amount"
                                        variant="outlined"
                                        size="small"
                                        value={milestone.amount}
                                        onChange={(e) => handleMilestoneChange(milestone.id, 'amount', e.target.value)}
                                        error={!!errors[`milestone_${index}_amount`]}
                                        helperText={errors[`milestone_${index}_amount`]}
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={12} md={2}>
                                    <TextField
                                        select
                                        fullWidth
                                        value={milestone.currency}
                                        onChange={(e) => handleMilestoneChange(milestone.id, 'currency', e.target.value)}
                                        variant="outlined"
                                        size="small"
                                        sx={{
                                            "& .MuiOutlinedInput-root": {
                                                borderRadius: 1
                                            }
                                        }}
                                    >
                                        <MenuItem value="XAF">XAF</MenuItem>
                                        <MenuItem value="USD">USD</MenuItem>
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={1}>
                                    <IconButton
                                        onClick={() => removeMilestone(milestone.id)}
                                        disabled={milestones.length <= 1}
                                        size="small"
                                        sx={{
                                            color: milestones.length <= 1 ? 'grey.400' : 'error.main'
                                        }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        ))}

                        {/* Place Bid Button */}
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            color="success"
                            disabled={loading}
                            startIcon={loading ? <CircularProgress size={16} /> : null}
                            sx={{ mt: 2 }}
                        >
                            {loading ? 'Placing Bid...' : 'Place Bid'}
                        </Button>
                    </form>
                </>)}

        </Paper>
    );
}