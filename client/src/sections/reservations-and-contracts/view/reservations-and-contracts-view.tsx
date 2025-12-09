import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import { DashboardContent } from "src/layouts/dashboard";
import { MatrixThreeCard } from "src/components/matrix-three-cards/matrix-three-cards";
import { AppDispatch, RootState } from "src/redux/store";
import { getReservationContracts } from "src/redux/actions/provider/reservation-contract";
import { ReservationsTable } from "../reservationTable";

export function ReservationsAndContractsView() {
    const dispatch = useDispatch<AppDispatch>();
    const { 
        resarvationContracts: contracts, 
        loading, 
        error 
    } = useSelector((state: RootState) => state?.resContracts || {});
    const [viewType, setViewType] = useState<null | "active" | "completed">('active');
console.log("totalActiveProjects",contracts);
    useEffect(() => {
        dispatch(getReservationContracts());
    }, [dispatch]);

    const handleCardButtonClick = (type: "active" | "completed") => {
        setViewType(type);
    };

    // Show loading state
    if (loading) {
        return (
            <DashboardContent>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <CircularProgress />
                </Box>
            </DashboardContent>
        );
    }

    // Show error state
    if (error) {
        return (
            <DashboardContent>
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Reservations & Contracts
                    </Typography>
                </Box>
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                    <Typography color="error">Error loading data: {error}</Typography>
                </Box>
            </DashboardContent>
        );
    }

    return (
        <DashboardContent>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    Reservations & Contracts
                </Typography>
                <Typography variant="body1" color="textSecondary">
                    Manage your active contracts and view completed projects
                </Typography>
            </Box>

            {/* Metrics Cards - Always show even if data is empty */}
            <MatrixThreeCard
                metrics={[
                    {
                        title: "Active Contracts",
                        value: contracts?.summary?.totalActiveProjects || 0,
                        buttonType: "active"
                    },
                    {
                        title: "Completed Projects",
                        value: contracts?.summary?.totalCompletedProjects || 0,
                        buttonType: "completed"
                    },
                    {
                        title: "Total Expected Payments",
                        value: `${contracts?.summary?.overallExpectedPayments || 0} XAF`
                    }
                ]}
                onCardButtonClick={handleCardButtonClick}
            />

            {/* Active Projects Table - Show even if empty with proper fallbacks */}
            {viewType === "active" && (
                <Box mt={4}>
                    <Typography variant="h5" fontWeight="600" gutterBottom sx={{
                        color: "#2295D4",
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}>
                        Active Contracts
                        <Typography
                            component="span"
                            sx={{
                                backgroundColor: "#2295D4",
                                color: "white",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem"
                            }}
                        >
                            {contracts?.summary?.totalActiveProjects || 0}
                        </Typography>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Total Expected Payments: {contracts?.activeProjects?.totalExpectedPayments || 0} XAF
                    </Typography>
                    
                    {/* Show table even if projects array is empty */}
                    <ReservationsTable
                        projects={contracts?.activeProjects?.projects || []}
                        type="active"
                    />
                    
                    {/* Show message when no active projects */}
                    {(!contracts?.activeProjects?.projects || contracts.activeProjects.projects.length === 0) && (
                        <Typography variant="body1" color="textSecondary" textAlign="center" py={4}>
                            No active contracts found
                        </Typography>
                    )}
                </Box>
            )}

            {/* Completed Projects Table - Show even if empty with proper fallbacks */}
            {viewType === "completed" && (
                <Box mt={4}>
                    <Typography variant="h5" fontWeight="600" gutterBottom sx={{
                        color: "#4CAF50",
                        display: "flex",
                        alignItems: "center",
                        gap: 1
                    }}>
                        Completed Projects
                        <Typography
                            component="span"
                            sx={{
                                backgroundColor: "#4CAF50",
                                color: "white",
                                borderRadius: "50%",
                                width: 24,
                                height: 24,
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "0.75rem"
                            }}
                        >
                            {contracts?.summary?.totalCompletedProjects || 0}
                        </Typography>
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
                        Total Payments: {contracts?.completedProjects?.totalExpectedPayments || 0} XAF
                    </Typography>
                    
                    <ReservationsTable
                        projects={contracts?.completedProjects?.projects || []}
                        type="completed"
                    />
                    
                    
                </Box>
            )}
        </DashboardContent>
    );
}