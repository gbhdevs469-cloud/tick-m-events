import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { HomeAndGlobalView } from 'src/sections/home-and-global-view/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Home & Global - ${CONFIG.appName}`}</title>
      </Helmet>

      <HomeAndGlobalView />
    </>
  );
}
