import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { Button, Box, Alert, useMediaQuery, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { _giftboxdata, _messages, _notifications } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { AppDispatch, RootState } from 'src/redux/store';
import { usePathname } from 'src/routes/hooks';
import { HeadingCommon } from 'src/components/multiple-responsive-heading/heading';
import { getFilteredNavItems } from 'src/routes/hooks/getFilterNavItesm';
import { fetchUserPoints } from "src/redux/actions/rewardActions";

import { Main } from './main';
import { layoutClasses } from '../classes';
import { NavMobile, NavDesktop } from './nav';
import { navData } from '../config-nav-dashboard';
import { MenuButton } from '../components/menu-button';
import { LayoutSection } from '../core/layout-section';
import { HeaderSection } from '../core/header-section';
import { NotificationsPopover } from '../components/notifications-popover';
import { MessagePopover } from '../components/message-popover';
import { GiftPopover } from '../components/gift-popover';
import { UserPopover } from '../components/user-popover';
import { WishlistPopover } from '../components/wishlist-popover';
import { SearchEvent } from './search-box';
import { TranslateWidget } from '../../../TranslateWidget';


// ----------------------------------------------------------------------

export type DashboardLayoutProps = {
  sx?: SxProps<Theme>;
  children: React.ReactNode;
  header?: {
    sx?: SxProps<Theme>;
  };
};

export function DashboardLayout({ sx, children, header }: DashboardLayoutProps) {
  const theme = useTheme();
  const dispatch = useDispatch<AppDispatch>();
  const { _id, name, role } = useSelector((state: RootState) => state?.auth?.user);
  const points = useSelector((state: RootState) => state.reward.points || 0);

  const filteredNavItems = getFilteredNavItems(navData, role);
  const pathname = usePathname()
  const navigate = useNavigate();
  const isMobileOrTablet = useMediaQuery(theme.breakpoints.down("md")); // Hide on md & below
  const hiddenPaths = ['/ticket-validation-at-entry'];
  const hiddenTicketManagement = ["/ticket-management"];
  const hiddenSearchSelect = ['/search-&-select-service-providers'];
  const hiddenProfileService = ['/profile-&-services-management'];
  const hiddenTicketingAndTransection = ['/ticketing-&-transactions-supervision'];
  const hiddenUsrMange = ['/user-management'];
  const hiddenGlobalOverview = ['/global-overview-&-general-statistics'];
  const hiddenStatisticsPerform = ['/statistics-&-performance'];
  const hiddenMessageClientRel = ['/messaging-&-client-relationship'];
  const hiddenTransectionPayment = ['/transaction-&-payment-management'];
  const hiddenServiceCal = ['/confirmed-service-calendar'];
  const hiddenReserContracts = ['/reservations-and-contracts'];
  const hiddenLoyaltyProgram = ['/loyalty-program'];
  const hiddenTicketPurchasePro = ['/ticket-purchase-process'];
  const hiddenEventSearchDetails = ['/event-search-and-details'];
  const hiddenEventDetails = ['/events/add-new'];
  const hiddenCustomPhotoVideo = ['/custom-photo-or-video-filters-for-events'];
  const hiddenTranPaymet = ['/transection-and-payment'];
  const hiddenVisibilityAccess = ['/visibility-and-access-settings'];
  const hiddenDashboard = ['/'];

  const [navOpen, setNavOpen] = useState(false);

  const layoutQuery: Breakpoint = 'lg';
  useEffect(() => {
    dispatch(fetchUserPoints());
  }, [dispatch]);

  return (
    <LayoutSection
      /** **************************************
       * Header
       *************************************** */
      headerSection={
        <HeaderSection
          layoutQuery={layoutQuery}
          slotProps={{
            container: {
              maxWidth: false,
              sx: { px: { [layoutQuery]: 3 } },
            },
          }}
          sx={header?.sx}
          slots={{
            topArea: (
              <Alert severity="info" sx={{ display: 'none', borderRadius: 0 }}>
                This is an info Alert.
              </Alert>
            ),
            leftArea: (
              <>
                <MenuButton
                  onClick={() => setNavOpen(true)}
                  sx={{
                    ml: -1,
                    [theme.breakpoints.up(layoutQuery)]: { display: 'none' },
                  }}
                />
                <NavMobile
                  data={filteredNavItems}
                  open={navOpen}
                  onClose={() => setNavOpen(false)}
                />

                {
                  (
                    hiddenServiceCal.some(path => pathname.includes(path))) &&
                  !isMobileOrTablet && (
                    <HeadingCommon weight={600} baseSize="30px" title="Calendar" />
                  )
                }
                {
                  role === 'provider' &&
                  hiddenDashboard.some(path => pathname === path) &&
                  !isMobileOrTablet &&
                  <HeadingCommon weight={600} baseSize="30px" title="Home & Global View" />
                }
                {
                  hiddenTransectionPayment.some(path => pathname.includes(path)) && !isMobileOrTablet && <HeadingCommon weight={600} baseSize="30px" title="Transaction & Payment Management" />
                }
                {
                  hiddenMessageClientRel.some(path => pathname.includes(path)) && !isMobileOrTablet && <HeadingCommon weight={600} baseSize="30px" title="Messaging & Client Relationship" />
                }

                {
                  hiddenGlobalOverview.some(path => pathname.includes(path)) && !isMobileOrTablet && <HeadingCommon weight={600} baseSize="30px" title="Global Overview & General Statistics" />
                }
                {
                  hiddenUsrMange.some(path => pathname.includes(path)) && !isMobileOrTablet && <HeadingCommon weight={600} baseSize="30px" title="Admin Panel" />
                }
                {
                  role === 'admin' &&
                  hiddenDashboard.some(path => pathname === path) &&
                  !isMobileOrTablet && <HeadingCommon weight={600} baseSize="30px" title="TICK-M EVENTS" />
                }
                {
                  hiddenTicketingAndTransection.some(path => pathname.includes(path)) && !isMobileOrTablet && <HeadingCommon weight={600} baseSize="30px" title="Ticketing & Transactions Supervision" />
                }
                {
                  (
                    role === 'participant' &&
                    <Typography fontWeight={600} fontSize={{ xs: "18px", sm: "24px", md: "30px" }} key={_id}>
                      Hey Welcome, <span>{name}</span>!
                    </Typography>
                  )
                }
              </>
            ),
            rightArea: (
              <Box display="flex" alignItems="center" gap={2} >
                {
                  role === 'organizer' && (<SearchEvent />)
                }
                {/* Notifications & Popovers (Hidden on Mobile & Tablet) */}
                {!isMobileOrTablet && (
                  <>
                    {
                      !hiddenEventSearchDetails.some(path => pathname.includes(path)) &&
                      !hiddenTicketPurchasePro.some(path => pathname.includes(path)) &&
                      !hiddenPaths.some(path => pathname.includes(path)) &&
                      !hiddenLoyaltyProgram.some(path => pathname.includes(path)) &&
                      !hiddenCustomPhotoVideo.some(path => pathname.includes(path)) &&
                      <Box display="flex" gap={1} alignItems="center">

                        <NotificationsPopover data={_notifications} />
                        {
                          !hiddenTicketManagement.some(path => pathname.includes(path)) &&
                          role === 'provider' &&
                          role !== 'participant' &&
                          !hiddenServiceCal.some(path => pathname.includes(path)) &&
                          !hiddenTransectionPayment.some(path => pathname.includes(path)) &&
                          role !== 'admin' &&
                          hiddenDashboard.some(path => pathname.includes(path)) &&
                          !hiddenSearchSelect.some(path => pathname.includes(path)) &&
                          !hiddenTicketingAndTransection.some(path => pathname.includes(path)) &&
                          !hiddenProfileService.some(path => pathname.includes(path)) &&
                          !hiddenUsrMange.some(path => pathname.includes(path)) &&
                          !hiddenStatisticsPerform.some(path => pathname.includes(path)) &&
                          !hiddenMessageClientRel.some(path => pathname.includes(path)) &&
                          <>
                            {

                              !hiddenGlobalOverview.some(path => pathname.includes(path)) &&
                              <>
                                <MessagePopover data={_messages} />
                                {/* {
                                  !hiddenReserContracts.some(path => pathname.includes(path)) && <GiftPopover data={_giftboxdata} />
                                } */}

                              </>
                            }
                            {/* {
                              !hiddenReserContracts.some(path => pathname.includes(path)) && <EmailPopover totalUnRead="2" />
                            } */}

                          </>
                        }

                      </Box>
                    }
                  </>
                )}
                {
                  (
                    role === 'participant' &&
                    <>
                      <WishlistPopover />
                    </>
                  )
                }
                {
                  (
                    hiddenEventSearchDetails.some(path => pathname.includes(path)) &&
                    <>
                      <Iconify icon="typcn:filter" width={24} />
                    </>
                  )
                }

                {
                  hiddenLoyaltyProgram.some(path => pathname.includes(path)) && (
                    <HeadingCommon
                      title={points?.toString() || 0}
                      weight={700}
                      color="#0B2E4C"
                    />
                  )
                }
                {
                  (hiddenTransectionPayment.some(path => pathname.includes(path))) && (
                    <Typography fontWeight={600} fontSize={{ xs: 14, sm: 16, md: 18 }} color="#3CB1F1">
                      Balance: <span style={{ color: "#757575" }}>2,500 XAF</span>
                    </Typography>
                  )
                }
                {/* Buttons (Hidden on Mobile & Tablet) */}
                {!isMobileOrTablet && (
                  <>
                    {
                      !hiddenDashboard.some(path => pathname.includes(path)) &&
                      !hiddenTranPaymet.some(path => pathname.includes(path)) &&
                      role !== 'participant' &&
                      !hiddenEventSearchDetails.some(path => pathname.includes(path)) &&
                      !hiddenTicketPurchasePro.some(path => pathname.includes(path)) &&
                      !hiddenTicketManagement.some(path => pathname.includes(path)) &&
                      !hiddenLoyaltyProgram.some(path => pathname.includes(path)) &&
                      !hiddenCustomPhotoVideo.some(path => pathname.includes(path)) &&
                      role !== 'provider' &&
                      !hiddenServiceCal.some(path => pathname.includes(path)) &&
                      !hiddenReserContracts.some(path => pathname.includes(path)) &&
                      !hiddenPaths.some(path => pathname.includes(path)) &&
                      !hiddenTransectionPayment.some(path => pathname.includes(path)) &&
                      !hiddenMessageClientRel.some(path => pathname.includes(path)) &&
                      !hiddenStatisticsPerform.some(path => pathname.includes(path)) &&
                      !hiddenSearchSelect.some(path => pathname.includes(path)) &&
                      !hiddenProfileService.some(path => pathname.includes(path)) &&
                      role !== 'admin' &&
                      !hiddenDashboard.some(path => pathname.includes(path)) &&
                      !hiddenUsrMange.some(path => pathname.includes(path)) &&
                      !hiddenGlobalOverview.some(path => pathname.includes(path)) &&
                      !hiddenTicketingAndTransection.some(path => pathname.includes(path)) &&
                      <>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#0C2340",
                            color: "white",
                            borderRadius: "8px",
                            px: 1,
                            fontSize: 16,
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Save Changes
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            borderRadius: "8px",
                            px: 1,
                            borderColor: "#C8C8C8",
                            color: "#2295D4",
                            fontSize: 16,
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Publish Event
                        </Button>
                      </>
                    }
                    {
                      !isMobileOrTablet && (
                        role === 'organizer' &&
                        !hiddenTranPaymet.some(path => pathname.includes(path)) &&
                        (
                          <>
                            <Button
                              variant="contained"
                              disabled={hiddenEventDetails?.toString() === pathname?.toString()}
                              onClick={() => navigate("/events/add-new")} // Redirect on click
                              sx={{
                                backgroundColor: "#0C2340",
                                color: "white",
                                borderRadius: "8px",
                                px: 1,
                                fontSize: 16,
                                fontFamily: "Poppins, sans-serif",
                                fontWeight: 600
                              }}
                            >
                              Create an Event
                            </Button>
                            <Link to='/visibility-and-access-settings'>
                              <Button
                                variant="contained"
                                disabled={hiddenVisibilityAccess?.toString() === pathname?.toString()}

                                sx={{
                                  backgroundColor: "#0C2340",
                                  color: "white",
                                  borderRadius: "8px",
                                  px: 1,
                                  fontSize: 16,
                                  fontFamily: "Poppins, sans-serif",
                                  fontWeight: 600
                                }}
                              >
                                Settings
                              </Button>
                            </Link>
                          </>
                        )
                      )
                    }
                    {
                      hiddenTranPaymet.some(path => pathname.includes(path)) &&
                      <>
                        <Button
                          variant="contained"
                          sx={{
                            backgroundColor: "#0C2340",
                            color: "white",
                            borderRadius: "8px",
                            px: 1,
                            fontSize: 16,
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Export
                        </Button>
                        <Button
                          variant="outlined"
                          sx={{
                            borderRadius: "8px",
                            px: 1,
                            borderColor: "#C8C8C8",
                            color: "#2295D4",
                            fontSize: 16,
                            fontFamily: "Poppins, sans-serif",
                            fontWeight: 600
                          }}
                        >
                          Request Help
                        </Button>
                      </>
                    }
                    {pathname.includes('/ticket-management') && (
                      <Button
                        variant="contained"
                        sx={{
                          backgroundColor: "#0C2340",
                          color: "white",
                          borderRadius: "8px",
                          px: 1,
                          fontSize: 16,
                          fontFamily: "Poppins, sans-serif",
                          fontWeight: 600
                        }}
                      >
                        My Tickets
                      </Button>
                    )}
                    {hiddenCustomPhotoVideo.some(path => pathname.includes(path)) && (
                      <Button
                        variant="contained"
                        size='small'
                        sx={{
                          backgroundColor: "#0C2340",
                          color: "white",
                          borderRadius: 1,
                          p: 1,
                          fontSize: 16,
                          fontWeight: 500
                        }}
                      >
                        Gallery
                      </Button>
                    )}

                  </>
                )}

                {/* User Profile */}
                <UserPopover />

              </Box>
            ),
          }}
        />
      }
      /** **************************************
       * Sidebar
       *************************************** */
      sidebarSection={
        <NavDesktop data={filteredNavItems} layoutQuery={layoutQuery} />
      }
      /** **************************************
       * Footer
       *************************************** */
      footerSection={null}
      /** **************************************
       * Style
       *************************************** */
      cssVars={{
        '--layout-nav-vertical-width': '280px',
        '--layout-dashboard-content-pt': theme.spacing(1),
        '--layout-dashboard-content-pb': theme.spacing(1),
        '--layout-dashboard-content-px': theme.spacing(3),
      }}
      sx={{
        [`& .${layoutClasses.hasSidebar}`]: {
          [theme.breakpoints.up(layoutQuery)]: {
            pl: 'var(--layout-nav-vertical-width)',
          },
        },
        ...sx,
      }}
    >
      <Main>{children}</Main>
    </LayoutSection>
  );
}
