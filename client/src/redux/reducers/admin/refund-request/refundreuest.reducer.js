import { marketPlaceSupervisionConstants, refundReqConstants, ticketTransSuperConstants } from "src/redux/actions/constants";

const initialState = {
  loading: false,
  refundReqs: [],
  payments: [],
  providerList: [],
  error: null,
  pagination: {},
  performanceSumm: {},
  ticketTrnsSup: {}
};

const reqAndRefundsReducer = (state, action) => {
  if (state === undefined) {
    state = initialState; // Assign initial state here
  }

  switch (action.type) {
     case ticketTransSuperConstants.GET_TICKET_TRNS_REQUEST:
      return { ...state, loading: true };

    case ticketTransSuperConstants.GET_TICKET_TRNS_SUCCESS:
      return {
        ...state,
        loading: false,
        ticketTrnsSup: action.payload.ticketTrnsSup,
        message: action.payload.message
      };

    case ticketTransSuperConstants.GET_TICKET_TRNS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case marketPlaceSupervisionConstants.GET_PERFORMANCE_REQUEST:
      return { ...state, loading: true };

    case marketPlaceSupervisionConstants.GET_PERFORMANCE_SUCCESS:
      return {
        ...state,
        loading: false,
        performanceSumm: action.payload.performanceSumm,
        message: action.payload.message
      };

    case marketPlaceSupervisionConstants.GET_PERFORMANCE_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case marketPlaceSupervisionConstants.GET_PROVIDER_REQUEST:
      return { ...state, loading: true };

    case marketPlaceSupervisionConstants.GET_PROVIDER_SUCCESS:
      return {
        ...state,
        loading: false,
        providerList: action.payload.providerList,
        count: action.payload.count,
        message: action.payload.message
      };

    case marketPlaceSupervisionConstants.GET_PROVIDER_FAILURE:
      return { ...state, loading: false, error: action.payload };


    case ticketTransSuperConstants.GET_VERIFY_TRNS_REQUEST:
      return { ...state, loading: true };

    case ticketTransSuperConstants.GET_VERIFY_TRNS_SUCCESS:
      return { ...state, loading: false, payments: action.payload.payments };

    case ticketTransSuperConstants.GET_VERIFY_TRNS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    case refundReqConstants.GET_RR_REQUEST:
      return { ...state, loading: true };

    case refundReqConstants.GET_RR_SUCCESS:
      return { ...state, loading: false, refundReqs: action.payload };

    case refundReqConstants.GET_RR_FAILURE:
      return { ...state, loading: false, error: action.payload };

    default:
      return state; // Always return a valid state
  }
};

export default reqAndRefundsReducer;

