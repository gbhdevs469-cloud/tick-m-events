import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ListPlaceABid } from 'src/sections/projects/placeABid/list';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`List - ${CONFIG.appName}`}</title>
      </Helmet>

      <ListPlaceABid />
    </>
  );
}
