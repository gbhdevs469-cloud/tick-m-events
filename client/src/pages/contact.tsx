import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { Contact } from 'src/sections/contact/view';


// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title>Contact Us | Tick-M Cloud</title>

                <meta
                    name="description"
                    content="Need help or have questions? Contact Tick-M Cloud for support, partnership, or general inquiries. We're here to assist you."
                />

                <link rel="canonical" href="https://tick-m.cloud/contact" />

                {/* OpenGraph for Facebook / WhatsApp */}
                <meta property="og:title" content="Contact Us | Tick-M Cloud" />
                <meta property="og:description" content="Reach out to Tick-M Cloud for support, business inquiries, or assistance. We're here to help!" />
                <meta property="og:image" content="https://tick-m.cloud/assets/background/about-hero.jpg" />
                <meta property="og:url" content="https://tick-m.cloud/contact" />
                <meta property="og:type" content="website" />

                {/* Twitter */}
                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:title" content="Contact Us | Tick-M Cloud" />
                <meta name="twitter:description" content="Reach out to Tick-M Cloud for support, business inquiries, or assistance." />
                <meta name="twitter:image" content="https://tick-m.cloud/assets/background/about-hero.jpg" />
            </Helmet>
            <Contact />

        </>
    );
}