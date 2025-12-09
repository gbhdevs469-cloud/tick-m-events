import { searchSelectProviderConstants } from "./constants";
import axios from "../helper/axios";

export const providersListFetch = (data) => async (dispatch) => {

  dispatch({ type: searchSelectProviderConstants.GET_REQUEST });

  try {
    const response = await axios.get(`/auth/providers?serviceCategory=${data.serviceCategory}&location=${data.location}&search=${data.search}&certified=${data.certified}&rating=${data.rating}`);
    dispatch({
      type: searchSelectProviderConstants.GET_SUCCESS,
      payload: {
        message: response?.data?.message,
        providers: response?.data,
      },
    });
  } catch (error) {
    dispatch({
      type: searchSelectProviderConstants.GET_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};

export const providersCateFetch = () => async (dispatch) => {
  dispatch({ type: searchSelectProviderConstants.GET_CATEGORY_REQUEST });

  try {
    const response = await axios.get(`/auth/providers/service`);
    dispatch({
      type: searchSelectProviderConstants.GET_CATEGORY_SUCCESS,
      payload: {
        serviceCate: response?.data?.categories
      },
    });
  } catch (error) {
    dispatch({
      type: searchSelectProviderConstants.GET_CATEGORY_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Server error",
        error: error.status
      }
    });
  }
};


export const updateProfileViews = (userId) => async (dispatch) => {
  dispatch({ type: searchSelectProviderConstants.PROFILE_VIEW_REQUEST });

  try {
    const response = await axios.patch(`/auth/profile-views/${userId}`);
    console.log('====================================');
    console.log('profile',response);
    console.log('====================================');
    dispatch({
      type: searchSelectProviderConstants.PROFILE_VIEW_SUCCESS,
      payload: {
        serviceCate: response?.data?.categories
      },
    });
  } catch (error) {
    dispatch({
      type: searchSelectProviderConstants.PROFILE_VIEW_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Server error",
        error: error.status
      }
    });
  }
};