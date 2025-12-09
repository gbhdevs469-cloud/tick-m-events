import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { GlobalHome } from 'src/sections/global-home';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Tick-M Cloud | Discover & Book Eventsss</title>
        <meta
          name="description"
          content="Find events, book tickets, explore service providers on Tick-M Cloud."
        />
        <meta property="og:title" content="Tick-M Cloud" />
        <meta
          property="og:description"
          content="Discover unforgettable events across Africa. Book easily."
        />
        <meta property="og:image" content="https://tick-m.cloud/banner.png" />
        <meta property="og:type" content="website" />
      </Helmet>

      <GlobalHome />
    </>
  );
}
