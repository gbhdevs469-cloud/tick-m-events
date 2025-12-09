import { Typography } from '@mui/material';
import { Helmet } from 'react-helmet-async';
 
import { CONFIG } from 'src/config-global';
import { SocialShare } from 'src/sections/social-share';

 
 
// ----------------------------------------------------------------------
 
export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Social-share - ${CONFIG.appName}`}</title>
            </Helmet>
            <SocialShare />
        </>
    );
}