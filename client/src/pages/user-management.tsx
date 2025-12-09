import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { UserManagementView } from 'src/sections/user-management/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`User Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserManagementView />
    </>
  );
}
