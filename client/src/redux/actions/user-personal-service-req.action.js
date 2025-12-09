import { userPersonalServiceReqConstants } from "./constants";
import axios from "../helper/axios";

export const personalUserServiceReqCreate = (formServiceData) => async (dispatch) => {
    dispatch({ type: userPersonalServiceReqConstants.CREATE_REQUEST });

    try {
        const response = await axios.post("/user-service-request", formServiceData);

        dispatch({
            type: userPersonalServiceReqConstants.CREATE_SUCCESS,
            payload: { message: response?.data?.message },
            
        });
        return {
            type: userPersonalServiceReqConstants.CREATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: userPersonalServiceReqConstants.CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: userPersonalServiceReqConstants.CREATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};
