import { Helmet } from 'react-helmet-async';
 
import { CONFIG } from 'src/config-global';
import { ProviderProfile } from 'src/sections/profile-&-services-management/single-profile';

 
 
 
export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Provider Profile - ${CONFIG.appName}`}</title>
            </Helmet>
            <ProviderProfile />
        </>
    );
}