
import { paymentSettings } from "./constants";
import axios from "../helper/axios";

export const deletePaymentSetting = (id) => async (dispatch) => {
  dispatch({ type: paymentSettings.DELETE_PAYMENT_SETTING_REQUEST });
 
  try {
    const response = await axios.delete(`/settings/deletePaymentSetting/${id}`);
 
    dispatch({
      type: paymentSettings.DELETE_PAYMENT_SETTING_SUCCESS,
      payload: id, // can be used to filter out from state
    });
 
    return {
      type: paymentSettings.DELETE_PAYMENT_SETTING_SUCCESS,
      status: response.status,
      message: response?.data?.message,
    };
  } catch (error) {
    dispatch({
      type: paymentSettings.DELETE_PAYMENT_SETTING_FAILURE,
      payload: error?.response?.data?.message || "Server error",
    });
 
    return {
      type: paymentSettings.DELETE_PAYMENT_SETTING_FAILURE,
      status: error?.response?.status,
      message: error?.response?.data?.message || "Server error",
    };
  }
};

export const savePaymentSettings = (paymentData) => async (dispatch) => {
  try {
    dispatch({ type: paymentSettings.SAVE_PAYMENT_SETTINGS_REQUEST });

    const { data } = await axios.post(
      "/settings/savePaymentSettings",
      paymentData
    );
    dispatch({
      type: paymentSettings.SAVE_PAYMENT_SETTINGS_SUCCESS,
      payload: data,
    });
  } catch (error) {
    dispatch({
      type: paymentSettings.SAVE_PAYMENT_SETTINGS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};


export const getPaymentSettings = () => async (dispatch) => {
  try {
    dispatch({ type: paymentSettings.GET_PAYMENT_SETTINGS_REQUEST });

    const response = await axios.get("/settings/getPaymentSetting");
    dispatch({
      type: paymentSettings.GET_PAYMENT_SETTINGS_SUCCESS,
      payload: {
        withDrawalGateway:response.data.settings,
        message:response.data.message
      }, 
    });
  } catch (error) {
    dispatch({
      type: paymentSettings.GET_PAYMENT_SETTINGS_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const getPaymentSettingById = (id) => async (dispatch) => {
  try {
    dispatch({ type: paymentSettings.GET_PAYMENT_SETTING_REQUEST });

    const { data } = await axios.get(`/settings/getPaymentSetting/${id}`);

    dispatch({
      type: paymentSettings.GET_PAYMENT_SETTING_SUCCESS,
      payload: data.data, 
    });
  } catch (error) {
    dispatch({
      type: paymentSettings.GET_PAYMENT_SETTING_FAIL,
      payload:
        error.response && error.response.data.message
          ? error.response.data.message
          : error.message,
    });
  }
};

export const updatePaymentSetting = (id, paymentData) => async (dispatch) => {
  dispatch({ type: paymentSettings.UPDATE_PAYMENT_SETTING_REQUEST });
  try {
    const { data } = await axios.put(
      `/settings/updatePaymentSetting/${id}`,
      paymentData
    );
    dispatch({
      type: paymentSettings.UPDATE_PAYMENT_SETTING_SUCCESS,
      payload: data.data, 
    });
  } catch (error) {
    dispatch({
      type: paymentSettings.UPDATE_PAYMENT_SETTING_FAIL,
      payload:
        error.response?.data?.message || error.message,
    });
  }
};
