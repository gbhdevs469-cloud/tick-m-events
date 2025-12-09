import { secureInfoConstants } from '../actions/constants';

const initialState = {
  message: "",
  isAssigned: null,
};

const secureInfoReducer = (state, action) => {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case secureInfoConstants.GET_REQUEST:
      return {
        ...state,
      };

    case secureInfoConstants.GET_SUCCESS:
      return {
        ...state,
        message: action.payload.message,
        isAssigned: action.payload.isAssigned,
      };

    case secureInfoConstants.GET_FAILURE:
      return {
        ...state,
      };

    default:
      return state;
  }
};

export default secureInfoReducer;
