import { placeABidConstants } from "../../constants";
import axios from "../../../helper/axios";

export const placeABidsFetch = (projectId) => async (dispatch) => {
  dispatch({ type: placeABidConstants.GET_REQ_REQUEST });

  try {
    // Build query parameters
    const params = {};
    if (projectId) {
      params.projectId = projectId;
    }

    const response = await axios.get(`/o/place-a-bid`, {
      params // Send as query parameters
    });
    dispatch({
      type: placeABidConstants.GET_REQ_SUCCESS,
      payload: {
        message: response?.data?.message,
        projects: response?.data?.projects,
      },
    });
  } catch (error) {
    dispatch({
      type: placeABidConstants.GET_REQ_SUCCESS,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};

export const placeABidsByIdFetch = (projectId) => async (dispatch) => {
  dispatch({ type: placeABidConstants.GET_PROJECTBYID_REQUEST });
  try {
    const response = await axios.get(`/o/place-a-bid/${projectId}`);
    dispatch({
      type: placeABidConstants.GET_PROJECTBYID_SUCCESS,
      payload: {
        message: response?.data?.message,
        project: response?.data?.project,
      },
    });
  } catch (error) {
    dispatch({
      type: placeABidConstants.GET_PROJECTBYID_SUCCESS,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};