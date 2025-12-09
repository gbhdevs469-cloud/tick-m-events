import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TicketingAndTransactionsSupervisionView } from 'src/sections/ticketing-&-transactions-supervision/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ticketing & Transactions Supervision - ${CONFIG.appName}`}</title>
      </Helmet>

      <TicketingAndTransactionsSupervisionView />
    </>
  );
}
