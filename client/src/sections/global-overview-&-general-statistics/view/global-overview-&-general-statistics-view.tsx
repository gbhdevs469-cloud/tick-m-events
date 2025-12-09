import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from 'src/redux/store';
import { fetchDashboardActivity } from 'src/redux/actions/global-overview-general-statistice.action';

import { DashboardContent } from 'src/layouts/dashboard';
import { TopNavButtons } from '../TopNavButtons';
import GlobalStatistics from '../GlobalStatistics';
import PlatformStatistics from '../PlatformStatistics'
import { TicketingActivityTable } from '../TicketingActivityTable';
import { MarketplaceActivity } from '../MarketplaceActivity';


export function GlobalOverviewAndGeneralStatisticsView() {
  const [activeTab, setActiveTab] = useState('Global Statistics');
  const dispatch = useDispatch<AppDispatch>();
  const { dashboardData } = useSelector((state: RootState) => state?.gogs);
  
  useEffect(() => {
    dispatch(fetchDashboardActivity())
  }, [dispatch]);

  return (
    <DashboardContent>
      <TopNavButtons active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Global Statistics' && (
        <>
          <GlobalStatistics statistics={dashboardData} />
          <PlatformStatistics statistics={dashboardData} />
        </>
      )}

      {activeTab === 'Ticketing Activity' && (
        <>
          {/* <GlobalStatistics /> */}
          <TicketingActivityTable />
        </>
      )}

      {activeTab === 'Marketplace Activity' && (
        <>
          {/* <GlobalStatistics /> */}
          <MarketplaceActivity />
        </>
      )}

      {/* {activeTab === 'Alerts & Quick Actions' && (
        <>
          <GlobalStatistics />
          <AlertsSection />
        </>
      )} */}
    </DashboardContent>
  );
}
