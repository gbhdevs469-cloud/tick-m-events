import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EventsView } from 'src/sections/events/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Events - ${CONFIG.appName}`}</title>
      </Helmet>

      <EventsView />
    </>
  );
}
