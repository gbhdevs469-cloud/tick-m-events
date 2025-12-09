import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { StatisticsAndPerformanceView } from 'src/sections/statistics-&-performance/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Statistics & Performance - ${CONFIG.appName}`}</title>
      </Helmet>

      <StatisticsAndPerformanceView />
    </>
  );
}
