import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Profile } from 'src/sections/paritcipant/profile/profile';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Profile - ${CONFIG.appName}`}</title>
      </Helmet>

      <Profile />
    </>
  );
}
