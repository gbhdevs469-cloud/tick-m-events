import axios from "../../helper/axios";
import { contactPayConstants } from "../constants";

export const iniConPay = (userId, amount, flag) => async (dispatch) => {
    dispatch({ type: contactPayConstants.INITIATE_CON_PAYMET_REQUEST });
    try {
        const response = await axios.post("/contact-pay/initiate-payment", { userId, amount, flag });

        dispatch({
            type: contactPayConstants.INITIATE_CON_PAYMET_SUCCESS,
            payload: {
                message: response?.data?.message
            },
        });
        return {
            type: contactPayConstants.INITIATE_CON_PAYMET_SUCCESS,
            message: response?.data?.message,
            status: response?.status,
            data: response?.data,
        };
    } catch (error) {
        dispatch({
            type: contactPayConstants.INITIATE_CON_PAYMET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: contactPayConstants.INITIATE_CON_PAYMET_FAILURE,
            message: error?.response?.data?.message,
            status: error?.status,
        };
    }
};

export const checkPayConStat = (transactionId) => async (dispatch) => {
    dispatch({ type: contactPayConstants.CEHCKSTATUS_CON_PAYMET_REQUEST });

    try {
        const response = await axios.get(`/contact-pay/payment-status/${transactionId}`);
        console.log(response);

        dispatch({
            type: contactPayConstants.CEHCKSTATUS_CON_PAYMET_SUCCESS,
            payload: {
                message: response?.data?.message
            },
        });
        return {
            type: contactPayConstants.CEHCKSTATUS_CON_PAYMET_SUCCESS,
            message: response?.data?.message,
            status: response?.status,
            data: response?.data,
        };
    } catch (error) {
        dispatch({
            type: contactPayConstants.CEHCKSTATUS_CON_PAYMET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: contactPayConstants.CEHCKSTATUS_CON_PAYMET_FAILURE,
            message: error?.response?.data?.message || 'Failed to check payment status',
            status: error?.status,
        };
    }
};