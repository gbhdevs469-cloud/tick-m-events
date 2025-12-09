import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EventDetailsView } from 'src/sections/event-details/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Event Details - ${CONFIG.appName}`}</title>
      </Helmet>

      <EventDetailsView />
    </>
  );
}
