import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TicketValidationAtEntryView } from 'src/sections/ticket-validation-at-entry/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Ticket Validation At Entry - ${CONFIG.appName}`}</title>
      </Helmet>

      <TicketValidationAtEntryView />
    </>
  );
}
