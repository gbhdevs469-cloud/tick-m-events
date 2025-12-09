import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ReservationsAndContractsView } from 'src/sections/reservations-and-contracts/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Reservations & Contracts - ${CONFIG.appName}`}</title>
      </Helmet>

      <ReservationsAndContractsView />
    </>
  );
}
