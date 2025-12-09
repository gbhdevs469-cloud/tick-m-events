import { searchSelectProviderConstants } from "../actions/constants";

const initialState = {
  providersList: [],
  serviceCate: [],
  error: null,
  message: '',
};

const searchSelectReducer = (state, action) => {
  if (state === undefined) {
    state = initialState; // Assign initial state here
  }
  switch (action.type) {
    case searchSelectProviderConstants.GET_CATEGORY_REQUEST:
      return { ...state };

    case searchSelectProviderConstants.GET_CATEGORY_SUCCESS:
      return {
        ...state,
        serviceCate: action.payload.serviceCate,
      };

    case searchSelectProviderConstants.GET_CATEGORY_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        message: action.payload.message,
      };

    case searchSelectProviderConstants.GET_REQUEST:
      return { ...state };

    case searchSelectProviderConstants.GET_SUCCESS:
      return {
        ...state,
        providersList: action.payload.providers,
        message: action.payload.message,
      };

    case searchSelectProviderConstants.GET_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        message: action.payload.message,
      };

    default:
      return state; // Always return a valid state
  }
};


export default searchSelectReducer;
