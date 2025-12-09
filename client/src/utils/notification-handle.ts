import { toast } from 'react-toastify';
import { useMemo, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../redux/store';
import { fetchUserNotifications, markNotificationRead } from '../redux/actions/notification.actions';

interface NotificationsHandlerProps {
  user: any; 
}

function NotificationsHandler({ user }: NotificationsHandlerProps) {
  const dispatch = useDispatch<AppDispatch>();
  const rawNotifications = useSelector((state: RootState) => state.notification.items);
const notifications = useMemo(
  () => (Array.isArray(rawNotifications) ? rawNotifications : []),
  [rawNotifications]
);
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserNotifications(user.email));
    }
  }, [user, dispatch]);

  // ✅ Display and mark notifications
  useEffect(() => {
    if (!Array.isArray(notifications)) {
      return;
    }

    notifications.forEach((notif) => {
      if (notif?.subject && notif?.message) {
        toast.info(`${notif.subject}: ${notif.message}`, {
          position: 'top-right',
          autoClose: 5000,
        });

        dispatch(markNotificationRead(notif._id));
      }
    });
  }, [notifications, dispatch]);

  return null; 
}

export default NotificationsHandler;
