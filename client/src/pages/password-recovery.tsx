import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { PasswordRecoveryView } from 'src/sections/password-recovery/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Password Recovery - ${CONFIG.appName}`}</title>
      </Helmet>

      <PasswordRecoveryView />
    </>
  );
}
