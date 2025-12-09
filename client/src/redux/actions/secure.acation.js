import { secureInfoConstants } from "./constants";
import axios from "../helper/axios";

export const secureInfoData = (id) => async (dispatch) => {
    dispatch({ type: secureInfoConstants.GET_REQUEST });

    try {
        const response = await axios.get(`/secure/info/${id}`);
        dispatch({
            type: secureInfoConstants.GET_SUCCESS,
            payload: {
                isAssigned: response.data.isAssigned,
                message: response.data.message
            }
        });

    } catch (error) {
        dispatch({
            type: secureInfoConstants.GET_FAILURE,
            payload: error?.response?.data?.message || "Server error",
        });
    }
};