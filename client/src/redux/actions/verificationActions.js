import { verificationConstants } from "./constants";
import axios from "../helper/axios";

export const getAllAdminVerifications = () => async (dispatch) => {
    dispatch({ type: verificationConstants.ADMIN_VERIFICATIONS_REQUEST });

    try {
        const response = await axios.get("/verification/Idverifications");

        dispatch({
            type: verificationConstants.ADMIN_VERIFICATIONS_SUCCESS,
            payload: { data: response?.data?.data }
        });

        return {
            type: verificationConstants.ADMIN_VERIFICATIONS_SUCCESS,
            status: response.status,
            data: response?.data?.data
        };
    } catch (error) {
        const message = error?.response?.data?.message || "Server error";

        dispatch({
            type: verificationConstants.ADMIN_VERIFICATIONS_FAIL,
            payload: {
                message,
                error: error?.response?.status
            }
        });

        return {
            type: verificationConstants.ADMIN_VERIFICATIONS_FAIL,
            message,
            status: error?.response?.status
        };
    }
};

export const approveIdentity = (userId) => async (dispatch) => {
    dispatch({ type: verificationConstants.ADMIN_APPROVE_IDENTITY_REQUEST });

    try {
        const response = await axios.patch(`/verification/approve-identity/${userId}`);
        dispatch({
            type: verificationConstants.ADMIN_APPROVE_IDENTITY_SUCCESS,
            payload: response?.data?.data,
        });

        return {
            success: true,
            data: response?.data?.data,
        };
    } catch (error) {
        const message = error?.response?.data?.message || "Server error";

        dispatch({
            type: verificationConstants.ADMIN_APPROVE_IDENTITY_FAIL,
            payload: {
                message,
                error: error?.response?.status,
            },
        });

        return {
            success: false,
            message,
        };
    }
};


export const rejectIdentity = (userId, reason) => async (dispatch) => {
    dispatch({ type: verificationConstants.ADMIN_REJECT_IDENTITY_REQUEST });

    try {
        const response = await axios.patch(`/verification/reject-identity/${userId}`, { reason });

        dispatch({
            type: verificationConstants.ADMIN_REJECT_IDENTITY_SUCCESS,
            payload: response?.data?.data,
        });

        return {
            success: true,
            data: response?.data?.data,
        };
    } catch (error) {
        const message = error?.response?.data?.message || "Server error";

        dispatch({
            type: verificationConstants.ADMIN_REJECT_IDENTITY_FAIL,
            payload: {
                message,
                error: error?.response?.status,
            },
        });

        return {
            success: false,
            message,
        };
    }
};
