import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { EventValidationView } from 'src/sections/entry-validation/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Entry Validation - ${CONFIG.appName}`}</title>
      </Helmet>

      <EventValidationView />
    </>
  );
}
