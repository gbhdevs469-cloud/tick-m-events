import { promotionConstants } from "./constants";
import axios from "../helper/axios";

export const promotionUpdate = ({ formEventData, _id }) => async (dispatch) => {
    dispatch({ type: promotionConstants.CREATE_REQUEST });

    try {
        const response = await axios.patch(`/promotion/${_id}`, formEventData);

        dispatch({
            type: promotionConstants.CREATE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(promotionGet())
        return {
            type: promotionConstants.CREATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: promotionConstants.CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: promotionConstants.CREATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const promotionCreate = (data) => async (dispatch) => {
    dispatch({ type: promotionConstants.CREATE_REQUEST });

    try {
        const response = await axios.post("/promotion", data);

        dispatch({
            type: promotionConstants.CREATE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(promotionGet())
        return {
            type: promotionConstants.CREATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: promotionConstants.CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: promotionConstants.CREATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const promotionGet = (data) => async (dispatch) => {
    dispatch({ type: promotionConstants.GET_REQUEST });

    try {
        const response = await axios.get("/promotion");
        dispatch({
            type: promotionConstants.GET_SUCCESS,
            payload: {
                message: response?.data?.message,
                promotions: response?.data?.promotions
            },

        });
        return {
            type: promotionConstants.GET_SUCCESS,
            promotions: response?.data?.promotions
        };
    } catch (error) {
        dispatch({
            type: promotionConstants.GET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: promotionConstants.GET_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const promotionEvents = () => async (dispatch) => {
    dispatch({ type: promotionConstants.GET_EVENTS_REQUEST });

    try {
        const response = await axios.get("/home-recommendations/eventListwithorderandparticipant");
        dispatch({
            type: promotionConstants.GET_EVENTS_SUCCESS,
            payload: {
                message: response?.data?.message,
                eventsWithOrdersAndParticiapnt: response?.data?.eventsWithOrdersAndParticiapnt
            },

        });
    } catch (error) {
        dispatch({
            type: promotionConstants.GET_EVENTS_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Server error",
                error: error.status
            },
        })
    }
};

export const promotionValidate = (promoCode, eventId, ticketIds) => async (dispatch) => {
    dispatch({ type: promotionConstants.VALIDATE_REQUEST });
 
    try {
        const response = await axios.post("/promotion/validate", {
            promoCode,
            eventId,
            selectedTickets: ticketIds
        });
 
        dispatch({
            type: promotionConstants.VALIDATE_SUCCESS,
            payload: {
                message: response?.data?.message,
                promo: response?.data?.promo,
                eventId,
                selectedTickets: ticketIds
            }
        });
 
        // ✅ Return plain object (no constants)
        return {
            success: true,
            promo: response?.data?.promo,
            message: response?.data?.message,
            eventId,
            selectedTickets: ticketIds,
            status: response.status
        };
    } catch (error) {
        dispatch({
            type: promotionConstants.VALIDATE_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Server error",
                error: error.status
            }
        });
 
        // ✅ Return plain object (no constants)
        return {
            success: false,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};