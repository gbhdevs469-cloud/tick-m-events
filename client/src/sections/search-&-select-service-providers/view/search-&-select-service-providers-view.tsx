import { useEffect, useState } from 'react';
import { Box } from "@mui/material";
import { useDispatch, useSelector } from 'react-redux';

import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { TabButton } from 'src/components/button/multiple-button';
import { AppDispatch, RootState } from 'src/redux/store';
import { providersListFetch, updateProfileViews } from 'src/redux/actions/searchSelect';
import { fatchOrgEvents, fatchOrgPlaceABids } from 'src/redux/actions/organizer/pageEvents';
import { EventBreadCrum } from 'src/sections/entry-validation/event-status';
import { eventFetch } from 'src/redux/actions/event.action';
import { getAccepedByProiver, getRequestsByOrganizer, getRequestsByProvider } from 'src/redux/actions/service-request';
import { ProviderOrganizerInfoModal } from 'src/components/modal/provider-orgnizer-info-modal';

import { SearchAndAdvanceFilter } from '../SearchAndAdvanceFilter';
import ProviderCardList from '../ProviderCardList';
import { ProposalsCard } from '../ProposalsList';
import RequestService from '../RequestService';


export function SearchAndSelectServiceProvidersView() {
  const { providersList } = useSelector((state: RootState) => state?.providers);
     const {
          totalRequests = [],
      } = useSelector((state: RootState) => state?.serviceRequest || {});
  const [select, setSelected] = useState<any>({})

  const { __events } = useSelector((state: RootState) => state.organizer);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filtersApplied, setFiltersApplied] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const [tabValue, setTabValue] = useState(0);
  const tabLabels = ["Global Search", "List of Providers", "Proposals", "Requested Sevice"];
  const [offerList, setOfferList] = useState({})
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);

  const handleSelct = async (row: any) => {
    setSelected(row)
    setOfferList(row)
    await dispatch(updateProfileViews(row?._id))
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    // For all tabs except 0→1 transition, just set the tab value
    if (!(tabValue === 0 && newValue === 1)) {
      setTabValue(newValue);
      return;
    }

    // Only for 0→1 transition, check if filters are applied
    if (filtersApplied && providersList?.length) {
      setTabValue(newValue);
    } else {
      // Optional: Show feedback that filters need to be applied first
      console.log("Please apply filters first");
    }
  };

  const handleFiltersApplied = () => {
    setFiltersApplied(true);
    // Only auto-switch if we're currently on tab 0
    if (tabValue === 0) {
      setTabValue(1);
    }
  };

  useEffect(() => {
    dispatch(getRequestsByProvider());
  }, [dispatch]);

  useEffect(() => {
    dispatch(providersListFetch())
    dispatch(eventFetch());
    dispatch(getAccepedByProiver());

  }, [dispatch, providersList])

  useEffect(() => {
    if (tabValue === 3) {
      dispatch(getRequestsByOrganizer());
    }
  }, [dispatch, tabValue]);

  // Add this effect to watch for changes in the select state
  useEffect(() => {
    if (select && Object.keys(select).length > 0) {
      setIsModalOpen(true);
    }
  }, [select]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelected({}); // Reset the selected provider
  };

  useEffect(() => {
    dispatch(fatchOrgPlaceABids(selectedEvent?._id))
    dispatch(fatchOrgEvents());
  }, [dispatch, selectedEvent]);

  const handleEventSelect = (event: Event | null) => {
    setSelectedEvent(event);
  };

  
  return (
    <>
      <EventBreadCrum events={__events} onEventSelect={handleEventSelect} />

      <DashboardContent>

        <PageTitleSection title="Search & Select Service Providers" />

        <Box display='flex' justifyContent='center'>
          <TabButton
            providersList={providersList}
            tabValue={tabValue}
            tabLabels={tabLabels}
            onChange={handleTabChange}
            filtersApplied={filtersApplied}
          />
        </Box>


        {tabValue === 0 && (
          <SearchAndAdvanceFilter
            onChange={handleTabChange}
            onFiltersApplied={handleFiltersApplied}
          />
        )}
        {tabValue === 1 && (
          <ProviderCardList handleSelct={handleSelct} providersList={providersList} />
        )}
        {tabValue === 2 && (
          <ProposalsCard proposals={selectedEvent?.eventRequests} />
        )}
        {tabValue === 3 && (
          <RequestService requests={totalRequests} />
        )}

        <ProviderOrganizerInfoModal
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          select={select}
          selectedEvent={selectedEvent}
        />
      </DashboardContent>
    </>

  );
}