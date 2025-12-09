import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { DashboardContent } from "src/layouts/dashboard";
import { PageTitleSection } from "src/components/page-title-section";
import { EventBreadCrum } from "src/sections/entry-validation/event-status";
import { fatchOrgEvents } from "src/redux/actions/organizer/pageEvents";
import type { AppDispatch, RootState } from "src/redux/store";

import { CustomPhotoVideoFilter } from "../custom-photo-video-filter";
import { EventCustomization } from "../event-page-customization";
import { VisibilityType } from "../visibility-type";

interface EventVisibility {
  _id: string;
  eventId: string;
  visibilityType: 'public' | 'private' | 'unlisted';
  customUrl?: string;
  promotionAndHighlight: {
    homepageHighlighting: boolean;
    autoShareOnSocialMedia: boolean;
  };
  status: 'draft' | 'publish' | 'archived';
}

interface Event {
  _id: string;
  eventName: string;
  date: string;
  time: string;
  category: string;
  eventType: 'Public' | 'Private';
  visibility: EventVisibility;
  coverImage: {
    public_id: string;
    url: string;
  };
  urlSlug:string;
  portraitImage: {
    public_id: string;
    url: string;
  };
  customization: any

}
export function VisibilityAndAccessSettingsView() {
  const { __events } = useSelector((state: RootState) => state.organizer);
  const dispatch = useDispatch<AppDispatch>();
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  useEffect(() => {
    dispatch(fatchOrgEvents());
  }, [dispatch]);

  const handleEventSelect = (event: Event | null) => {
    setSelectedEvent(event);
  };

  return (
    <>
      <EventBreadCrum events={__events} onEventSelect={handleEventSelect} />

      <DashboardContent>

        <PageTitleSection
          title="Visibility And Access Settings"
        />
        <VisibilityType eventId={selectedEvent?.urlSlug} visibility={selectedEvent?.visibility} />

        <EventCustomization eventId={selectedEvent?._id} />

        <CustomPhotoVideoFilter __events={selectedEvent} />

      </DashboardContent>
    </>
  )

}