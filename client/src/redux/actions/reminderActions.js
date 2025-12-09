import { reminderConstants } from './constants';
import axios from '../helper/axios';

export const saveReminderSettings = (data) => async (dispatch) => {
    dispatch({ type: reminderConstants.SAVE_REQUEST });

    try {
        const response = await axios.post("/reminder", data);

        dispatch({
            type: reminderConstants.SAVE_SUCCESS,
            payload: { message: response?.data?.message },
        });

        return {
            type: reminderConstants.SAVE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: reminderConstants.SAVE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: reminderConstants.SAVE_FAILURE,
            status: error.status,
            message: error?.response?.data?.message || "Server error"
        };
    }
};

export const saveNotiicationReminderSettings = (eventId, reminders) => async (dispatch) => {
    dispatch({ type: reminderConstants.SAVE_REQUEST });

    try {
        const response = await axios.put(`/event-reminder/${eventId}`, { reminders });

        dispatch({
            type: reminderConstants.SAVE_SUCCESS,
            payload: response.data.data, // optional
        });

        return {
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };
    } catch (error) {
        dispatch({
            type: reminderConstants.SAVE_FAILURE,
            payload: error?.response?.data?.message || "Failed to save reminder settings",
        });

        return {
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Failed to save reminder settings",
        };
    }
};

export const getAllNotifications = () => async (dispatch) => {
  dispatch({ type: reminderConstants.NOTIFICATIONS_REQUEST });

  try {
    const response = await axios.get('/event-reminder/notifications');

    dispatch({
      type: reminderConstants.NOTIFICATIONS_SUCCESS,
      payload: response.data.data,
    });

    return {
      status: response.status,
      payload: response.data.data,
    };
  } catch (error) {
    dispatch({
      type: reminderConstants.NOTIFICATIONS_FAILURE,
      payload: error?.response?.data?.message || 'Failed to load notifications',
    });

    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || 'Failed to load notifications',
    };
  }
};

export const markAllRead = () => async (dispatch) => {
  dispatch({ type: reminderConstants.MARK_ALL_READ_REQUEST });

  try {
    const response = await axios.put('/event-reminder/notifications/mark-all-read');

    dispatch({
      type: reminderConstants.MARK_ALL_READ_SUCCESS,
      payload: { message: response.data.message },
    });

    // Optionally, fetch updated notifications or update state here

    return {
      status: response.status,
      message: response.data.message,
    };
  } catch (error) {
    dispatch({
      type: reminderConstants.MARK_ALL_READ_FAILURE,
      payload: error?.response?.data?.message || 'Failed to mark notifications as read',
    });

    return {
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || 'Failed to mark notifications as read',
    };
  }
};