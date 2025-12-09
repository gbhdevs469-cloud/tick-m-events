import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ProviderBidsList } from 'src/sections/projects/provider-bids-list';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Bids - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProviderBidsList />
    </>
  );
}
