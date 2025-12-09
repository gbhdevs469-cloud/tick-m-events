import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SearchAndSelectServiceProvidersView } from 'src/sections/search-&-select-service-providers/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Search & Select Service Providers - ${CONFIG.appName}`}</title>
      </Helmet>

      <SearchAndSelectServiceProvidersView />
    </>
  );
}
