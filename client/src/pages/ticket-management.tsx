import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TicketManagementView } from 'src/sections/ticket-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ticket Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <TicketManagementView />
    </>
  );
}
