import { serviceReqConstants, serviceRequestConstants } from "../actions/constants";
 
const initialState = {
  message: '',
  categories: [],
  loading: false,
  orgLoading: false,
  orgError: null,
  organizerRequests: [],
};
 
const serviceRequestReducer = (state, action) => {
  if (typeof state === 'undefined') {
    state = initialState;
  }
 
  switch (action.type) {
    

    case serviceReqConstants.GET_CATEGORY_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };
 
    case serviceReqConstants.GET_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        categories: action.payload.categories,
      };
 
    case serviceReqConstants.GET_CATEGORY_FAILURE:
      return {
        ...state,
        loading: false,  // fix: loading false on failure
        error: action.payload.message,
      };
 
    case serviceReqConstants.GET_ORGANIZER_REQUESTS_REQUEST:
      return {
        ...state,
        orgLoading: true,
        orgError: null,
      };
 
    case serviceReqConstants.GET_ORGANIZER_REQUESTS_SUCCESS:
      return {
        ...state,
        orgLoading: false,
        organizerRequests: action.payload.requests,
      };
 
    case serviceReqConstants.GET_ORGANIZER_REQUESTS_FAILURE:
      return {
        ...state,
        orgLoading: false,
        orgError: action.payload.message,
      };
 
      
    default:
      return state;
  }
};
 
export default serviceRequestReducer;