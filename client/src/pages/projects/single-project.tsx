import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import ProjectSinglePage from 'src/sections/projects/projects-single-page';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`project - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProjectSinglePage />
    </>
  );
}
