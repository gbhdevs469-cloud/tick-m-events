import { verificationConstants } from "../actions/constants";

const initialState = {
    loading: false,
    data: [],
    error: null,
    approveLoading: false,
    approveError: null,
    rejectLoading: false,
    rejectError: null,
};

export const adminVerificationListReducer = (state, action) => {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case verificationConstants.ADMIN_VERIFICATIONS_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            };

        case verificationConstants.ADMIN_VERIFICATIONS_SUCCESS:
            return {
                ...state,
                loading: false,
                data: action.payload.data,
                error: null,
            };

        case verificationConstants.ADMIN_VERIFICATIONS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        case verificationConstants.ADMIN_APPROVE_IDENTITY_REQUEST:
            return {
                ...state,
                approveLoading: true,
                approveError: null,
            };

        case verificationConstants.ADMIN_APPROVE_IDENTITY_SUCCESS:
            return {
                ...state,
                approveLoading: false,
                data: state.data.map((v) =>
                    v._id === action.payload._id ? action.payload : v
                ),
            };

        case verificationConstants.ADMIN_APPROVE_IDENTITY_FAIL:
            return {
                ...state,
                approveLoading: false,
                approveError: action.payload.message,
            };

        // reject
        case verificationConstants.ADMIN_REJECT_IDENTITY_REQUEST:
            return {
                ...state,
                approveLoading: true,  
                approveError: null,    
            };

        case verificationConstants.ADMIN_REJECT_IDENTITY_SUCCESS:
            return {
                ...state,
                approveLoading: false,
                data: state.data.map((v) =>
                    v._id === action.payload._id ? action.payload : v
                ),
            };

        case verificationConstants.ADMIN_REJECT_IDENTITY_FAIL:
            return {
                ...state,
                approveLoading: false,
                approveError: action.payload.message,
            };

        default:
            return state;
    }
};

