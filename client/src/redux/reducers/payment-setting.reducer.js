import { paymentSettings } from "../actions/constants";

const initialState = {
    loading: false,
    success: false,
    error: null,
    paymentSettings: null,
    withDrawalGateway: [],
    paymentSettingDetail: null,
};

export const paymentSettingsReducer = (state, action) => {
    if (typeof state === 'undefined') {
        state = initialState;
    }

    switch (action.type) {
        case paymentSettings.DELETE_PAYMENT_SETTING_SUCCESS:
            return {
                ...state,
                settings: state.settings.filter(
                    (setting) => setting._id !== action.payload
                ),
            };
        case paymentSettings.SAVE_PAYMENT_SETTINGS_REQUEST:
            return { ...state, loading: true, success: false, error: null };

        case paymentSettings.SAVE_PAYMENT_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                paymentSettings: action.payload,
            };

        case paymentSettings.SAVE_PAYMENT_SETTINGS_FAIL:
            return { ...state, loading: false, error: action.payload };
        case paymentSettings.GET_PAYMENT_SETTINGS_REQUEST:
            return { ...state, loading: true, error: null };

        case paymentSettings.GET_PAYMENT_SETTINGS_SUCCESS:
            return {
                ...state,
                loading: false,
                withDrawalGateway: action.payload.withDrawalGateway,
            };

        case paymentSettings.GET_PAYMENT_SETTINGS_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case paymentSettings.GET_PAYMENT_SETTING_REQUEST:
            return { ...state, loading: true, error: null };

        case paymentSettings.GET_PAYMENT_SETTING_SUCCESS:
            return {
                ...state,
                loading: false,
                paymentSettingDetail: action.payload,
            };

        case paymentSettings.GET_PAYMENT_SETTING_FAIL:
            return {
                ...state,
                loading: false,
                error: action.payload,
            };

        case paymentSettings.UPDATE_PAYMENT_SETTING_REQUEST:
            return { ...state, loading: true, error: null };
        case paymentSettings.UPDATE_PAYMENT_SETTING_SUCCESS:
            return {
                ...state,
                loading: false,
                success: true,
                paymentSettingDetail: action.payload,
                settings: state.settings.map((s) =>
                    s._id === action.payload._id ? action.payload : s
                ),
            };
        case paymentSettings.UPDATE_PAYMENT_SETTING_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};
