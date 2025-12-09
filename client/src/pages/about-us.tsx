import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { AboutUs } from 'src/sections/about-us';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title>About Us | Tick-M Cloud</title>

        <meta
          name="description"
          content="Learn about Tick-M Cloud — the modern platform revolutionizing event management, ticketing, and experiences across Africa and beyond. Discover our mission and story."
        />

        <link rel="canonical" href="https://tick-m.cloud/about-us" />

        {/* OpenGraph for FB / WhatsApp */}
        <meta property="og:title" content="About Us | Tick-M Cloud" />
        <meta property="og:description" content="Discover how Tick-M Cloud is transforming how events are organized and experienced across Africa." />
        <meta property="og:image" content="https://tick-m.cloud/assets/background/about-hero.jpg" />
        <meta property="og:url" content="https://tick-m.cloud/about-us" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Tick-M Cloud" />
        <meta name="twitter:description" content="Discover how Tick-M Cloud is transforming how events are organized and experienced across Africa." />
        <meta name="twitter:image" content="https://tick-m.cloud/assets/background/about-hero.jpg" />
      </Helmet>

      <AboutUs />
    </>
  );
}
