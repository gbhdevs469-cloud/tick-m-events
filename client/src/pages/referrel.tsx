import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { Referral } from 'src/sections/referral';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Referral - ${CONFIG.appName}`}</title>
      </Helmet>

      <Referral />
    </>
  );
}
