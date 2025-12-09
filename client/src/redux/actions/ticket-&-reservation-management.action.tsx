import { AnyAction } from 'redux';
import { ThunkAction } from 'redux-thunk';


import axios from "../helper/axios";
import { RootState } from "../store";

import { ticketTypeConstants } from "./constants";

type AppThunk<ReturnType = void> = ThunkAction<
    ReturnType,
    RootState,
    unknown,
    AnyAction
>;

interface ApiResponse {
    status: number;
    message: string;
    data?: any;
    ticketWiseRevenue?: any
}
interface TicketFormData {
    name: string;
    quantity: string;
    ticketDescription: string;
    price: string;
    validity: string;
    options: {
        transferableTicket: boolean;
        personalizedTicket: boolean;
        activationCode: boolean;
    };
}

interface RefundPolicyPayload {
    eventId: string;
    fullRefund: boolean;
    fullRefundDaysBefore?: string;
    partialRefund: boolean;
    partialRefundPercent?: string;
    noRefundAfterDate: boolean;
    noRefundDate?: string | null;
    isRefundPolicyEnabled: boolean;
}

interface ApiResponse {
    status: number;
    message: string;
    data?: any;
    ticketWiseRevenue?: any
}
interface TicketFormData {
    name: string;
    quantity: string;
    ticketDescription: string;
    price: string;
    validity: string;
    options: {
        transferableTicket: boolean;
        personalizedTicket: boolean;
        activationCode: boolean;
    };
    eventId: string;
}

interface RefundPolicyPayload {
    eventId: string;
    fullRefund: boolean;
    fullRefundDaysBefore?: string;
    partialRefund: boolean;
    partialRefundPercent?: string;
    noRefundAfterDate: boolean;
    noRefundDate?: string | null;
    isRefundPolicyEnabled: boolean;
}

// Create ticket type api implementaion
export const createTicketType = (
    ticketTypeCreate: TicketFormData
): AppThunk<Promise<ApiResponse>> => async (dispatch) => {

    dispatch({ type: ticketTypeConstants.CREATE_TICKET_TYPE_REQUEST });

    try {
        const response = await axios.post("/tickets", ticketTypeCreate);
        dispatch({
            type: ticketTypeConstants.CREATE_TICKET_TYPE_SUCCESS,
            payload: { message: response?.data?.message },
            ticketTypeId: response?.data?.ticketTypeId
        });

        // 👇 Fix: use ticketTypeCreate.eventId here
        dispatch(fetchTicketType(ticketTypeCreate.eventId));

        return {
            type: ticketTypeConstants.CREATE_TICKET_TYPE_SUCCESS,
            status: response.status,
            message: response?.data?.message,
            ticketTypeId: response?.data?.ticketTypeId
        };

    } catch (error: any) {
        dispatch({
            type: ticketTypeConstants.CREATE_TICKET_TYPE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: ticketTypeConstants.CREATE_TICKET_TYPE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const fetchTicketType = (eventId: string): AppThunk<Promise<ApiResponse>> => async (dispatch) => {
    dispatch({ type: ticketTypeConstants.GET_REQUEST });

    try {
        const response = await axios.get(`/tickets?eventId=${eventId}`);

        const successResponse: ApiResponse = {
            status: response.status,
            message: 'Success',
            data: response?.data?.data,
            ticketWiseRevenue: response?.data?.revenueData?.ticketWiseRevenue

        };

        dispatch({
            type: ticketTypeConstants.GET_SUCCESS,
            payload: successResponse,
        });

        return successResponse;

    } catch (error: any) {
        const errorResponse: ApiResponse = {
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Server error",
            data: null
        };

        dispatch({
            type: ticketTypeConstants.GET_FAILURE,
            payload: errorResponse,
        });

        return errorResponse;
    }
};

export const updateTicketType = ({ editedData }: any): AppThunk<Promise<ApiResponse>> => async (dispatch) => {
    dispatch({ type: ticketTypeConstants.UPDATE_REQUEST });

    try {
        const response = await axios.patch(`/tickets/${editedData._id}`, editedData);
        const successResponse: ApiResponse = {
            status: response.status,
            message: response.data.message,
        };

        dispatch({
            type: ticketTypeConstants.UPDATE_SUCCESS,
            payload: successResponse,
        });
        if (editedData.eventId) {
            dispatch(fetchTicketType(editedData.eventId));
        }

        return successResponse;

    } catch (error: any) {
        const errorResponse: ApiResponse = {
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Server error",
        };

        dispatch({
            type: ticketTypeConstants.UPDATE_FAILURE,
            payload: errorResponse,
        });

        return errorResponse;
    }
};

// Update Refund Policy
export const updateRefundPolicy = (
    payload: RefundPolicyPayload
): AppThunk<Promise<ApiResponse>> => async (dispatch) => {
    dispatch({ type: ticketTypeConstants.UPDATE_REFUND_POLICY_REQUEST });

    try {
        const {
            eventId,
            fullRefund,
            fullRefundDaysBefore,
            partialRefund,
            partialRefundPercent,
            noRefundAfterDate,
            noRefundDate,
            isRefundPolicyEnabled
        } = payload;

        const response = await axios.patch(`/tickets/refund-policy/${eventId}`, {
            fullRefund,
            fullRefundDaysBefore,
            partialRefund,
            partialRefundPercent,
            noRefundAfterDate,
            noRefundDate,
            isRefundPolicyEnabled
        });

        const successResponse: ApiResponse = {
            status: response.status,
            message: response.data.message,
            data: response.data.data,
        };

        dispatch({
            type: ticketTypeConstants.UPDATE_REFUND_POLICY_SUCCESS,
            payload: successResponse,
        });

        return successResponse;

    } catch (error: any) {
        const errorResponse: ApiResponse = {
            status: error?.response?.status || 500,
            message: error?.response?.data?.message || "Server error",
        };

        dispatch({
            type: ticketTypeConstants.UPDATE_REFUND_POLICY_FAILURE,
            payload: errorResponse,
        });

        return errorResponse;
    }
};