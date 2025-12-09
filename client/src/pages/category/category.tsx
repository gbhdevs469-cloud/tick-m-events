import { Helmet } from 'react-helmet-async';
import { useSelector } from 'react-redux';

import { CONFIG } from 'src/config-global';
import { RootState } from 'src/redux/store';
import { AllCategoriesView } from 'src/sections/category/all-category/all-category';

// ----------------------------------------------------------------------

export default function Page() {
  
  return (
    <>
      <Helmet>
        <title> {`Categories - ${CONFIG.appName}`}</title>
      </Helmet>

      <AllCategoriesView />
    </>
  );
}
