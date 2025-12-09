import { activityConstants } from "../actions/constants";

const initialState = {
  loading: false,
  activities: [],
  error: null,
  pagination: {}, 
};

export const activityReducer = (state, action) => {
  if (state === undefined) {
    state = initialState; // Assign initial state here
  }

  switch (action.type) {
    case activityConstants.FETCH_ACTIVITIES_REQUEST:
      return { ...state, loading: true };

    case activityConstants.FETCH_ACTIVITIES_SUCCESS:
      return { ...state, loading: false, activities: action.payload };

    case activityConstants.FETCH_ACTIVITIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    //
    case activityConstants.FETCH_ADMIN_ACTIVITIES_REQUEST:
      return { ...state, loading: true, error: null };

    case activityConstants.FETCH_ADMIN_ACTIVITIES_SUCCESS:
      return {
        ...state,
        loading: false,
        activities: action.payload.activities || action.payload.docs || action.payload, 
        pagination: action.payload.pagination || action.payload, 
        error: null,
      };

    case activityConstants.FETCH_ADMIN_ACTIVITIES_FAILURE:
      return { ...state, loading: false, error: action.payload };
    default:
      return state; // Always return a valid state
  }
};


