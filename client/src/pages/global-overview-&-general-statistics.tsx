import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { GlobalOverviewAndGeneralStatisticsView } from 'src/sections/global-overview-&-general-statistics/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Global Overview & General Statistics - ${CONFIG.appName}`}</title>
      </Helmet>

      <GlobalOverviewAndGeneralStatisticsView />
    </>
  );
}
