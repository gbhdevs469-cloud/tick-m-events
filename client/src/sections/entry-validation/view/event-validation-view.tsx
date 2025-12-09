import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DashboardContent } from "src/layouts/dashboard";
import { PageTitleSection } from "src/components/page-title-section";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";
import { AppDispatch, RootState } from "src/redux/store";

import { TicketScanner } from "../ticket-scanner";
import { EnterTicketCode } from "../enter-ticket-code";
import { EntryListView } from "../entry-list-view";
import { RealTimeStatistics } from "../real-time-statistics";
import { EventBreadCrum } from "../event-status";

export interface ValidationOptions {
  selectedView: 'scan' | 'list';
  listViewMethods: ListViewMethod[];
}

export type ListViewMethod = 'manualCode' | 'nameList' | 'accountId';

export interface Event {
  _id: string;
  eventName: string;
  date?: string;
  time?: string;
  category?: string;
  eventType?: string;
  validationOptions?: ValidationOptions;
  statistics?: any
  // Add other event properties as needed
}

export function EventValidationView() {
  const { __events } = useSelector((state: RootState) => state?.organizer);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [view, setView] = useState<'scan' | 'list'>('scan'); // Make type specific

  useEffect(() => {
    dispatch(fatchOrgEvents());
  }, [dispatch]);
  const handleEventSelect = (event: Event | null) => {
    setSelectedEvent(event);
    // Set the view based on the event's validationOptions if they exist
    if (event?.validationOptions?.selectedView) {
      setView(event.validationOptions.selectedView);
    }
  };

  return (
    <>
      <EventBreadCrum
        _selectEve={selectedEvent}
        events={__events}
        view={view}
        onEventSelect={handleEventSelect}
        setView={setView}
      />

      <DashboardContent>

        <PageTitleSection
          title="Entry Validation (QR Code Scan)"
        />
        {
          view === 'scan' ?
            <TicketScanner _selectEve={selectedEvent} /> :
            <EnterTicketCode
              _selectEve={selectedEvent?.validationOptions}
              eventSelected={selectedEvent}
            />
        }

        <EntryListView _selectEve={selectedEvent} />

        <RealTimeStatistics statistics={selectedEvent?.statistics} />
      </DashboardContent>
    </>
  );
}