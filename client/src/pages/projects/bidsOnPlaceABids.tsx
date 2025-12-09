import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { BidsOnPlaceABid } from 'src/sections/projects/placeABid/view-bids';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Bids - ${CONFIG.appName}`}</title>
      </Helmet>

      <BidsOnPlaceABid />
    </>
  );
}
