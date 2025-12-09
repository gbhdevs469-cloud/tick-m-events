
import { notificationConstants } from '../actions/constants';

const initialState = {
  loading: false,
  success: false,
  error: null,
  data: null,
  items: [], // notifications array
};

export const notificationReducer = (state, action) => {
  if (state === undefined) {
    state = initialState; // Assign initial state here
  }
  switch (action.type) {
    case notificationConstants.SEND_NOTIFICATION_REQUEST:
    case notificationConstants.SAVE_FCM_TOKEN_REQUEST:
    case notificationConstants.FETCH_NOTIFICATIONS_REQUEST:
    case notificationConstants.MARK_NOTIFICATION_READ_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };

    case notificationConstants.SEND_NOTIFICATION_SUCCESS:
    case notificationConstants.SAVE_FCM_TOKEN_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        data: action.payload,
      };

    case notificationConstants.FETCH_NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        items: action.payload,
      };

    case notificationConstants.MARK_NOTIFICATION_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        success: true,
        items: state.items.filter((notif) => notif._id !== action.payload), // remove read notif
      };

    case notificationConstants.SEND_NOTIFICATION_FAIL:
    case notificationConstants.SAVE_FCM_TOKEN_FAIL:
    case notificationConstants.FETCH_NOTIFICATIONS_FAIL:
    case notificationConstants.MARK_NOTIFICATION_READ_FAIL:
      return {
        ...state,
        loading: false,
        success: false,
        error: action.payload,
      };

    default:
      return state;
  }
};
