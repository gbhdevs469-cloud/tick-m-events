import { serviceReqConstants, serviceRequestConstants } from "./constants";
import axios from "../helper/axios";


export const serviceReqCreate = (formServiceData) => async (dispatch) => {
    dispatch({ type: serviceReqConstants.CREATE_REQUEST });

    try {
        const response = await axios.post("/service-request", formServiceData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        dispatch({
            type: serviceReqConstants.CREATE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(fetchServiceReqUserId())
        return {
            type: serviceReqConstants.CREATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: serviceReqConstants.CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: serviceReqConstants.CREATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const serviceReqUpdate = ({serviceUpdateData, serviceId}) => async (dispatch) => {
    dispatch({ type: serviceReqConstants.UPDATE_REQUEST });

    try {
        const response = await axios.patch(`/service-request/${serviceId}`, serviceUpdateData);
        dispatch({
            type: serviceReqConstants.UPDATE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(fetchServiceReqUserId())
        return {
            type: serviceReqConstants.UPDATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: serviceReqConstants.UPDATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: serviceReqConstants.UPDATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const serviceReqDelete = ({serviceId}) => async (dispatch) => {
  
    dispatch({ type: serviceReqConstants.DELETE_REQUEST });

    try {
        const response = await axios.delete(`/service-request/${serviceId}`);
        dispatch({
            type: serviceReqConstants.DELETE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(fetchServiceReqUserId())
        return {
            type: serviceReqConstants.DELETE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: serviceReqConstants.DELETE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: serviceReqConstants.DELETE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const fetchServiceReqUserId = () => async (dispatch) => {
    dispatch({ type: serviceReqConstants.GET_SERVICE_USERID_REQUEST });

    try {
        const response = await axios.get(`/service-request/userId`);
        
        dispatch({
            type: serviceReqConstants.GET_SERVICE_USERID_SUCCESS,
            payload: {
                message: "Fetch service successfully...",
                serviceRequests: response?.data?.serviceRequests,
            },
        });
    } catch (error) {
        dispatch({
            type: serviceReqConstants.GET_SERVICE_USERID_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const fetchAllServiceCategories = () => async (dispatch) => {
    dispatch({ type: serviceReqConstants.GET_CATEGORY_REQUEST });
 
    try {
        const response = await axios.get("/event/allServiceCategory");
       
        dispatch({
            type: serviceReqConstants.GET_CATEGORY_SUCCESS,
            payload: {
                categories: response?.data?.categories
            },
        });
    } catch (error) {
        dispatch({
            type: serviceReqConstants.GET_CATEGORY_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch categories",
                error: error.status
            },
        });
    }
};


