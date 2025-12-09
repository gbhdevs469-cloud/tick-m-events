import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StatisticsAndReportsView } from 'src/sections/statistics-and-reports/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Statistics & Reports - ${CONFIG.appName}`}</title>
      </Helmet>

      <StatisticsAndReportsView />
    </>
  );
}
