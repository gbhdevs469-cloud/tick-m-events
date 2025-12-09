import { useState } from 'react';
import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { TopNavButtons } from '../TopNavButtons';
import { OverviewTableCard } from '../OverviewTableCard';
import { KycDocumentTableCard } from '../KycDocumentTableCard';
import UserActivityCard from '../UserActivityCard';

export function UserManagementView() {
  const [activeTab, setActiveTab] = useState('User List');

  return (
    <DashboardContent>
      <PageTitleSection />
      <TopNavButtons active={activeTab} onChange={setActiveTab} />

      {activeTab === 'User List' && (
        <>
          <OverviewTableCard />
        </>
      )}

      {activeTab === 'KYC Verification' && (
        <KycDocumentTableCard />
      )}

      {activeTab === 'Activity History' && (
        <UserActivityCard />
      )}
    </DashboardContent>
  );
}