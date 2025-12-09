import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';

import 'src/global.css';

import { Router } from 'src/routes/sections';
import { useScrollToTop } from 'src/hooks/use-scroll-to-top';
import { ThemeProvider } from 'src/theme/theme-provider';
import { eventFetch, todayEventFetch, wishlistEventFetch } from './redux/actions/event.action';
import { AppDispatch, RootState } from './redux/store';
import { eventOrderFetch } from './redux/actions/eventOrder';
import { recommTrandingPopularEventFetch } from './redux/actions/home-recommendation.action';
import NotificationsHandler from './utils/notification-handle';
import { getPromotionLogo } from './redux/actions/customization/promotion-logo';
import { statisticsPerformanceFetch } from './redux/actions/provider/statisticsAndPerformance';
import { getReservationContracts } from './redux/actions/provider/reservation-contract';

export default function App() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state?.auth);

  useScrollToTop();
  useEffect(() => {
    dispatch(getReservationContracts());
    dispatch(wishlistEventFetch())
    dispatch(eventFetch());
    dispatch(todayEventFetch());
    dispatch(getPromotionLogo())
    dispatch(recommTrandingPopularEventFetch());
    if (user.role === "provider") {
      dispatch(statisticsPerformanceFetch());
    }

  }, [dispatch,user.role]);

  useEffect(() => {
    const channel = new BroadcastChannel('fcm-messages');

    let lastNotificationId: string | null = null;

    channel.onmessage = (event) => {
      const payload = event.data?.payload;
      if (!user?._id || !user?.email) {
        return;
      }

      const title = payload?.data?.title || 'Notification';
      const body = payload?.data?.body || 'You have a new message';
      const notificationId = payload?.data?.eventId || payload?.data?.title; // Use a unique field

      // Ignore if it's the same as last one
      if (lastNotificationId === notificationId) {
        return;
      }

      // Parse target emails
      let targetEmails: string[] = [];
      try {
        if (typeof payload?.data?.emails === 'string') {
          targetEmails = payload.data.emails.split(',').map((e: string) => e.trim().toLowerCase());
        }
      } catch (e) {
        console.error('Failed to parse emails:', e);
      }

      const normalizedEmails = targetEmails.map((email: string) => email.toLowerCase().trim());
      const normalizedUserEmail = user.email.toLowerCase().trim();

      if (normalizedEmails.includes(normalizedUserEmail)) {
        lastNotificationId = notificationId; // Store latest one
        toast.info(`${title}: ${body}`, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    };

    return () => {
      channel.close();
    };
  }, [user]);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/firebase-messaging-sw.js')
    }
  }, []);

  return (
    <ThemeProvider>
      <Router />
      <ToastContainer />
      {user && <NotificationsHandler user={user} />}
    </ThemeProvider>
  );
}
