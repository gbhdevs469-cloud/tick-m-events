import { authConstants } from "./constants";
import axios from "../helper/axios";

export const profileUpdate = ({ formProfileData, _id }) => async (dispatch) => {
    dispatch({ type: authConstants.UPDATE_REQUEST });

    try {
        const response = await axios.patch(`/auth/${_id}`, formProfileData);

        dispatch({
            type: authConstants.UPDATE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(profileGet(_id))
        return {
            type: authConstants.UPDATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: authConstants.UPDATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: authConstants.UPDATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const userServiceUpdate = ({ serviceUpdateData, serviceId, userId }) => async (dispatch) => {
    dispatch({ type: authConstants.UPDATE_SERVICE_FAILURE });

    try {
        const response = await axios.patch(`/user-service-request/${serviceId}`, serviceUpdateData);

        dispatch({
            type: authConstants.UPDATE_SERVICE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(profileGet(userId))
        return {
            type: authConstants.UPDATE_SERVICE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: authConstants.UPDATE_SERVICE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: authConstants.UPDATE_SERVICE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const profileGet = (_id) => async (dispatch) => {
    dispatch({ type: authConstants.GET_REQUEST });

    try {
        const response = await axios.get(`/auth/profile/${_id}`);
        dispatch({
            type: authConstants.GET_SUCCESS,
            payload: {
                message: response?.data?.message,
                profile: response?.data?.user,
                services: response?.data?.services
            },

        });
        return {
            type: authConstants.GET_SUCCESS,
            profile: response?.data?.profile
        };
    } catch (error) {
        dispatch({
            type: authConstants.GET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: authConstants.GET_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};