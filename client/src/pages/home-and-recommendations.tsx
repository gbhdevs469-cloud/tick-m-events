import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HomeAndRecommendationsView } from 'src/sections/home-and-recommendations/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Home & Recommendations - ${CONFIG.appName}`}</title>
      </Helmet>

      <HomeAndRecommendationsView />
    </>
  );
}
