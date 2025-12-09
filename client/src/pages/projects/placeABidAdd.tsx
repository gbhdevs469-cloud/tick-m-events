import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AddPlaceABid } from 'src/sections/projects/placeABid/Add';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Add - ${CONFIG.appName}`}</title>
      </Helmet>

      <AddPlaceABid />
    </>
  );
}
