import { homeAndRecomConstants } from "../actions/constants";

const initialState = {
    message: '',
    upcomingEvents: [],
    popularEvents: [],
    recommendedEvents: [],
    latestEvents: [],
    latestSales: [],
    analytics: {},
    upcomingHomeEvents: [],
    popularHomeEvents: [],
    latestHomeEvents: [],

    loading: false,

};

const homeAndRecommandationReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case homeAndRecomConstants.PUBLIC_GET_REQUEST:
            return { ...state, loading: true };

        case homeAndRecomConstants.PUBLIC_GET_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                upcomingHomeEvents: action.payload.upcomingHomeEvents,
                popularHomeEvents: action.payload.popularHomeEvents,
                latestHomeEvents: action.payload.latestHomeEvents,

            };

        case homeAndRecomConstants.PUBLIC_GET_FAILURE:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
            };

        // Event bY ID FETCH
        case homeAndRecomConstants.GET_LATEST_SALES_REQUEST:
            return { ...state };

        case homeAndRecomConstants.GET_LATEST_SALES_SUCCESS:
            return {
                ...state,
                latestSales: action.payload.latestSales,
            };

        case homeAndRecomConstants.GET_LATEST_SALES_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        case homeAndRecomConstants.GET_REQUEST:
            return { ...state };

        case homeAndRecomConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                upcomingEvents: action.payload.upcomingEvents,
                popularEvents: action.payload.popularEvents,
                recommendedEvents: action.payload.recommendedEvents,
                latestEvents: action.payload.latestEvents,
                analytics: action.payload.analytics,
            };

        case homeAndRecomConstants.GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };
        default:
            return state; // Always return a valid state
    }
};


export default homeAndRecommandationReducer;
