
import { activityConstants } from "./constants";
import axios from "../helper/axios";

export const fetchLatestEventCreatedActivity = () => async (dispatch) => {
    dispatch({ type: activityConstants.FETCH_LATEST_EVENT_CREATED_REQUEST });
 
    try {
        const response = await axios.get('/activities/event-created/latest');
 
        dispatch({
            type: activityConstants.FETCH_LATEST_EVENT_CREATED_SUCCESS,
            payload: response.data.data,
        });
 
        return {
            type: activityConstants.FETCH_LATEST_EVENT_CREATED_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };
    } catch (error) {
        dispatch({
            type: activityConstants.FETCH_LATEST_EVENT_CREATED_FAILURE,
            payload: {
                message:
                    error?.response?.data?.message || 'Failed to fetch latest event_created activity',
                error: error?.response?.status || 500,
            },
        });
 
        return {
            type: activityConstants.FETCH_LATEST_EVENT_CREATED_FAILURE,
            status: error?.response?.status || 500,
            message:
                error?.response?.data?.message || 'Failed to fetch latest event_created activity',
        };
    }
};

export const fetchLoginActivities = () => async (dispatch) => {
    dispatch({ type: activityConstants.FETCH_ACTIVITIES_REQUEST });

    try {
        const response = await axios.get("/activities/message-notification");

        dispatch({
            type: activityConstants.FETCH_ACTIVITIES_SUCCESS,
            payload: response.data.data,
        });

        return {
            type: activityConstants.FETCH_ACTIVITIES_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };

    } catch (error) {
        dispatch({
            type: activityConstants.FETCH_ACTIVITIES_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch activities",
                error: error.status,
            },
        });

        return {
            type: activityConstants.FETCH_ACTIVITIES_FAILURE,
            message: error?.response?.data?.message || "Failed to fetch activities",
            status: error.status,
        };
    }
};

export const fetchAdminActivities = (params = {}) => async (dispatch) => {
    dispatch({ type: activityConstants.FETCH_ADMIN_ACTIVITIES_REQUEST });

    try {
        const queryParams = new URLSearchParams(params).toString();

        const response = await axios.get(`/activities/get-all-activies`);

        dispatch({
            type: activityConstants.FETCH_ADMIN_ACTIVITIES_SUCCESS,
            payload: response.data.data,
        });

        return {
            type: activityConstants.FETCH_ADMIN_ACTIVITIES_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: response.data.data,
        };
    } catch (error) {
        dispatch({
            type: activityConstants.FETCH_ADMIN_ACTIVITIES_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch activities",
                error: error.response?.status || 500,
            },
        });

        return {
            type: activityConstants.FETCH_ADMIN_ACTIVITIES_FAILURE,
            message: error?.response?.data?.message || "Failed to fetch activities",
            status: error.response?.status || 500,
        };
    }
}; 