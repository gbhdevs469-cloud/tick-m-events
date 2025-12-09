import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MarketingEngagenmentView } from 'src/sections/marketing-engagenment/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Marketing Engagenment - ${CONFIG.appName}`}</title>
      </Helmet>

      <MarketingEngagenmentView />
    </>
  );
}
