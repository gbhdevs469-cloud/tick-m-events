import { Helmet } from 'react-helmet-async';
import { ChatPanel } from 'src/components/chat/conv';
import { CONFIG } from 'src/config-global';
import { DashboardContent } from 'src/layouts/dashboard';
// ----------------------------------------------------------------------

export default function Page() {
    return (
        <>
            <Helmet>
                <title> {`Chat - ${CONFIG.appName}`}</title>
            </Helmet>
            <DashboardContent>
                <ChatPanel />
            </DashboardContent>
        </>
    );
}
