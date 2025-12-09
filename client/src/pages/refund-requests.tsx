import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { RefundReq } from 'src/sections/RefundRequest/refundReq';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Refunds List - ${CONFIG.appName}`}</title>
      </Helmet>

      <RefundReq />
    </>
  );
}
