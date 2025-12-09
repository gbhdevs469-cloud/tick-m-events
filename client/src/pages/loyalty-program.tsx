import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { LoyaltyProgramView } from 'src/sections/loyalty-program/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Loyalty Program - ${CONFIG.appName}`}</title>
      </Helmet>

      <LoyaltyProgramView />
    </>
  );
}
