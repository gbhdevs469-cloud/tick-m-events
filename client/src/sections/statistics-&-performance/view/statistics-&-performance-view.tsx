import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { statisticsPerformanceFetch } from 'src/redux/actions/provider/statisticsAndPerformance';
import { AppDispatch, RootState } from 'src/redux/store';

import { TopNavButtons } from '../TopNavButtons';
import ProviderStats from '../ProviderStats';
import RevenueStats from '../RevenueStats';
import DashboardSummary from '../DashboardSummary';
import { FinancialAnalysisRevenue } from '../FinancialAnalysisRevenue';
import { CustomerSatisfactionReviews } from '../CustomerSatisfactionReviews';
import RecommendationCard from '../RecommendationCard';


export function StatisticsAndPerformanceView() {
  const [activeTab, setActiveTab] = useState('Performance Summary');
  const dispatch = useDispatch<AppDispatch>();
  const { statistics } = useSelector((state: RootState) => state?.provider);
  
  useEffect(() => {
    dispatch(statisticsPerformanceFetch());
  }, [dispatch]);

  return (
    <DashboardContent>
      <PageTitleSection title="Statistics & Performance" />
      <TopNavButtons active={activeTab} onChange={setActiveTab} />

      {activeTab === 'Performance Summary' && (
        <>
          <ProviderStats
            contractObtained={statistics?.gigs?.completedProjects}
            revenueGenerated={statistics?.revenue?.total}
            customerRatings={statistics?.ratings?.average}
          />
          <RevenueStats
            monthlyRevenueGrowth={statistics?.revenue?.monthlyRevenueGrowth || []}
            revenueBreakdown={statistics?.revenue?.revenueBreakdown}
            dailyPercentageChange={statistics?.revenue?.dailyPercentageChange}
          />
          <DashboardSummary
            performanceTrend={statistics?.revenue?.performanceTrend}
            offerConversionRate={statistics?.conversion?.offerConversionRate}
          />
        </>
      )}

      {activeTab === 'Financial Analysis' &&
        <FinancialAnalysisRevenue
          financialAnalytics={statistics?.financialAnalytics || {}}
        />}

      {activeTab === 'Client Feedback' && <CustomerSatisfactionReviews />}

      {activeTab === 'Recommendations' && <RecommendationCard />}
    </DashboardContent>
  );
}