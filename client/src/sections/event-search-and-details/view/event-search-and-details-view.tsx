import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/redux/store';

import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';
import { FindYourEvent } from '../find-your-event';
import { MusicFestival } from '../music-festival';
import { EventShare } from '../event-share';
import { DiscoverEvent } from '../discover-event';

export function EventSearchAndDetailsView() {
  const [selectedEvent, setSelectedEvent] = useState({}); // Toggle for edit mode
  const handleEventDetails = useCallback((selectedViewEvent: any) => {
    setSelectedEvent(selectedViewEvent?.selectedViewEvent)
  }, [])
  const { upcomingEvents } = useSelector((state: RootState) => state?.homeRecom);

  return (
    <DashboardContent>
      <PageTitleSection title="Discover Events" />

      <DiscoverEvent list={upcomingEvents} />

      <FindYourEvent handleEventDetails={handleEventDetails} />

      {
        Object.keys(selectedEvent).length === 0 ? null : <MusicFestival selectedEvent={selectedEvent} />
      }

      {
        Object.keys(selectedEvent).length === 0 ? null : <EventShare selectedEvent={selectedEvent} />
      }
    </DashboardContent>
  );
}
