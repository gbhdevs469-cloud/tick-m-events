import { DashboardContent } from 'src/layouts/dashboard';
import { PageTitleSection } from 'src/components/page-title-section';
import { WithdrawalTableCard } from '../WithdrawalTableCard';

export function WithdrawalView() {
  return (
    <DashboardContent>
      <PageTitleSection title="Withdrawals" />
      <WithdrawalTableCard />
    </DashboardContent>
  );
}
