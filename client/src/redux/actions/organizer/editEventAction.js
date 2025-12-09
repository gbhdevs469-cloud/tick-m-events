import { organizerEventConstants } from "../constants";
import axios from "../../helper/axios";

export const editEventsFetch = () => async (dispatch) => {
    dispatch({ type: organizerEventConstants.GET_REQUEST });

    try {
        const response = await axios.get(`/o/edit-events`);
        dispatch({
            type: organizerEventConstants.GET_SUCCESS,
            payload: {
                message: response?.data?.message,
                eventsLists: response?.data?.eventsWithDetails,
            },

        });
    } catch (error) {
        dispatch({
            type: organizerEventConstants.GET_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Server error",
                error: error.status
            },
        });
    }
};

export const deleteEvent = (selectedEventId) => async (dispatch) => {
    dispatch({ type: organizerEventConstants.DELETE_REQUEST });

    try {
        const response = await axios.delete(`/o/edit-events/${selectedEventId}`);
        dispatch({
            type: organizerEventConstants.DELETE_SUCCESS,
            payload: {
                message: response?.data?.message,
            },

        });
        dispatch(editEventsFetch())
    } catch (error) {
        dispatch({
            type: organizerEventConstants.DELETE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const updateEvent = (selectedEventId, formData) => async (dispatch) => {
    dispatch({ type: organizerEventConstants.UPDATE_REQUEST });

    try {
        const response = await axios.patch(`/o/edit-events/${selectedEventId}`, formData);
        
        dispatch({
            type: organizerEventConstants.UPDATE_SUCCESS,
            payload: {
                message: response?.data?.message,
            },

        });
        dispatch(editEventsFetch())
    } catch (error) {
        dispatch({
            type: organizerEventConstants.UPDATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};