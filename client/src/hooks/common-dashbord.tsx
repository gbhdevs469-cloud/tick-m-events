import { lazy, Suspense } from 'react';
import { Box, LinearProgress, linearProgressClasses } from '@mui/material';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

import { RootState } from 'src/redux/store';
import { varAlpha } from 'src/theme/styles';

// Lazy load dashboard components
const HomePage = lazy(() => import('../pages/home'));
const HomeAndRecommendationsPage = lazy(() => import('../pages/home-and-recommendations'));
const HomeAndGlobalPage = lazy(() => import('../pages/home-and-global-view'));
const GlobalPage = lazy(() => import('../pages/global-home'));
const MarketplaceAndServiceProviderSupervisionPage = lazy(() => import('../pages/marketplace-&-service-provider-supervision'));

const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
        <LinearProgress
            sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
            }}
        />
    </Box>
);

export function MultipleDashboard() {
    const role = useSelector((state: RootState) => state.auth.user?.role);
    const isLoading = useSelector((state: RootState) => state.auth.loading);

    if (isLoading) {
        return renderFallback;
    }

    return (
        <Suspense fallback={renderFallback}>
            <Box className="dashboard-container">
                {(() => {
                    switch (role) {
                        case 'participant':
                            return <HomeAndRecommendationsPage />
                        case 'admin':
                            return <MarketplaceAndServiceProviderSupervisionPage />;
                        case 'organizer':
                            return <HomePage />;
                        case 'provider':
                            return <HomeAndGlobalPage />;
                        default:
                            return <GlobalPage />;
                    }
                })()}
            </Box>
        </Suspense>
    );
};

export function RootLayout() {
    return (
        <Box className="app-container">
            <Outlet />
        </Box>
    );
};