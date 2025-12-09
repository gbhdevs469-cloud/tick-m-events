import axios from "../helper/axios";
import { socialMediaConstants } from './constants';

// export const createSocialMediaPost = (postData) => async (dispatch) => {
//   try {
//     dispatch({ type: socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_REQUEST });

//     const response = await axios.post('/promotion/create-post', postData, {
//       withCredentials: true,
//         headers: {
//         'Content-Type': 'multipart/form-data',
//       },
//     });

//     dispatch({
//       type: socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_SUCCESS,
//       payload: response.data.post,
//     });
//   } catch (error) {
//     dispatch({
//       type: socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_FAIL,
//       payload: error.response && error.response.data && error.response.data.message
//         ? error.response.data.message
//         : error.message,
//     });
//   }
// };

export const createSocialMediaPost = (postData) => async (dispatch) => {
  try {
    dispatch({ type: socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_REQUEST });

    const response = await axios.post('/promotion/create-post', postData, {
      withCredentials: true,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    dispatch({
      type: socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_SUCCESS,
      payload: response.data.post,
    });

    return response.data;

  } catch (error) {
    dispatch({
      type: socialMediaConstants.CREATE_SOCIAL_MEDIA_POST_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
    throw error;
  }
};
