import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { CustomPhotoAndVideoFiltersforEventsView } from 'src/sections/custom-photo-or-video-filters-for-events/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Custom Photo/Video Filters for Events - ${CONFIG.appName}`}</title>
      </Helmet>

      <CustomPhotoAndVideoFiltersforEventsView />
    </>
  );
}
