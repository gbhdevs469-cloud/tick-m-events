import { eventReviewConstants } from "./constants";
import axios from '../helper/axios';

export const eventAddReview = (reviewFormData) => async (dispatch) => {

    dispatch({ type: eventReviewConstants.CREATE_REQUEST });

    try {
        const response = await axios.post("event-review", reviewFormData);
        dispatch({
            type: eventReviewConstants.CREATE_SUCCESS,
            payload: {
                message: response?.data?.message
            },
        });
        return {
            type: eventReviewConstants.CREATE_SUCCESS,
            message: response?.data?.message,
            status: response?.status,
        };
    } catch (error) {
        dispatch({
            type: eventReviewConstants.CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: eventReviewConstants.CREATE_FAILURE,
            message: error?.response?.data?.message
        };
    }
};