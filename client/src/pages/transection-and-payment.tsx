import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { TransectionAndPaymentView } from 'src/sections/transection-and-payment/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transection & Payment - ${CONFIG.appName}`}</title>
      </Helmet>

      <TransectionAndPaymentView />
    </>
  );
}
