import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { eventByIdFetch } from 'src/redux/actions/event.action';
import { AppDispatch, RootState } from 'src/redux/store';

import { FrontHome } from 'src/sections/front-home/view';

// ----------------------------------------------------------------------

export default function Page() {
  const dispatch = useDispatch<AppDispatch>();
  const { eventId } = useParams();
  const { _id, eventName, coverImage, description
  } = useSelector((state: RootState) => state?.event?.eventWithDetails);
  useEffect(() => {
    const fetchEvent = async () => {
      await dispatch(eventByIdFetch(eventId));
    };
    fetchEvent();
  }, [dispatch, eventId]);
  return (
    <>
      <Helmet>
        <title>{eventName ? `${eventName} | Tick-M Event` : "Loading Event..."}</title>

        <meta
          name="description"
          content={description?.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 150)}
        />

        {/* Canonical URL */}
        <link
          rel="canonical"
          href={`https://tick-m.cloud/our-event/${_id}`}
        />

        {/* OpenGraph for WhatsApp / Facebook */}
        <meta property="og:title" content={eventName} />
        <meta
          property="og:description"
          content={description?.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 150)}
        />
        <meta property="og:image" content={coverImage} />
        <meta
          property="og:url"
          content={`https://tick-m.cloud/our-event/${_id}`}
        />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={eventName} />
        <meta
          name="twitter:description"
          content={description?.replace(/<\/?[^>]+(>|$)/g, "").slice(0, 150)}
        />
        <meta name="twitter:image" content={coverImage} />
      </Helmet>

      <FrontHome />
    </>
  );
}
