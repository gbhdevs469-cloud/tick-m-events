import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EventSearchAndDetailsView } from 'src/sections/event-search-and-details/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Event Search & Details - ${CONFIG.appName}`}</title>
      </Helmet>

      <EventSearchAndDetailsView />
    </>
  );
}
