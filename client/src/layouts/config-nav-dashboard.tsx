import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------
export type UserRole = 'organizer' | 'admin' | 'provider' | 'participant';
export interface NavItem {
  title: string;
  path: string;
  icon?: React.ReactNode;
  info?: React.ReactNode;
  roles?: UserRole[]; // Add roles property
  children?: NavItem[];
}
const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

const EventsInfo = () => <Label color="success" variant="inverted">3</Label>


export const navData: NavItem[] = [
  // All Users Dashboard

  {
    title: 'Home & Global View',
    path: '/',
    icon: icon('ic_global_view'),
    roles: ['provider'],
  },
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-dashboard'),
    roles: ['admin'],
  },
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-dashboard'),
    roles: ['organizer'],
  },
  // Home and Recommandation
  {
    title: 'Home',
    path: '/',
    icon: icon('ic-dashboard'),
    roles: ['participant'],
  },
  // Organizer Sidebar
  {
    title: 'Statistics And Reports',
    path: '/statistics-&-reports',
    icon: icon('ic-dashboard'),
    roles: ['organizer'],
  },
  {
    title: 'Events',
    path: '#',
    icon: icon('ic_events'),
    // info: <EventsInfo />,
    roles: ['organizer'],
    children: [ // Submenu items
      {
        title: 'Add New',
        path: '/events/add-new',
        icon: icon('ic_event_create'),
      },
      {
        title: 'Edit an Event',
        path: '/events/edit',
        icon: icon('ic_event_edit'),
      },
    ],
  },
  {
    title: 'Projects',
    path: '#',
    icon: icon('ic_projects'),
    // info: <EventsInfo />,
    roles: ['provider'],
    children: [ // Submenu items
      {
        title: 'View',
        path: '/project/view',
        icon: icon('ic_project_view'),
      },
      {
        title: 'Bids',
        path: '/project/bids',
        icon: icon('ic_bids_list'),
      }
    ],
  },
  {
    title: 'Place A Bid',
    path: '#',
    icon: icon('ic_projects'),
    // info: <EventsInfo />,
    roles: ['organizer'],
    children: [ // Submenu items
      {
        title: 'Add',
        path: '/place-a-bid/add',
        icon: icon('ic_project_add'),
      },
      {
        title: 'View Place A Bids',
        path: '/place-a-bid/view',
        icon: icon('ic_project_view'),
      },
      {
        title: 'Awarded Projects',
        path: '/place-a-bid/bids/awarded',
        icon: icon('ic_awarded'),
      }

    ],
  },
  {
    title: 'Messaging',
    path: '/messaging-relationship',
    icon: icon('ic_chat'),
    roles: ['admin', 'organizer'],
  },
  {
    title: 'Ticket & Reservation Management',
    path: '/ticket-and-reservation-management',
    icon: icon('ic-analytics'),
    roles: ['organizer'],
  },
  {
    title: 'Marketing & Engagement',
    path: '/marketing-engagement',
    icon: icon('ic-marketing-ngagenment'),
    roles: ['organizer'],
  },
  {
    title: 'Entry Validation',
    path: '/entry-validation',
    icon: icon('ic-marketing-ngagenment'),
    roles: ['organizer'],
  },
  {
    title: 'Transaction & Payment',
    path: '/transaction-and-payment',
    icon: icon('ic-transaction-&-payment'),
    roles: ['organizer'],
  },
  {
    title: 'Find a Service Provider',
    path: '/search-&-select-service-providers',
    icon: icon('ic_find_service'),
    roles: ['organizer'],
  },
  // Provider Sidebar

  {
    title: 'Event Settings',
    path: '/visibility-and-access-settings',
    icon: icon('ic-analytics'),
    roles: ['organizer'],
  },

  {
    title: 'Event Search',
    path: '/event-search-and-details',
    icon: icon('ic_event'),
    roles: ['participant'],
  },
  {
    title: 'Ticket Purchase Process',
    path: '/ticket-purchase-process',
    icon: icon('ic_tickets'),
    roles: ['participant'],
  },
  {
    title: 'Ticket Management',
    path: '/ticket-management',
    icon: icon('ic_ticket_manage'),
    roles: ['participant'],
  },
  {
    title: 'Ticket Validation',
    path: '/ticket-validation-at-entry',
    icon: icon('ic_ticket_validation'),
    roles: ['participant'],
  },
  {
    title: 'Loyalty & Rewards',
    path: '/loyalty-program',
    icon: icon('ic_loyality_rewards'),
    roles: ['participant'],
  },
  {
    title: 'Photo/Video Filters',
    path: '/custom-photo-or-video-filters-for-events',
    icon: icon('ic_photo_video'),
    roles: ['participant'],
  },

  {
    title: 'Reservations & Contracts',
    path: '/reservations-and-contracts',
    icon: icon('ic_contract'),
    roles: ['provider'],
  },
  {
    title: 'Calendar',
    path: '/confirmed-service-calendar',
    icon: icon('ic_calender'),
    roles: ['provider'],
  },
  // {
  //   title: 'Transaction & Payment Management',
  //   path: '/transaction-&-payment-management',
  //   icon: icon('ic_payment_management'),
  //   roles: ['provider'],
  // },
  {
    title: 'Messaging & Client Relationship',
    path: '/messaging-&-client-relationship',
    icon: icon('ic_client_relation'),
    roles: ['provider'],
  },

  {
    title: 'Global Overview & General Statistics',
    path: '/global-overview-&-general-statistics',
    icon: icon('ic_global_overview'),
    roles: ['admin'],
  },
  {
    title: 'User Management',
    path: '/user-management',
    icon: icon('ic_user_management'),
    roles: ['admin'],

  },
  {
    title: 'Ticketing & Transactions Supervision',
    path: '/ticketing-&-transactions-supervision',
    icon: icon('ic_supervision'),
    roles: ['admin'],
  },
  {
    title: 'WithDrawal',
    path: '/withdrawal',
    icon: icon('ic_supervision'),
    roles: ['admin'],
  },
  {
    title: 'Refund Requests',
    path: '/refund-requests',
    icon: icon('ic_global_overview'),
    roles: ['admin'],
  },
  {
    title: 'Referrals Program',
    path: '/referrals',
    icon: icon('ic_money_deposit'),
    roles: ['participant'],
  },
  {
    title: 'Profile & Services Management',
    path: '/profile-&-services-management',
    icon: icon('ic_profile_service'),
    roles: ['provider'],
  },
  {
    title: 'Profile',
    path: '/profile',
    icon: icon('ic_profile_service'),
    roles: ['participant'],
  },
  {
    title: 'Statistics',
    path: '/statistics-&-performance',
    icon: icon('ic-analytics'),
    roles: ['provider'],
  },
  {
    title: 'Customization',
    path: '#',
    icon: icon('ic_projects'),
    roles: ['admin'],
    children: [ // Submenu items
      {
        title: 'Promotion Logos',
        path: '/customization/promotions-logos',
        icon: icon('ic_project_add'),
      },
      // {
      //   title: 'View Place A Bids',
      //   path: '/place-a-bid/view',
      //   icon: icon('ic_project_view'),
      // },
      // {
      //   title: 'Awarded Projects',
      //   path: '/place-a-bid/bids/awarded',
      //   icon: icon('ic_awarded'),
      // }

    ],
  },
];
