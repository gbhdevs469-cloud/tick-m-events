import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { EventList } from 'src/sections/events-list/index';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>Tick m Cloud – Discover Amazing Events Near You</title>
        <meta
          name="description"
          content="Find public, private, online, and live events across Africa. Book tickets, explore categories, and join thousands using Tick-M Cloud."
        />

        <meta property="og:title" content="Tickm Events" />
        <meta property="og:description" content="Discover events, book tickets, and explore experiences easily with Tickm Events." />
        <meta property="og:image" content="https://tick-m.cloud/seo/home-cover.jpg" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tick-m.cloud" />

        <meta name="twitter:title" content="Tickm Events" />
        <meta name="twitter:description" content="Find the best events and book tickets online." />
        <meta name="twitter:image" content="https://tick-m.cloud/seo/home-cover.jpg" />
        <meta name="twitter:card" content="summary_large_image" />

        <link rel="canonical" href="https://tick-m.cloud" />
      </Helmet>

      <EventList />
    </>
  );
}
