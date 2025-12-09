import { Box, Button, Paper, Tab, Tabs, Typography, Grid, TextField, Modal, Divider, Chip } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from 'react-toastify';

import { formatTimeTo12Hour } from "src/hooks/formate-time";
import { getRequestsByProvider, sendProviderProposal, getProposalById, updateProviderProposal } from "src/redux/actions/service-request";
import { AppDispatch, RootState } from "src/redux/store";

import { RequestTabSection } from "./request-tab-section";
import { availableProjectsTableHeaders } from "./utills";
import { SignedTab } from "./projectsTabs/signed";
import { ConfirmedTab } from "./projectsTabs/confirmed";


interface Project {
    _id: string;
    eventId: {
        _id: string;
        eventName: string;
        date: string;
        time: string;
        location: string;
        description: string;
        averageRating: number;
    };
    organizerId: {
        _id: string;
        name: string;
        email: string;
        avatar: {
            public_id: string;
            url: string;
        };
    };
    serviceRequestId: {
        _id: string;
        serviceType: string;
        budget: string;
        description: string;
        additionalOptions: string;
    };
    providerId: string;
    status: string;
    contractStatus: string;
    orgBudget: string;
    orgRequirement: string;
    createdAt: string;
    updatedAt: string;
    providerHasProposed?: boolean;
    providerProposal?: {
        amount: number;
        days: number;
        message: string;
    };
    eventLocation?: string;
    providerStatus?: string;
    orgStatus?: string;
    isSigned?: boolean;
    projectStatus?: string;
    orgAdditionalRequirement?: string;
    serviceTime?: string;
}

export function TabWithTableView() {
    const [tabValue, setTabValue] = useState(0);
    const { pendingRequests } = useSelector((state: RootState) => state?.serviceRequest);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const tabLabels = ["Available Projects", "Awarded Projects", "Confirmed Services"];
    const [amount, setAmount] = useState('');
    const [days, setDays] = useState('');
    const [description, setDescription] = useState('');
    const proposalFormRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        dispatch(getRequestsByProvider());
    }, [tabValue, dispatch]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
        setSelectedProject(null);
        setModalOpen(false);
    };

    const handleApplyClick = async (row: Project) => {
        setSelectedProject(row);

        // Check if provider already proposed
        if (row.providerHasProposed) {
            const res = await dispatch(getProposalById(row._id) as any);

            if (res?.data?.providerProposal) {
                const {
                    amount: proposalAmount,
                    days: proposalDays,
                    message,
                } = res.data.providerProposal;
                setAmount(String(proposalAmount));
                setDays(String(proposalDays));
                setDescription(message);
            }
        } else {
            setAmount('');
            setDays('');
            setDescription('');
        }

        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
        setSelectedProject(null);
    };

    const handleUpdateProposal = async () => {
        console.log("update");
        const proposalData = {
            amount: Number(amount),
            days: Number(days),
            message: description,
        };
        const res = await dispatch(updateProviderProposal(selectedProject?._id, proposalData) as any);
        if (res?.status === 200) {
            toast.success(res?.data?.message);

            setAmount('');
            setDays('');
            setDescription('');
            setModalOpen(false);
            setSelectedProject(null);
            dispatch(getRequestsByProvider()); // Refresh
        } else {
            setModalOpen(false);

        }
    }
    const handleSubmitProposal = async () => {
        if (!amount || !days || !description || !selectedProject) return;

        const proposalData = {
            amount: Number(amount),
            days: Number(days),
            message: description,
        };

        const res = await dispatch(sendProviderProposal(selectedProject._id, proposalData) as any);
        console.log(res);

        if (res?.status === 200) {
            toast.success(res?.data?.message);

            setAmount('');
            setDays('');
            setDescription('');
            setModalOpen(false);
            setSelectedProject(null);
            dispatch(getRequestsByProvider()); // Refresh
        } else {
            setModalOpen(false);

        }
    };

    return (
        <>
            <Paper
                elevation={3}
                sx={{
                    borderRadius: 2,
                    boxShadow: 3,
                    overflow: "hidden",
                    marginTop: 3,
                    display: "flex",
                    justifyContent: "center"
                }}
            >
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                    allowScrollButtonsMobile
                    TabIndicatorProps={{ style: { display: "none" } }}
                    textColor="inherit"
                    sx={{
                        "& .MuiTabs-scroller": {
                            overflow: "auto !important"
                        }
                    }}
                >
                    {tabLabels.map((label, index) => (
                        <Tab
                            key={index}
                            label={label}
                            sx={{
                                px: { xs: 1, sm: 3 },
                                minWidth: "unset",
                                textTransform: "none",
                                fontWeight: tabValue === index ? "bold" : "normal",
                                color: tabValue === index ? "black" : "gray",
                                fontSize: { xs: "0.75rem", sm: "0.875rem" }
                            }}
                        />
                    ))}
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <>
                    {/* <MatrixOneCard metrics={metrics} /> */}
                    <RequestTabSection
                        title="Available Projects (Organizer Requests)"
                        description=""
                        headers={availableProjectsTableHeaders}
                        data={pendingRequests}
                        type="1"
                        onApply={handleApplyClick}
                        onViewDetails={() => {
                            setSelectedProject(null);
                        }}
                    />

                    {/* Proposal Form Modal */}
                    <Modal
                        open={modalOpen}
                        onClose={handleCloseModal}
                        aria-labelledby="proposal-modal-title"
                        aria-describedby="proposal-modal-description"
                    >
                        <Box
                            sx={{
                                position: 'absolute',
                                top: '50%',
                                left: '50%',
                                transform: 'translate(-50%, -50%)',
                                width: { xs: '95%', sm: '90%', md: '85%', lg: '80%' },
                                maxWidth: '1200px',
                                maxHeight: '90vh',
                                bgcolor: 'background.paper',
                                borderRadius: 2,
                                boxShadow: 24,
                                p: 0,
                                display: 'flex',
                                flexDirection: { xs: 'column', md: 'row' },
                                overflow: 'hidden'
                            }}
                        >
                            {/* Left Panel - Project Details */}
                            <Box
                                sx={{
                                    flex: { md: 1 },
                                    p: 3,
                                    backgroundColor: '#f9f9f9',
                                    overflowY: 'auto',
                                    maxHeight: '90vh'
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" gutterBottom color="#1F8FCD">
                                    Project Details
                                </Typography>

                                <Box sx={{ mb: 3 }}>
                                    <Typography variant="h6" fontWeight="bold" color="#0B2E4C" gutterBottom>
                                        {selectedProject?.eventId?.eventName}
                                    </Typography>
                                    <Chip
                                        label={selectedProject?.providerHasProposed ? "Proposal Submitted" : "New Project"}
                                        color={selectedProject?.providerHasProposed ? "success" : "primary"}
                                        size="small"
                                        sx={{ mb: 2 }}
                                    />
                                </Box>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Event Date" value={selectedProject?.eventId?.date ? new Date(selectedProject.eventId.date).toLocaleDateString() : 'N/A'} />

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Service Time" value={formatTimeTo12Hour(selectedProject?.eventId?.time)} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Service Time" value={selectedProject?.serviceTime ? new Date(selectedProject.serviceTime).toLocaleString() : 'N/A'} />

                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Location" value={selectedProject?.eventId?.location || selectedProject?.eventLocation || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Service Type" value={selectedProject?.serviceRequestId?.serviceType || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Organizer Budget" value={selectedProject?.orgBudget || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <DetailItem title="Organizer" value={selectedProject?.organizerId?.name || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Event Description
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                backgroundColor: 'white',
                                                borderRadius: 1,
                                                border: '1px solid #e0e0e0',
                                                minHeight: '60px'
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {selectedProject?.eventId?.description ?
                                                    selectedProject.eventId.description.replace(/<[^>]*>/g, '') :
                                                    'No description available'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Organizer Requirements
                                        </Typography>
                                        <Box
                                            sx={{
                                                p: 1.5,
                                                backgroundColor: 'white',
                                                borderRadius: 1,
                                                border: '1px solid #e0e0e0',
                                                minHeight: '60px'
                                            }}
                                        >
                                            <Typography variant="body2">
                                                {selectedProject?.orgRequirement || 'No specific requirements provided'}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                    {selectedProject?.orgAdditionalRequirement && (
                                        <Grid item xs={12}>
                                            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                                Additional Requirements
                                            </Typography>
                                            <Box
                                                sx={{
                                                    p: 1.5,
                                                    backgroundColor: 'white',
                                                    borderRadius: 1,
                                                    border: '1px solid #e0e0e0',
                                                    minHeight: '60px'
                                                }}
                                            >
                                                <Typography variant="body2">
                                                    {selectedProject.orgAdditionalRequirement}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    )}
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Project Status" value={selectedProject?.projectStatus || 'N/A'} />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <DetailItem title="Provider Status" value={selectedProject?.providerStatus || 'N/A'} />
                                    </Grid>
                                </Grid>
                            </Box>

                            {/* Divider */}
                            <Divider orientation="vertical" flexItem sx={{ display: { xs: 'none', md: 'block' } }} />

                            {/* Right Panel - Proposal Form */}
                            <Box
                                sx={{
                                    flex: { md: 1 },
                                    p: 3,
                                    overflowY: 'auto',
                                    maxHeight: '90vh'
                                }}
                            >
                                <Typography variant="h5" fontWeight="bold" gutterBottom color="#1F8FCD">
                                    Submit Your Proposal
                                </Typography>

                                <Typography variant="body2" color="textSecondary" paragraph>
                                    Fill out the form below to submit your proposal for this project.
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Amount (XAF)
                                        </Typography>
                                        <TextField
                                            placeholder="Enter Amount"
                                            fullWidth
                                            variant="outlined"
                                            value={amount}
                                            onChange={(e) => setAmount(e.target.value)}
                                            type="number"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Days Required
                                        </Typography>
                                        <TextField
                                            placeholder="Enter Days"
                                            fullWidth
                                            variant="outlined"
                                            value={days}
                                            onChange={(e) => setDays(e.target.value)}
                                            type="number"
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                                            Proposal Description
                                        </Typography>
                                        <TextField
                                            placeholder="Describe your approach, timeline, and why you're the best fit for this project..."
                                            fullWidth
                                            multiline
                                            rows={4}
                                            variant="outlined"
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                        />
                                    </Grid>

                                    <Grid item xs={12} mt={2} display="flex" justifyContent="flex-end" gap={2}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleCloseModal}
                                            sx={{
                                                borderRadius: "10px",
                                                textTransform: "none",
                                                paddingX: 3,
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        {
                                            selectedProject?.providerHasProposed ? (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "#0B2E4C",
                                                        borderRadius: "10px",
                                                        textTransform: "none",
                                                        paddingX: 3,
                                                        "&:hover": {
                                                            backgroundColor: "#09304a",
                                                        },
                                                    }}
                                                    onClick={handleUpdateProposal}
                                                    disabled={!amount || !days || !description}
                                                >
                                                    Update Proposal
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="contained"
                                                    sx={{
                                                        backgroundColor: "#0B2E4C",
                                                        borderRadius: "10px",
                                                        textTransform: "none",
                                                        paddingX: 3,
                                                        "&:hover": {
                                                            backgroundColor: "#09304a",
                                                        },
                                                    }}
                                                    onClick={handleSubmitProposal}
                                                    disabled={!amount || !days || !description}
                                                >
                                                    Submit Proposal
                                                </Button>
                                            )
                                        }


                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>
                    </Modal>
                </>
            )}

            {tabValue === 1 && (
                <SignedTab />
            )}

            {tabValue === 2 && (
                <ConfirmedTab />
            )}
        </>
    );
}

// Helper component for detail items
function DetailItem({ title, value }: { title: string; value: string }) {
    return (
        <Box>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" sx={{ p: 1, backgroundColor: 'white', borderRadius: 1, border: '1px solid #e0e0e0' }}>
                {value}
            </Typography>
        </Box>
    );
}