import { HomeAndGlobalConstants } from "./constants";
import axios from "../helper/axios";

export const updateContractStatus = ({ id, newStatus, eventReqId }) => async (dispatch) => {
    dispatch({ type: HomeAndGlobalConstants.PATCH_CONTRACT_STATUS_REQUEST });

    try {
        const response = await axios.patch(`/contract/status/${id}/${eventReqId}`, { newStatus });
        dispatch({
            type: HomeAndGlobalConstants.PATCH_CONTRACT_STATUS_REQUEST,
            payload: {
                message: response?.data?.message,
            },
        });
        dispatch(getContract())
    } catch (error) {
        dispatch({
            type: HomeAndGlobalConstants.PATCH_CONTRACT_STATUS_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const getContract = (status) => async (dispatch) => {
    dispatch({ type: HomeAndGlobalConstants.GET_REQUEST });

    try {
        const response = await axios.get(`/contract?status=${status}`);
        dispatch({
            type: HomeAndGlobalConstants.GET_SUCCESS,
            payload: {
                contracts: response?.data?.contracts,
                message: response?.data?.message,
            },
        });
    } catch (error) {
        dispatch({
            type: HomeAndGlobalConstants.GET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};