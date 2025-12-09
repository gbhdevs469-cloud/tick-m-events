import { authConstants, serviceReqConstants } from "../actions/constants";

const initialState = {
    profile: {},
    services: [],
    message: '',
};

const profileServiceReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case serviceReqConstants.GET_SERVICE_USERID_REQUEST:
            return { ...state };

        case serviceReqConstants.GET_SERVICE_USERID_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                services: action.payload.serviceRequests
            };

        case serviceReqConstants.GET_SERVICE_USERID_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        case authConstants.GET_REQUEST:
            return { ...state };

        case authConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                profile: action.payload.profile,
            };

        case authConstants.GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        default:
            return state; // Always return a valid state
    }
};


export default profileServiceReducer;
