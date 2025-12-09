import { Helmet } from 'react-helmet-async';
 
import { CONFIG } from 'src/config-global';
import { WithdrawalView } from 'src/sections/withdrawal/view';
 
// ----------------------------------------------------------------------
 
export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`WithDrawal - ${CONFIG.appName}`}</title>
      </Helmet>
 
      <WithdrawalView/>
    </>
  );
}