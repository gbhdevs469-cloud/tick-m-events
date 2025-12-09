import { eventOrderConstants } from "./constants";
import axios from "../helper/axios";

// Create order
export const eventOrderCreate = (orderFormEntry) => async (dispatch) => {

  dispatch({ type: eventOrderConstants.CREATE_REQUEST });

  try {
    const response = await axios.post(`/event-order/order`, orderFormEntry);

    dispatch({
      type: eventOrderConstants.CREATE_SUCCESS,
      payload: {
        message: response?.data?.message,
        order: response?.data.savedOrder,
        paymentUrl: response?.data?.paymentUrl,
      },
    });
    return {
      type: eventOrderConstants.CREATE_SUCCESS,
      message: response?.data?.message,
      order: response?.data.savedOrder,
      paymentUrl: response?.data?.paymentUrl,
      status: response.status,
    };
  } catch (error) {
    dispatch({
      type: eventOrderConstants.CREATE_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
    return {
      type: eventOrderConstants.CREATE_FAILURE,
      message: error?.response?.data?.message,
      status: error?.response.status,
    };
  }
};

export const verifyTicketCode = (verifyData) => async (dispatch) => {

  dispatch({ type: eventOrderConstants.VERIFY_TICKET_REQUEST });

  try {
    const res = await axios.post("/event-order/verify-ticket", verifyData);
    dispatch({
      type: eventOrderConstants.VERIFY_TICKET_SUCCESS,
      payload: {
        message: res.data.message,
        name: res.data.name,
        ticket: res.data.ticket,
        eventName: res.data.eventName,
        flag: res.data.flag
      }
    });
    return {
      type: eventOrderConstants.VERIFY_TICKET_SUCCESS,
      message: res.data.message,
      ticket: res.data.ticket,
      eventName: res.data.eventName,
      status: res.status,
      flag: res?.data?.flag
    };
  } catch (err) {
    dispatch({
      type: eventOrderConstants.VERIFY_TICKET_FAILURE,
      payload: {
        message: err?.response?.data?.message || "Error verifying ticket"
      }
    });

    return {
      type: eventOrderConstants.VERIFY_TICKET_FAILURE, // ✅ fixed here
      message: err?.response?.data?.message || "Error verifying ticket",
      status: err?.status,
      ticket: {},
      eventDetails: err?.response?.data?.eventDetails||{},
      flag: err?.response?.data?.flag
    };
  }
}

export const confirmTicketEntry = (data) => async (dispatch) => {

  dispatch({ type: eventOrderConstants.ENTER_USER_EVENT_REQUEST });

  try {
    const res = await axios.patch("/event-order/verify-entry", data);
    dispatch({
      type: eventOrderConstants.ENTER_USER_EVENT_SUCCESS,
      payload: {
        message: res.data.message,
        name: res.data.name
      }
    });
    dispatch(eventOrderFetch())
    return {
      type: eventOrderConstants.ENTER_USER_EVENT_SUCCESS,
      message: res.data.message,
      ticketCode: res.data.data.ticketCode,
      verifyEntry: res.data.data.verifyEntry,
      entryTime: res.data.data.entryTime,
      status: res.status,
    };

  } catch (err) {
    dispatch({
      type: eventOrderConstants.ENTER_USER_EVENT_FAILURE,
      payload: {
        message: err?.response?.data?.message || "Error verifying ticket"
      }
    });

    return {
      type: eventOrderConstants.ENTER_USER_EVENT_FAILURE, // ✅ fixed here
      message: err?.response?.data?.message || "Error verifying ticket",
      status: err?.status,
    };
  }
};

export const eventOrderFetch = () => async (dispatch) => {
  dispatch({ type: eventOrderConstants.GET_REQUEST });

  try {
    const response = await axios.get(`/event-order`);
    dispatch({
      type: eventOrderConstants.GET_SUCCESS,
      payload: {
        message: response?.data?.message,
        allOrders: response?.data?.allOrders,
        verifiedOrders: response?.data?.verifiedOrders,
      },
    });
  } catch (error) {
    dispatch({
      type: eventOrderConstants.GET_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};