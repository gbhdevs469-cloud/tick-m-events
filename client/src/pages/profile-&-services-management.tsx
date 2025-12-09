import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { ProfileAndServicesManagementView } from 'src/sections/profile-&-services-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Profile & Services Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProfileAndServicesManagementView />
    </>
  );
}
