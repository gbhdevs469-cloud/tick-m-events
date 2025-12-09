import { organizerEventConstants } from "../../actions/constants";

const initialState = {
    message: '',
    eventsLists: [],
    error: null,
    loading: true
};

const editEventReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case organizerEventConstants.GET_REQUEST:
            return { ...state, loading: true };

        case organizerEventConstants.GET_SUCCESS:
            return {
                ...state,
                eventsLists: action.payload.eventsLists,
                message: action.payload.message,
                loading: false
            };

        case organizerEventConstants.GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                loading: true
            };

        default:
            return state; // Always return a valid state
    }
};


export default editEventReducer;
