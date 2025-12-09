import { useEffect, useState } from 'react';
import { Box } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';

import { DashboardContent } from 'src/layouts/dashboard';
import { ticketTrnasFetch, verifyTrnasFetch } from 'src/redux/actions/admin/ticket-trans-supervision';
import { AppDispatch } from 'src/redux/store';

import EventManagementTable from '../EventManagementTable';
import { PaymentMonitoringTable } from '../PaymentMonitoringTable';
import { InfoCard } from '../InfoCard';
import { TicketingStatistics } from '../ticketing-statistics';


export function TicketingAndTransactionsSupervisionView() {
  const [activeTab, setActiveTab] = useState('Approve Event');
  const dispatch = useDispatch<AppDispatch>();
  const { payments, ticketTrnsSup } = useSelector((state: any) => state.admin);

  useEffect(() => {
    dispatch(verifyTrnasFetch());
    dispatch(ticketTrnasFetch());
  }, [dispatch]);

  return (
    <DashboardContent>
      <TicketingStatistics statistics={ticketTrnsSup}/>
      {/* Pass props to InfoCard for tab state */}
      <InfoCard activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Show content based on tab */}
      {activeTab === 'Approve Event' && (
        <Box mt={3}>
          <EventManagementTable />
        </Box>
      )}

      {activeTab === 'Verify Transaction' && (
        <>
          <Box mt={3}>
            <PaymentMonitoringTable data={payments} />
          </Box>

        </>
      )}
    </DashboardContent>
  );
}
