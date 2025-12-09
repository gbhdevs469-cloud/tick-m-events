import { socialMediaConstants } from '../actions/constants';

const initialState = {
  loading: false,
  error: null,
  post: null,
};

const socialMediaPostReducer = (state, action) => {
  if (typeof state === 'undefined') {
    state = initialState;
  }

  switch (action.type) {
    case socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        post: null,
      };

    case socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_SUCCESS:
      return {
        ...state,
        loading: false,
        post: action.payload,
      };

    case socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_FAIL:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default socialMediaPostReducer;
