import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { SignedProjectList } from 'src/sections/projects/placeABid/signed-project-list';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Awarded Projects - ${CONFIG.appName}`}</title>
      </Helmet>

      <SignedProjectList />
    </>
  );
}
