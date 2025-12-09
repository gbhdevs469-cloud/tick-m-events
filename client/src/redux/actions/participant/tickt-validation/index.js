import axios from "../../../helper/axios";
import { entryValidationReqConstants } from "../../constants";

export const orderBasedUserEventFetch = () => async (dispatch) => {
  dispatch({ type: entryValidationReqConstants.GET_REQUEST });

  try {
    const response = await axios.get(`/participant/entry-validation`);
    
    dispatch({
      type: entryValidationReqConstants.GET_SUCCESS,
      payload: {
        message: response?.data?.message,
        entryValidation: response?.data,
      },
    });
  } catch (error) {
    dispatch({
      type: entryValidationReqConstants.GET_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};