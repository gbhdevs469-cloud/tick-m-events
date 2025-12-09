import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TicketPurchaseProcessView } from 'src/sections/ticket-purchase-process/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ticket Purchase Process - ${CONFIG.appName}`}</title>
      </Helmet>

      <TicketPurchaseProcessView />
    </>
  );
}
