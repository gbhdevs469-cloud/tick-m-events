import axios from "../../helper/axios";
import { customizationConstants } from "../constants";

export const getPromotionLogo = () => async (dispatch) => {
    dispatch({ type: customizationConstants.GET_PROMOTION_LOGOS_REQUEST });

    try {
        const response = await axios.get('/admin/logo-promotion');
        dispatch({
            type: customizationConstants.GET_PROMOTION_LOGOS_SUCCESS,
            payload: response.data.logos,
        });

    } catch (error) {
        console.log(error);

        dispatch({
            type: customizationConstants.GET_PROMOTION_LOGOS_FAILURE,
            payload: {
                message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
                error: error?.status || 500,
            },
        });
    }
};

export const addPromotionLogo = (data) => async (dispatch) => {
    dispatch({ type: customizationConstants.ADD_PROMOTION_LOGOS_REQUEST });

    try {
        const response = await axios.post('/admin/logo-promotion', data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: customizationConstants.ADD_PROMOTION_LOGOS_SUCCESS,
            payload: response.data.data,
        });
        dispatch(getPromotionLogo())
        return {
            type: customizationConstants.ADD_PROMOTION_LOGOS_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };
    } catch (error) {
        console.log(error);

        dispatch({
            type: customizationConstants.ADD_PROMOTION_LOGOS_FAILURE,
            payload: {
                message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
                error: error?.status || 500,
            },
        });

        return {
            type: customizationConstants.ADD_PROMOTION_LOGOS_FAILURE,
            status: error?.status || 500,
            message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
        };
    }
};

export const editPromotionLogo = (data, _id) => async (dispatch) => {
    dispatch({ type: customizationConstants.EDIT_PROMOTION_LOGOS_REQUEST });

    try {
        const response = await axios.put(`/admin/logo-promotion/${_id}`, data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: customizationConstants.EDIT_PROMOTION_LOGOS_SUCCESS,
            payload: response.data.data,
        });
        dispatch(getPromotionLogo())
        return {
            type: customizationConstants.EDIT_PROMOTION_LOGOS_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };
    } catch (error) {
        console.log(error);

        dispatch({
            type: customizationConstants.EDIT_PROMOTION_LOGOS_FAILURE,
            payload: {
                message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
                error: error?.status || 500,
            },
        });

        return {
            type: customizationConstants.EDIT_PROMOTION_LOGOS_FAILURE,
            status: error?.status || 500,
            message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
        };
    }
};

export const deletePromotionLogo = (_id) => async (dispatch) => {
    dispatch({ type: customizationConstants.DELETE_PROMOTION_LOGOS_REQUEST });

    try {
        const response = await axios.delete(`/admin/logo-promotion/${_id}`);
        dispatch({
            type: customizationConstants.DELETE_PROMOTION_LOGOS_SUCCESS,
            payload: response.data.data,
        });
        dispatch(getPromotionLogo())
        return {
            type: customizationConstants.DELETE_PROMOTION_LOGOS_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };
    } catch (error) {

        dispatch({
            type: customizationConstants.DELETE_PROMOTION_LOGOS_FAILURE,
            payload: {
                message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
                error: error?.status || 500,
            },
        });

        return {
            type: customizationConstants.DELETE_PROMOTION_LOGOS_FAILURE,
            status: error?.status || 500,
            message: error?.response?.data?.message || 'Failed to fetch latest event_created activity',
        };
    }
};