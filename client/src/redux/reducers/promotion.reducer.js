import { promotionConstants } from "../actions/constants";

const initialState = {
    promotions: [],
    message: '',
    eventsWithOrdersAndParticiapnt: [],
    loading: true
};

const promotionReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case promotionConstants.GET_EVENTS_REQUEST:
            return {
                ...state,
                loading: true
            };

        case promotionConstants.GET_EVENTS_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                loading: false,
                eventsWithOrdersAndParticiapnt: action.payload.eventsWithOrdersAndParticiapnt
            };

        case promotionConstants.GET_EVENTS_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                loading: true
            };

        case promotionConstants.GET_REQUEST:
            return {
                ...state,
                loading: true
            };

        case promotionConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                loading: false,
                promotions: action.payload.promotions
            };

        case promotionConstants.GET_FAILURE:
            return {
                ...state,
                loading: true,
                message: action.payload.message,
            };

        default:
            return state; // Always return a valid state
    }
};


export default promotionReducer;
