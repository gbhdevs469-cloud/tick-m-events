import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { TransactionAndPaymentManagementView } from 'src/sections/transaction-&-payment-management/view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Transaction & Payment Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <TransactionAndPaymentManagementView />
    </>
  );
}
