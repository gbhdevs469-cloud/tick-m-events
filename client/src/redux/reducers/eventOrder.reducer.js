import { eventOrderConstants } from "../actions/constants";

const initialState = {
    message: '',
    order: {},
    verifiedOrders:[],
    allOrders:[]
};

const eventOrderReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        // Event bY ID FETCH
        case eventOrderConstants.GET_REQUEST:
            return { ...state };

        case eventOrderConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                verifiedOrders: action.payload.verifiedOrders,
                allOrders: action.payload.allOrders,
            };

        case eventOrderConstants.GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };
        
        case eventOrderConstants.CREATE_REQUEST:
            return { ...state };

        case eventOrderConstants.CREATE_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                order: action.payload.order,
            };

        case eventOrderConstants.CREATE_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };
        default:
            return state; // Always return a valid state
    }
};


export default eventOrderReducer;
