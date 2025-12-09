import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TicketAndReservationManagementView } from 'src/sections/ticket-and-reservation-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ticket & Reservation Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <TicketAndReservationManagementView />
    </>
  );
}
