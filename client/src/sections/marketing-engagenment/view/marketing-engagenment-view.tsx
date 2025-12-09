import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { EventBreadCrum } from 'src/sections/entry-validation/event-status';
import { PageTitleSection } from 'src/components/page-title-section';
import { DashboardContent } from 'src/layouts/dashboard';

import { promotionGet, promotionEvents } from 'src/redux/actions';
import { AppDispatch, RootState } from 'src/redux/store';

import { PromotionsAndOffers } from '../promotion-&-offer';
import { ActivePromotion } from '../active-promotion';
import { NotificationAndReminder } from '../notification-&-reminder';
import { SocialMediaSharing } from '../social-media-sharing';
import { MarketingPerformance } from '../marketing-performance';

export function MarketingEngagenmentView() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventsWithOrdersAndParticiapnt } = useSelector(
    (state: RootState) => state?.promotionList
  );

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    dispatch(promotionGet());
    dispatch(promotionEvents());
  }, [dispatch]);

  const handleEventSelect = (event: Event | null) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <EventBreadCrum events={eventsWithOrdersAndParticiapnt} onEventSelect={handleEventSelect} />

      <DashboardContent>
        <PageTitleSection title="Marketing & Engagement" />

        <ActivePromotion selEvent={selectedEvent} />
        <PromotionsAndOffers selEvent={selectedEvent} />

        <NotificationAndReminder selEvent={selectedEvent} />
        <SocialMediaSharing selEvent={selectedEvent} />
        {/* <MarketingPerformance /> */}
      </DashboardContent>
    </>

  );
}
