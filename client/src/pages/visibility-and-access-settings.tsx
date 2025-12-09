import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { VisibilityAndAccessSettingsView } from 'src/sections/visibility-and-access-settings/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Visibility & Access Settings - ${CONFIG.appName}`}</title>
      </Helmet>

      <VisibilityAndAccessSettingsView />
    </>
  );
}
