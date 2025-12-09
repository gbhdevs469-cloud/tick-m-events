import { reminderConstants } from "../actions/constants";

const initialState = {
  loading: false,
  notifications: [],
  error: null,
  message: null,
};

export default function reminderReducer(state, action) {
  if (state === undefined) {
    state = initialState;
  }
  switch (action.type) {
    case reminderConstants.SAVE_REQUEST:
    case reminderConstants.NOTIFICATIONS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        message: null,
      };

    case reminderConstants.SAVE_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload?.message || 'Saved successfully',
        error: null,
      };

    case reminderConstants.NOTIFICATIONS_SUCCESS:
      return {
        ...state,
        loading: false,
        notifications: action.payload || [],
        error: null,
      };

    case reminderConstants.SAVE_FAILURE:
    case reminderConstants.NOTIFICATIONS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload || 'Something went wrong',
      };

    case reminderConstants.MARK_ALL_READ_REQUEST:
      return {
        ...state,
        loading: true,
      };

    case reminderConstants.MARK_ALL_READ_SUCCESS:
      return {
        ...state,
        loading: false,
        // Mark all notifications as read in local state
        notifications: state.notifications.map((notif) => ({
          ...notif,
          isUnRead: false,
        })),
      };

    case reminderConstants.MARK_ALL_READ_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
}
