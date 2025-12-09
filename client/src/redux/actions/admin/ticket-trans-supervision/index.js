import {  ticketTransSuperConstants } from "../../constants";
import axios from "../../../helper/axios";

export const verifyTrnasFetch = () => async (dispatch) => {
    dispatch({ type: ticketTransSuperConstants.GET_VERIFY_TRNS_REQUEST });

    try {
        const response = await axios.get(`/admin/admin-payments`);
        dispatch({
            type: ticketTransSuperConstants.GET_VERIFY_TRNS_SUCCESS,
            payload: {
                message: response?.data?.message,
                payments: response?.data?.payments,
            },

        });
    } catch (error) {
        dispatch({
            type: ticketTransSuperConstants.GET_VERIFY_TRNS_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const ticketTrnasFetch = () => async (dispatch) => {
    dispatch({ type: ticketTransSuperConstants.GET_TICKET_TRNS_REQUEST });

    try {
        const response = await axios.get(`/admin/ticket-trnsa`);
        
        dispatch({
            type: ticketTransSuperConstants.GET_TICKET_TRNS_SUCCESS,
            payload: {
                message: response?.data?.message,
                ticketTrnsSup: response?.data?.ticketTrnsSup,
            },

        });
    } catch (error) {
        dispatch({
            type: ticketTransSuperConstants.GET_TICKET_TRNS_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};