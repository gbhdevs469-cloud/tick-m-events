import { Helmet } from 'react-helmet-async';

import { CONFIG } from 'src/config-global';

import { MessagingAndClientRelationshipView } from 'src/sections/messaging-&-client-relationship/view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Messaging & Client Relationship - ${CONFIG.appName}`}</title>
      </Helmet>

      <MessagingAndClientRelationshipView />
    </>
  );
}
