import { transactionPaymentConstants } from "../actions/constants";

const initialState = {
  withdrawals: [],
  withdrawal: {},
  loading: false,
  error: null,
  message: '',
};

const transactionPaymentReducer = (state, action) => {
  if (state === undefined) {
    state = initialState; // Assign initial state here
  }

  switch (action.type) {
    case transactionPaymentConstants.GET_LOGGED_USER_WITHDRAWALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.GET_LOGGED_USER_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawals: action.payload,
      };

    case transactionPaymentConstants.GET_LOGGED_USER_WITHDRAWALS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // CREATE WITHDRAWAL
    case transactionPaymentConstants.PROCESS_WITHDRAWAL_PAYOUT_REQUEST:
      return {
        ...state,
        payoutProcessing: true,
        payoutError: null
      };

    case transactionPaymentConstants.PROCESS_WITHDRAWAL_PAYOUT_SUCCESS:
      return {
        ...state,
        payoutProcessing: false,
        payoutSuccess: true
      };

    case transactionPaymentConstants.PROCESS_WITHDRAWAL_PAYOUT_FAILURE:
      return {
        ...state,
        payoutProcessing: false,
        payoutError: action.payload
      };

    case transactionPaymentConstants.CREATE_WITHDRAWAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.CREATE_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message || 'Withdrawal created successfully',
        withdrawal: { withdrawalId: action.payload.withdrawalId },

      };

    case transactionPaymentConstants.CREATE_WITHDRAWAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    case transactionPaymentConstants.VERIFY_WITHDRAWAL_OTP_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.VERIFY_WITHDRAWAL_OTP_SUCCESS:
      return {
        ...state,
        loading: false,
        message: action.payload.message || 'OTP verified successfully',
        // You might want to add any additional state update here
      };

    case transactionPaymentConstants.VERIFY_WITHDRAWAL_OTP_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // GET WITHDRAWAL BY ID
    case transactionPaymentConstants.GET_WITHDRAWAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.GET_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawal: action.payload,
      };

    case transactionPaymentConstants.GET_WITHDRAWAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // GET ALL WITHDRAWALS BY USER
    case transactionPaymentConstants.GET_USER_WITHDRAWALS_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.GET_USER_WITHDRAWALS_SUCCESS:
      return {
        ...state,
        loading: false,
        withdrawals: action.payload,
      };

    case transactionPaymentConstants.GET_USER_WITHDRAWALS_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // APPROVE WITHDRAWAL
    case transactionPaymentConstants.APPROVE_WITHDRAWAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.APPROVE_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        message: 'Withdrawal approved successfully',
      };

    case transactionPaymentConstants.APPROVE_WITHDRAWAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    // REJECT WITHDRAWAL
    case transactionPaymentConstants.REJECT_WITHDRAWAL_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
      };

    case transactionPaymentConstants.REJECT_WITHDRAWAL_SUCCESS:
      return {
        ...state,
        loading: false,
        message: 'Withdrawal rejected successfully',
      };

    case transactionPaymentConstants.REJECT_WITHDRAWAL_FAILURE:
      return {
        ...state,
        loading: false,
        error: action.payload,
      };

    default:
      return state;
  }
};

export default transactionPaymentReducer;
