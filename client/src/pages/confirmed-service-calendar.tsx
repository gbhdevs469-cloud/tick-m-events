import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ConfirmedServiceCalendarView } from 'src/sections/confirmed-service-calendar/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Confirmed Service Calendar - ${CONFIG.appName}`}</title>
      </Helmet>

      <ConfirmedServiceCalendarView />
    </>
  );
}
