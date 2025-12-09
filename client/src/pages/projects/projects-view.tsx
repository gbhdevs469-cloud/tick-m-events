import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { ProjectsList } from 'src/sections/projects/projects-list';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`projects-list - ${CONFIG.appName}`}</title>
      </Helmet>

      <ProjectsList />
    </>
  );
}
