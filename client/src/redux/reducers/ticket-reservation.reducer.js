import { ticketTypeConstants } from "../actions/constants";

const initialState = {
    message: '',
    tickets: [],
    ticketWiseRevenue:[]
};

const ticketTypeReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case ticketTypeConstants.UPDATE_REFUND_POLICY_REQUEST:
            return { ...state, loading: true };

        case ticketTypeConstants.UPDATE_REFUND_POLICY_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                updatedPolicy: action.payload.data,
            };

        case ticketTypeConstants.UPDATE_REFUND_POLICY_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        // Event bY ID FETCH
        case ticketTypeConstants.GET_REQUEST:
            return { ...state };

        case ticketTypeConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                tickets: action.payload.data,
                ticketWiseRevenue: action.payload.ticketWiseRevenue,
            };

        case ticketTypeConstants.GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };
        default:
            return state; // Always return a valid state
    }
};


export default ticketTypeReducer;
