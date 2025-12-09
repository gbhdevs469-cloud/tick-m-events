import { organizerEventConstants } from "../../actions/constants";

const initialState = {
    message: '',
    __events: [],
    __projectWithBids: {},
    error: null,
    loading: true,
    graph: {},
    overview: {},
    peakSalesInfo:{}
};

const pageEventReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case organizerEventConstants.GET_DASHBOARDSTATISTICS_REQUEST:
            return { ...state, loading: true };

        case organizerEventConstants.GET_DASHBOARDSTATISTICS_SUCCESS:
            return {
                ...state,
                graph: action.payload.graph,
                overview: action.payload.overview,
                message: action.payload.message,
                peakSalesInfo: action.payload.peakSalesInfo,
                loading: false
            };

        case organizerEventConstants.GET_DASHBOARDSTATISTICS_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                loading: true
            };


        case organizerEventConstants.GET_BIDS_REQUEST:
            return { ...state, loading: true };

        case organizerEventConstants.GET_BIDS_SUCCESS:
            return {
                ...state,
                __projectWithBids: action.payload.projectWithBids,
                message: action.payload.message,
                loading: false
            };

        case organizerEventConstants.GET_BIDS_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                loading: true
            };

        case organizerEventConstants.GET_ORGANIZR_EVENTS_REQUEST:
            return { ...state, loading: true };

        case organizerEventConstants.GET_ORGANIZR_EVENTS_SUCCESS:
            return {
                ...state,
                __events: action.payload.__event,
                message: action.payload.message,
                loading: false
            };

        case organizerEventConstants.GET_ORGANIZR_EVENTS_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                loading: true
            };

        default:
            return state; // Always return a valid state
    }
};


export default pageEventReducer;
