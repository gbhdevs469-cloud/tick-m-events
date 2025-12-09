import { placeABidConstants } from "../constants";
import axios from "../../helper/axios"

export const organizerPlaceABid = (formDataObj) => async (dispatch) => {
  dispatch({ type: placeABidConstants.POST_PLACEABID_REQUEST });

  try {
    const response = await axios.post("/o/place-a-bid", formDataObj);
    dispatch({
      type: placeABidConstants.POST_PLACEABID_SUCCESS,
      payload: {
        message: response?.data?.message
      },
    });
    return {
      type: placeABidConstants.POST_PLACEABID_SUCCESS,
      message: response?.data?.message,
      status: response?.status,
    };
  } catch (error) {
    dispatch({
      type: placeABidConstants.POST_PLACEABID_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
    return {
      type: placeABidConstants.POST_PLACEABID_FAILURE,
      message: error?.response?.data?.message,
      status: error?.status
    };
  }
};