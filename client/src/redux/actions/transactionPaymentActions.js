import axios from "../helper/axios";
import { transactionPaymentConstants } from "./constants";

// Create Withdrawal Action
export const createWithdrawal = (withdrawalData) => async (dispatch) => {
  dispatch({ type: transactionPaymentConstants.CREATE_WITHDRAWAL_REQUEST });

  try {
    const response = await axios.post("/transaction-payment/withdrawals", withdrawalData);

    dispatch({
      type: transactionPaymentConstants.CREATE_WITHDRAWAL_SUCCESS,
      payload: {
        message: response?.data?.message || "Withdrawal created successfully",
        withdrawal: response?.data?.withdrawal, // optional: include withdrawal details if available
      },
    });

    return {
      type: transactionPaymentConstants.CREATE_WITHDRAWAL_SUCCESS,
      message: response?.data?.message || "Withdrawal created successfully",
      withdrawal: response?.data?.withdrawal,
    };
  } catch (error) {
    const message = error?.response?.data?.message || "Server error";
    const status = error?.response?.status || 500;

    dispatch({
      type: transactionPaymentConstants.CREATE_WITHDRAWAL_FAILURE,
      payload: { message, error: status },
    });

    return null;
  }
};

export const sendWithdrawalOTP = async (userId, otp) => {
  try {
    const response = await axios.post("/transaction-payment/send-otp", { userId, otp });
    return response.data;
  } catch (error) {
    const message = error?.response?.data?.message || "OTP verification failed";
    return { success: false, message };
  }
};

export const verifyWithdrawalOTP = (userId, otp) => async (dispatch) => {
  dispatch({ type: transactionPaymentConstants.VERIFY_WITHDRAWAL_OTP_REQUEST });

  try {
    const response = await axios.post("/transaction-payment/verify-otp-code", { userId, otp });

    dispatch({
      type: transactionPaymentConstants.VERIFY_WITHDRAWAL_OTP_SUCCESS,
      payload: {
        message: response.data.message,
      },
    });

    return {
      success: true,
      message: response.data.message,
    };
  } catch (error) {
    const message = error?.response?.data?.message || "OTP verification failed";

    dispatch({
      type: transactionPaymentConstants.VERIFY_WITHDRAWAL_OTP_FAILURE,
      payload: { message },
    });

    return {
      success: false,
      message,
    };
  }
};

export const getAllWithdrawals = () => async (dispatch) => {
  dispatch({ type: transactionPaymentConstants.GET_USER_WITHDRAWALS_REQUEST });

  try {
    const response = await axios.get("/transaction-payment/get-withdrawals");

    dispatch({
      type: transactionPaymentConstants.GET_USER_WITHDRAWALS_SUCCESS,
      payload: response.data.data // this must be the array
    });
  } catch (error) {
    console.error("❌ Error fetching withdrawals:", error);
    dispatch({
      type: transactionPaymentConstants.GET_USER_WITHDRAWALS_FAILURE,
      payload: error?.response?.data?.message || "Server error"
    });
  }
};

export const processWithdrawalPayout = (withdrawalId) => async (dispatch) => {
  dispatch({ type: transactionPaymentConstants.PROCESS_WITHDRAWAL_PAYOUT_REQUEST });

  try {
    const { data } = await axios.post(`/transaction-payment/withdrawals/${withdrawalId}/payout`);

    dispatch({
      type: transactionPaymentConstants.PROCESS_WITHDRAWAL_PAYOUT_SUCCESS,
      payload: {
        withdrawalId,
        message: data.message
      }
    });

    dispatch(getAllWithdrawals());

  } catch (error) {
    // 🧠 Smart error message selection
    const errorMessage =
      error?.response?.data?.data?.message ||  // <- From Fapshi
      error?.response?.data?.message ||        // <- From your own API
      error?.message ||                        // <- Axios / generic error
      "Payout failed";

    dispatch({
      type: transactionPaymentConstants.PROCESS_WITHDRAWAL_PAYOUT_FAILURE,
      payload: errorMessage
    });

    throw new Error(errorMessage);
  }
};

export const getUserWithdrawals = () => async (dispatch) => {
  dispatch({ type: transactionPaymentConstants.GET_LOGGED_USER_WITHDRAWALS_REQUEST });

  try {
    const response = await axios.get("/transaction-payment/get-user-withdrawals");
    dispatch({
      type: transactionPaymentConstants.GET_LOGGED_USER_WITHDRAWALS_SUCCESS,
      payload: response.data.data,
    });
  } catch (error) {
    dispatch({
      type: transactionPaymentConstants.GET_LOGGED_USER_WITHDRAWALS_FAILURE,
      payload: error?.response?.data?.message || "Server error",
    });
  }
};

