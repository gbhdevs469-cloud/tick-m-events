import { useTheme } from '@mui/material/styles';
import { Avatar, Box, Button, Popover, Typography, useMediaQuery } from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { usePathname } from 'src/routes/hooks';
import { _giftboxdata, _messages, _notifications } from 'src/_mock';
import { RootState } from 'src/redux/store';
import { logout } from 'src/redux/actions';

import { NotificationsPopover } from './notifications-popover';
import { MessagePopover } from './message-popover';
import { GiftPopover } from './gift-popover';

// Constants for hidden paths
const HIDDEN_PATHS = {
  USER_MANAGEMENT: ['/user-management'],
  TICKET_MANAGEMENT: ['/ticket-management'],
  TICKET_PURCHASE: ['/ticket-purchase-process'],
  PATHS: ['/ticket-validation-at-entry', '/loyalty-program'],
  PROFILE_SERVICE: ['/profile-&-services-management'],
  TICKETING_TRANSACTION: ['/ticketing-&-transactions-supervision'],
  GLOBAL_OVERVIEW: ['/global-overview-&-general-statistics'],
  STATISTICS_PERFORMANCE: ['/statistics-&-performance'],
  MESSAGE_CLIENT: ['/messaging-&-client-relationship'],
  TRANSACTION_PAYMENT: ['/transaction-&-payment-management'],
  SERVICE_CALENDAR: ['/confirmed-service-calendar'],
  RESERVATIONS_CONTRACTS: ['/reservations-and-contracts'],
  CUSTOM_PHOTO_VIDEO: ['/custom-photo-or-video-filters-for-events'],
  EVENT_SEARCH_DETAILS: ['/event-search-and-details'],
  TRANSACTION_PAYMENT_SIMPLE: ['/transaction-and-payment'],
  DASHBOARD: ['/'],
  EVENT_DETAILS: ['/events/add-new'],
  VISIBILITY_ACCESS: ['/visibility-and-access-settings'],
  SEARCH_SELECT: ['/search-&-select-service-providers'],
} as const;

// Role constants
const ROLE = {
  PARTICIPANT: 'participant',
  PROVIDER: 'provider',
  ADMIN: 'admin',
  ORGANIZER: 'organizer',
} as const;

export function UserPopover() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();
  const pathname = usePathname();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { _id, name, role, avatar } = useSelector((state: RootState) => state?.auth?.user);
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md"));

  // Helper functions
  const isPathHidden = (pathGroup: readonly string[]) => 
    pathGroup.some(path => pathname.includes(path));

  const shouldShowUserInfo = !isMobileOrTablet && !isPathHidden(HIDDEN_PATHS.USER_MANAGEMENT);
  const shouldShowAvatar = !isPathHidden(HIDDEN_PATHS.USER_MANAGEMENT);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    if (isMobileOrTablet) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await dispatch(logout() as any);
    navigate("/sign-in");
  };

  // Conditionals for popover content
  const shouldShowNotificationIcons = 
    !isPathHidden(HIDDEN_PATHS.EVENT_SEARCH_DETAILS) &&
    !isPathHidden(HIDDEN_PATHS.TICKET_PURCHASE) &&
    !isPathHidden(HIDDEN_PATHS.PATHS) &&
    !isPathHidden(HIDDEN_PATHS.CUSTOM_PHOTO_VIDEO);

  const shouldShowOrganizerButtons = 
    role === ROLE.ORGANIZER && 
    !isPathHidden(HIDDEN_PATHS.TRANSACTION_PAYMENT_SIMPLE);

  const shouldShowExportHelpButtons = 
    isPathHidden(HIDDEN_PATHS.TRANSACTION_PAYMENT_SIMPLE);

  const shouldShowSavePublishButtons = 
    !isPathHidden(HIDDEN_PATHS.DASHBOARD) &&
    !isPathHidden(HIDDEN_PATHS.TRANSACTION_PAYMENT_SIMPLE) &&
    role !== ROLE.PARTICIPANT &&
    !isPathHidden(HIDDEN_PATHS.EVENT_SEARCH_DETAILS) &&
    !isPathHidden(HIDDEN_PATHS.TICKET_PURCHASE) &&
    !isPathHidden(HIDDEN_PATHS.TICKET_MANAGEMENT) &&
    !isPathHidden(HIDDEN_PATHS.PATHS) &&
    !isPathHidden(HIDDEN_PATHS.SEARCH_SELECT) &&
    !isPathHidden(HIDDEN_PATHS.STATISTICS_PERFORMANCE) &&
    !isPathHidden(HIDDEN_PATHS.GLOBAL_OVERVIEW) &&
    !isPathHidden(HIDDEN_PATHS.USER_MANAGEMENT) &&
    !isPathHidden(HIDDEN_PATHS.TRANSACTION_PAYMENT) &&
    !isPathHidden(HIDDEN_PATHS.TICKETING_TRANSACTION) &&
    !isPathHidden(HIDDEN_PATHS.MESSAGE_CLIENT) &&
    !isPathHidden(HIDDEN_PATHS.PROFILE_SERVICE) &&
    !isPathHidden(HIDDEN_PATHS.SERVICE_CALENDAR) &&
    role !== ROLE.PROVIDER &&
    role !== ROLE.ADMIN &&
    !isPathHidden(HIDDEN_PATHS.CUSTOM_PHOTO_VIDEO) &&
    !isPathHidden(HIDDEN_PATHS.RESERVATIONS_CONTRACTS);

  // Reusable button styles
  const buttonStyles = {
    contained: {
      backgroundColor: "#0C2340",
      color: "white",
      borderRadius: "8px",
      px: 1,
      fontSize: 14,
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    outlined: {
      borderRadius: "8px",
      px: 1,
      borderColor: "#C8C8C8",
      color: "#2295D4",
      fontSize: 14,
      fontFamily: "Poppins, sans-serif",
      fontWeight: 600,
    },
    logout: {
      color: "red",
      borderColor: "red",
      my: 1,
      p: 1,
      width: "100%",
      fontSize: 16,
      fontWeight: 500,
    },
  };

  // User info component
  const UserInfo = () => (
    <Box key={_id}>
      <Typography textTransform="capitalize" fontWeight={600} color="#2295D4" fontFamily="Poppins, sans-serif">
        {name}
      </Typography>
      <Typography textTransform="capitalize" fontSize={12} color="gray" fontFamily="Poppins, sans-serif">
        {role} |&nbsp;
        <span
          role="button"
          tabIndex={0}
          style={{ cursor: 'pointer', color: 'red' }}
          onClick={handleLogout}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleLogout();
            }
          }}
          aria-label="Logout"
        >
          Logout
        </span>
      </Typography>
    </Box>
  );

  // Notification icons component
  const NotificationIcons = () => (
    <Box display="flex" gap={1} alignItems="center" justifyContent="center">
      <NotificationsPopover data={_notifications} />
      {role !== ROLE.PARTICIPANT &&
        !isPathHidden(HIDDEN_PATHS.TICKET_MANAGEMENT) &&
        role !== ROLE.PROVIDER &&
        role !== ROLE.ADMIN &&
        !isPathHidden(HIDDEN_PATHS.DASHBOARD) &&
        !isPathHidden(HIDDEN_PATHS.SERVICE_CALENDAR) &&
        !isPathHidden(HIDDEN_PATHS.TRANSACTION_PAYMENT) &&
        !isPathHidden(HIDDEN_PATHS.USER_MANAGEMENT) &&
        !isPathHidden(HIDDEN_PATHS.SEARCH_SELECT) &&
        !isPathHidden(HIDDEN_PATHS.TICKETING_TRANSACTION) &&
        !isPathHidden(HIDDEN_PATHS.PROFILE_SERVICE) &&
        !isPathHidden(HIDDEN_PATHS.MESSAGE_CLIENT) &&
        !isPathHidden(HIDDEN_PATHS.STATISTICS_PERFORMANCE) && (
          <>
            {!isPathHidden(HIDDEN_PATHS.GLOBAL_OVERVIEW) && (
              <>
                <MessagePopover data={_messages} />
                {/* {!isPathHidden(HIDDEN_PATHS.RESERVATIONS_CONTRACTS) && (
                  <GiftPopover data={_giftboxdata} />
                )} */}
              </>
            )}
          </>
        )}
    </Box>
  );

  return (
    <Box display="flex" alignItems="center" gap={1}>
      {/* Name & Role (Only visible on Desktop) */}
      {shouldShowUserInfo && <UserInfo />}

      {/* Avatar (Click to Show Name & Role Only on Mobile & Tablet) */}
      {shouldShowAvatar && (
        <Avatar
          src={avatar?.url}
          sx={{ 
            width: 40, 
            height: 40, 
            cursor: isMobileOrTablet ? "pointer" : "default" 
          }}
          onClick={handleOpen}
          variant="square"
        />
      )}

      {/* Popover for Mobile & Tablet */}
      {isMobileOrTablet && (
        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Box p={2} textAlign="center" key={_id}>
            <Typography textTransform="capitalize" fontWeight={600} color="#2295D4" fontFamily="Poppins, sans-serif">
              {name}
            </Typography>
            <Typography textTransform="capitalize" fontSize={12} color="gray" fontFamily="Poppins, sans-serif">
              {role}
            </Typography>
          </Box>

          {shouldShowNotificationIcons && <NotificationIcons />}

          {shouldShowSavePublishButtons && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginX: 1 }}>
              <Button sx={buttonStyles.contained}>
                Save Changes
              </Button>
              <Button variant="outlined" sx={buttonStyles.outlined}>
                Publish Events
              </Button>
            </Box>
          )}

          {shouldShowOrganizerButtons && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginX: 1 }}>
              <Button
                variant="contained"
                disabled={HIDDEN_PATHS.EVENT_DETAILS[0] === pathname}
                onClick={() => navigate("/events/add-new")}
                sx={buttonStyles.contained}
              >
                Create an Events
              </Button>
              <Button
                variant="outlined"
                disabled={HIDDEN_PATHS.VISIBILITY_ACCESS[0] === pathname}
                sx={buttonStyles.outlined}
              >
                <Link
                  to="/visibility-and-access-settings"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                  }}
                >
                  Settings
                </Link>
              </Button>
            </Box>
          )}

          {shouldShowExportHelpButtons && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, marginX: 1 }}>
              <Button variant="contained" sx={buttonStyles.contained}>
                Export
              </Button>
              <Button variant="outlined" sx={buttonStyles.outlined}>
                Request Help
              </Button>
            </Box>
          )}

          {isPathHidden(HIDDEN_PATHS.TICKET_MANAGEMENT) && (
            <Box sx={{ px: 1, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" sx={{ ...buttonStyles.contained, width: "100%" }}>
                My Tickets
              </Button>
            </Box>
          )}

          {isPathHidden(HIDDEN_PATHS.CUSTOM_PHOTO_VIDEO) && (
            <Box sx={{ px: 1, display: 'flex', justifyContent: 'center' }}>
              <Button variant="contained" size='small' sx={{ ...buttonStyles.contained, width: "100%" }}>
                Gallery
              </Button>
            </Box>
          )}

          <Box sx={{ px: 1, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="outlined"
              size='small'
              onClick={handleLogout}
              sx={buttonStyles.logout}
            >
              Logout
            </Button>
          </Box>
        </Popover>
      )}
    </Box>
  );
}