import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';
import { PromotionLogos } from 'src/sections/customization/promotion-logos';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Customization - ${CONFIG.appName}`}</title>
      </Helmet>

      <PromotionLogos />
    </>
  );
}
