import { contractConstants } from "./constants";
import axios from "../helper/axios";
import { getAccepedByProiver } from "./service-request";

export const createContractSigned = (finalContractEntry) => async (dispatch) => {

    dispatch({ type: contractConstants.CREATE_SIGNED_REQUEST });

    try {
        const response = await axios.post('/contract', finalContractEntry);
    
        dispatch({
            type: contractConstants.CREATE_SIGNED_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(getAccepedByProiver())
        return {
            type: contractConstants.CREATE_SIGNED_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: contractConstants.CREATE_SIGNED_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: contractConstants.CREATE_SIGNED_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};