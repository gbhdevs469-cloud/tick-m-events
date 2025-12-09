import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PaymentSuccess } from 'src/sections/payment-success';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Success - ${CONFIG.appName}`}</title>
      </Helmet>

      <PaymentSuccess />
    </>
  );
}
