import { authConstants } from "../actions/constants";

const initialState = {
  token: null,
  user: {
    _id: '',
    name: '',
    number: '',
    email: '',
    socialLinks: {},
    username: "",
    experience: "",
    address: "",
    website: "",
    cover: "",
    isVerified: false,
    isAdmin: false,
    referralCode:""
  },
  authenticate: false,
  authenticating: false,
  error: null,
  message: '',
};

const authReducer = (state, action) => {
  if (state === undefined) {
    state = initialState; // Assign initial state here
  }
  switch (action.type) {
    case authConstants.LOGIN_REQUEST:
      return { ...state, authenticating: true };

    case authConstants.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        authenticate: true,
        authenticating: false,
        message: action.payload.message,
      };

    case authConstants.LOGIN_FAILURE:
      return {
        ...state,
        error: action.payload.error,
        message: action.payload.message,
        authenticate: false,
        authenticating: false,
      };

    case authConstants.LOGOUT_REQUEST:
      return {
        ...state, // Keep existing state until logout completes
      };

    case authConstants.LOGOUT_SUCCESS:
      return {
        ...initialState, // Reset state on logout success
      };

    default:
      return state; // Always return a valid state
  }
};


export default authReducer;
