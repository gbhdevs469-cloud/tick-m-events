import { lazy, Suspense, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { varAlpha } from 'src/theme/styles';
import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { isUserLoggedIn } from 'src/redux/actions';
import Protected from 'src/redux/helper/HOC';
import { RoleProtectedRoute } from 'src/redux/helper/RoleWise';
import { MultipleDashboard } from 'src/hooks/common-dashbord';
import { GlobalHome } from 'src/sections/global-home';

// Constants
const ROLES = {
  PARTICIPANT: 'participant',
  ORGANIZER: 'organizer',
  PROVIDER: 'provider',
  ADMIN: 'admin',
};

const ALL_ROLES = Object.values(ROLES);

// Lazy imports organized by category
const LAZY_IMPORTS = {
  // Organizer Routes
  PlaceABidAddPage: lazy(() => import('src/pages/projects/placeABidAdd')),
  BidsOnPlaceABidsPage: lazy(() => import('src/pages/projects/bidsOnPlaceABids')),
  PlaceABidListPage: lazy(() => import('src/pages/projects/placeABidList')),
  MarketingEngagenmentPage: lazy(() => import('src/pages/marketing-engagenment')),
  EventDetailsPage: lazy(() => import('src/pages/event-details')),
  EntryValidationPage: lazy(() => import('src/pages/entry-validation')),
  TransectionAndPaymentPage: lazy(() => import('src/pages/transection-and-payment')),
  StatisticsAndReportsPage: lazy(() => import('src/pages/statistics-and-reports')),
  VisibilityAndAccessSettingsPage: lazy(() => import('src/pages/visibility-and-access-settings')),
  SearchAndSelectServiceProvidersPage: lazy(() => import('src/pages/search-&-select-service-providers')),

  // Participant Routes
  EventSearchAndDetailsPage: lazy(() => import('src/pages/event-search-and-details')),

  // Service Provider Routes
  Projects: lazy(() => import('src/pages/projects/projects-view')),
  Referrel: lazy(() => import('src/pages/referrel')),
  ProjectSinglePage: lazy(() => import('src/pages/projects/single-project')),
  ProviderBidsPage: lazy(() => import('src/pages/projects/provider-bids-list')),
  HomePage: lazy(() => import('src/pages/home')),
  SocialShare: lazy(() => import('src/pages/social-share')),
  SignInPage: lazy(() => import('src/pages/auth/sign-in')),
  RegisterPage: lazy(() => import('src/pages/auth/register')),
  FrontHomePage: lazy(() => import('src/pages/front-home')),
  EventsPage: lazy(() => import('src/pages/events')),
  CategoriesPage: lazy(() => import('src/pages/category/category')),
  SingleCategoryPage: lazy(() => import('src/pages/category/single-category')),
  Page404: lazy(() => import('src/pages/page-not-found')),
  TicketAndReservationManagementPage: lazy(() => import('src/pages/ticket-and-reservation-management')),
  ConfirmedServiceCalendarPage: lazy(() => import('src/pages/confirmed-service-calendar')),
  CustomPhotoAndVideoFiltersforEventsPage: lazy(() => import('src/pages/custom-photo-or-video-filters-for-events')),
  HomeAndGlobalPage: lazy(() => import('src/pages/home-and-global-view')),
  HomeAndRecommendationsPage: lazy(() => import('src/pages/home-and-recommendations')),
  LoyaltyProgramPage: lazy(() => import('src/pages/loyalty-program')),
  ReservationsAndContractsPage: lazy(() => import('src/pages/reservations-and-contracts')),
  TicketManagementViewPage: lazy(() => import('src/pages/ticket-management')),
  TicketPurchaseProcessPage: lazy(() => import('src/pages/ticket-purchase-process')),
  TicketValidationAtEntryPage: lazy(() => import('src/pages/ticket-validation-at-entry')),
  TransactionAndPaymentManagementPage: lazy(() => import('src/pages/transaction-&-payment-management')),
  MessagingAndClientRelationshipPage: lazy(() => import('src/pages/messaging-&-client-relationship')),
  StatisticsAndPerformancePage: lazy(() => import('src/pages/statistics-&-performance')),
  GlobalOverviewAndGeneralStatisticsPage: lazy(() => import('src/pages/global-overview-&-general-statistics')),
  UserManagementPage: lazy(() => import('src/pages/user-management')),
  TicketingAndTransactionsSupervisionPage: lazy(() => import('src/pages/ticketing-&-transactions-supervision')),
  MarketplaceAndServiceProviderSupervisionPage: lazy(() => import('src/pages/marketplace-&-service-provider-supervision')),
  PasswordRecoveryPage: lazy(() => import('src/pages/password-recovery')),
  ProfileAndServicesManagementPage: lazy(() => import('src/pages/profile-&-services-management')),
  MessageingRelationshipPage: lazy(() => import('src/pages/messageing-relationship')),
  EventEditPage: lazy(() => import('src/pages/evets-edit')),
  ContactPage: lazy(() => import('src/pages/contact')),
  SingleProfilePage: lazy(() => import('src/pages/single-profile')),
  WithDrawlPage: lazy(() => import('src/pages/withdrawl')),
  AwardedListPage: lazy(() => import('src/pages/signedProjectList')),
  AboutUsPage: lazy(() => import('src/pages/about-us')),
  GobalHomePage: lazy(() => import('src/pages/global-home')),
  EventListPage: lazy(() => import('src/pages/event-list')),
  PromotionLogosPage: lazy(() => import('src/pages/customization/promotion-logo/index')),
  RefundReqPage: lazy(() => import('src/pages/refund-requests')),
  ProfilePage: lazy(() => import('src/pages/profile')),
  ContactPayPage: lazy(() => import('src/pages/contact-pay-status')),
};

// Route configurations
const PROTECTED_ROUTES = [
  // Participant Routes
  { path: '/referrals', element: <LAZY_IMPORTS.Referrel />, roles: [ROLES.PARTICIPANT] },
  { path: '/home-and-recommendations', element: <LAZY_IMPORTS.HomeAndRecommendationsPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/event-search-and-details', element: <LAZY_IMPORTS.EventSearchAndDetailsPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/ticket-purchase-process', element: <LAZY_IMPORTS.TicketPurchaseProcessPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/ticket-management', element: <LAZY_IMPORTS.TicketManagementViewPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/ticket-validation-at-entry', element: <LAZY_IMPORTS.TicketValidationAtEntryPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/loyalty-program', element: <LAZY_IMPORTS.LoyaltyProgramPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/custom-photo-or-video-filters-for-events', element: <LAZY_IMPORTS.CustomPhotoAndVideoFiltersforEventsPage />, roles: [ROLES.PARTICIPANT] },
  { path: '/profile', element: <LAZY_IMPORTS.ProfilePage />, roles: [ROLES.PARTICIPANT] },

  // Organizer Routes
  { path: '/overview', element: <LAZY_IMPORTS.HomePage />, roles: [ROLES.ORGANIZER] },
  { path: '/statistics-&-reports', element: <LAZY_IMPORTS.StatisticsAndReportsPage />, roles: [ROLES.ORGANIZER] },
  { path: '/events/add-new', element: <LAZY_IMPORTS.EventDetailsPage />, roles: [ROLES.ORGANIZER] },
  { path: '/events/edit', element: <LAZY_IMPORTS.EventEditPage />, roles: [ROLES.ORGANIZER] },
  { path: '/ticket-and-reservation-management', element: <LAZY_IMPORTS.TicketAndReservationManagementPage />, roles: [ROLES.ORGANIZER] },
  { path: '/marketing-engagement', element: <LAZY_IMPORTS.MarketingEngagenmentPage />, roles: [ROLES.ORGANIZER] },
  { path: '/transaction-and-payment', element: <LAZY_IMPORTS.TransectionAndPaymentPage />, roles: [ROLES.ORGANIZER] },
  { path: '/entry-validation', element: <LAZY_IMPORTS.EntryValidationPage />, roles: [ROLES.ORGANIZER] },
  { path: '/search-&-select-service-providers', element: <LAZY_IMPORTS.SearchAndSelectServiceProvidersPage />, roles: [ROLES.ORGANIZER] },
  { path: '/visibility-and-access-settings', element: <LAZY_IMPORTS.VisibilityAndAccessSettingsPage />, roles: [ROLES.ORGANIZER] },
  { path: '/place-a-bid/add', element: <LAZY_IMPORTS.PlaceABidAddPage />, roles: [ROLES.ORGANIZER] },
  { path: '/place-a-bid/view', element: <LAZY_IMPORTS.PlaceABidListPage />, roles: [ROLES.ORGANIZER] },
  { path: '/place-a-bid/bids/:projectId', element: <LAZY_IMPORTS.BidsOnPlaceABidsPage />, roles: [ROLES.ORGANIZER] },
  { path: '/place-a-bid/bids/awarded', element: <LAZY_IMPORTS.AwardedListPage />, roles: [ROLES.ORGANIZER] },
  { path: '/messaging-relationship', element: <LAZY_IMPORTS.MessageingRelationshipPage />, roles: [ROLES.ADMIN, ROLES.ORGANIZER] },

  // Provider Routes
  { path: '/project/view', element: <LAZY_IMPORTS.Projects />, roles: [ROLES.PROVIDER] },
  { path: '/project/:projectId', element: <LAZY_IMPORTS.ProjectSinglePage />, roles: [ROLES.PROVIDER] },
  { path: '/project/bids', element: <LAZY_IMPORTS.ProviderBidsPage />, roles: [ROLES.PROVIDER] },
  { path: '/statistics-&-performance', element: <LAZY_IMPORTS.StatisticsAndPerformancePage />, roles: [ROLES.PROVIDER] },
  { path: '/profile-&-services-management', element: <LAZY_IMPORTS.ProfileAndServicesManagementPage />, roles: [ROLES.PROVIDER] },
  { path: '/confirmed-service-calendar', element: <LAZY_IMPORTS.ConfirmedServiceCalendarPage />, roles: [ROLES.PROVIDER] },
  { path: '/reservations-and-contracts', element: <LAZY_IMPORTS.ReservationsAndContractsPage />, roles: [ROLES.PROVIDER] },
  { path: '/transaction-&-payment-management', element: <LAZY_IMPORTS.TransactionAndPaymentManagementPage />, roles: [ROLES.PROVIDER] },
  { path: '/messaging-&-client-relationship', element: <LAZY_IMPORTS.MessagingAndClientRelationshipPage />, roles: [ROLES.PROVIDER] },

  // Admin Routes
  { path: '/marketplace-&-service-provider-supervision', element: <LAZY_IMPORTS.MarketplaceAndServiceProviderSupervisionPage />, roles: [ROLES.ADMIN] },
  { path: '/global-overview-&-general-statistics', element: <LAZY_IMPORTS.GlobalOverviewAndGeneralStatisticsPage />, roles: [ROLES.ADMIN] },
  { path: '/user-management', element: <LAZY_IMPORTS.UserManagementPage />, roles: [ROLES.ADMIN] },
  { path: '/ticketing-&-transactions-supervision', element: <LAZY_IMPORTS.TicketingAndTransactionsSupervisionPage />, roles: [ROLES.ADMIN] },
  { path: '/withdrawal', element: <LAZY_IMPORTS.WithDrawlPage />, roles: [ROLES.ADMIN] },
  { path: '/customization/promotions-logos', element: <LAZY_IMPORTS.PromotionLogosPage />, roles: [ROLES.ADMIN] },
  { path: '/refund-requests', element: <LAZY_IMPORTS.RefundReqPage />, roles: [ROLES.ADMIN] },

  // Common Routes (All roles)
  { path: '/', element: <MultipleDashboard />, roles: ALL_ROLES },
  { path: '/password-recovery', element: <LAZY_IMPORTS.PasswordRecoveryPage />, roles: ALL_ROLES },
  { path: '/payment-success', element: <LAZY_IMPORTS.ContactPayPage />, roles: ALL_ROLES },

];

const PUBLIC_ROUTES = [
  { path: '/payment-success', element: <LAZY_IMPORTS.ContactPayPage />, isPublic: true, layout: 'none' },
  { path: '/event-list', element: <LAZY_IMPORTS.EventListPage />, isPublic: true, layout: 'none' },
  { path: '/home', element: <GlobalHome />, isPublic: true, layout: 'none' },
  { path: '/about-us', element: <LAZY_IMPORTS.AboutUsPage />, isPublic: true, layout: 'none' },
  { path: '/sign-in', element: <LAZY_IMPORTS.SignInPage />, isPublic: true, layout: 'auth' },

  { path: '/register', element: <LAZY_IMPORTS.RegisterPage />, isPublic: true, layout: 'auth' },
  { path: '/contact-us', element: <LAZY_IMPORTS.ContactPage />, isPublic: true, layout: 'none' },
  { path: '/our-event/:eventId', element: <LAZY_IMPORTS.FrontHomePage />, isPublic: true, layout: 'none' },
  { path: '/post/:id', element: <LAZY_IMPORTS.SocialShare />, isPublic: true, layout: 'none' },
  { path: '/our-event', element: <LAZY_IMPORTS.EventsPage />, isPublic: true, layout: 'none' },
  { path: '/category/:categoryId', element: <LAZY_IMPORTS.SingleCategoryPage />, isPublic: true, layout: 'none' },
  { path: '/profile/:id', element: <LAZY_IMPORTS.SingleProfilePage />, isPublic: true, layout: 'none' },
  { path: '/category', element: <LAZY_IMPORTS.CategoriesPage />, isPublic: true, layout: 'none' },
  { path: '/404', element: <LAZY_IMPORTS.Page404 />, isPublic: true, layout: 'none' },
];

// Reusable components with PropTypes
const ProtectedRouteWrapper = ({ children }) => (
  <Protected>
    <DashboardLayout>
      <Suspense fallback={renderFallback}>
        {children}
      </Suspense>
    </DashboardLayout>
  </Protected>
);

ProtectedRouteWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

const createRoleProtectedElement = (element, allowedRoles, currentRole) => (
  <RoleProtectedRoute allowedRoles={allowedRoles} currentRole={currentRole}>
    {element}
  </RoleProtectedRoute>
);

// No PropTypes needed for createRoleProtectedElement as it's a helper function, not a component

const wrapWithAuthLayout = (element) => <AuthLayout>{element}</AuthLayout>;

// Loading fallback component
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

export function Router() {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.auth);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const currentRole = auth?.user?.role || ROLES.PARTICIPANT;

  useEffect(() => {
    const checkAuth = async () => {
      const aaa = await dispatch(isUserLoggedIn());
      setIsCheckingAuth(false);
    };

    checkAuth();
  }, [dispatch]);

  const routes = useMemo(() => {
    const protectedChildren = PROTECTED_ROUTES.map((route) => ({
      path: route.path,
      element: createRoleProtectedElement(route.element, route.roles || [], currentRole),
    }));

    const publicRoutes = PUBLIC_ROUTES.map((route) => {
      let element = route.element;

      if (route.layout === 'auth') {
        element = wrapWithAuthLayout(element);
      }

      return {
        path: route.path,
        element,
      };
    });

    return [
      {
        element: (
          <ProtectedRouteWrapper>
            <Outlet />
          </ProtectedRouteWrapper>
        ),
        children: protectedChildren,
      },
      ...publicRoutes,
      {
        path: '*',
        element: <Navigate to="/404" replace />,
      },
    ];
  }, [currentRole]);

  const routing = useRoutes(routes);

  if (isCheckingAuth) {
    return renderFallback;
  }

  return routing;
}