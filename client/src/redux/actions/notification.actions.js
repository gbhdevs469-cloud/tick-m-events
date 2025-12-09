import axios from '../helper/axios';
import { notificationConstants } from './constants';
import { getToken, messaging } from '../../firebase';

export const sendUserNotification = (payload) => async (dispatch) => {
  try {
    dispatch({ type: notificationConstants.SEND_NOTIFICATION_REQUEST });

    const { data } = await axios.post('/promotion/send-user-notification', payload);

    dispatch({
      type: notificationConstants.SEND_NOTIFICATION_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: notificationConstants.SEND_NOTIFICATION_FAIL,
      payload: error.response?.data?.error || 'Notification failed',
    });
  }
};


export const saveUserFcmToken = (userId, email) => async (dispatch) => {
  try {
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
    });

    if (!token) {
      console.warn("❗ No FCM token received");
      return;
    }

    console.log("✅ FCM Token generated:", token);

    const { data } = await axios.post('/promotion/save-fcm-token', {
      userId,
      email,
      fcmToken: token,
    });

    console.log("✅ FCM token saved response:", JSON.stringify(data, null, 2));
    dispatch({
      type: notificationConstants.SAVE_FCM_TOKEN_SUCCESS,
      payload: data,
    });
  } catch (error) {
    console.error("❌ Error saving FCM token:", error?.response?.data || error.message);

    dispatch({
      type: notificationConstants.SAVE_FCM_TOKEN_FAIL,
      payload: error?.response?.data || error.message,
    });
  }
};


export const fetchUserNotifications = (email) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/promotion/notifications/user?email=${encodeURIComponent(email)}`);

    dispatch({
      type: notificationConstants.FETCH_NOTIFICATIONS_SUCCESS,
      payload: data.notifications,
    });
  } catch (error) {
    console.error("❌ Failed to fetch notifications", error);
  }
};


export const markNotificationRead = (notificationId) => async (dispatch) => {
  try {
    await axios.post('/promotion/mark-notification-read', { notificationId });
    dispatch({ type: 'MARK_NOTIFICATION_READ_SUCCESS', payload: notificationId });
  } catch (error) {
    console.error('Failed to mark notification read:', error);
  }
};