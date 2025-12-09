import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EditEventsView } from 'src/sections/edit-evets/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Events Update - ${CONFIG.appName}`}</title>
      </Helmet>
      <EditEventsView />
    </>
  );
}
