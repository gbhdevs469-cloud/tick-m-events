import { eventConstants } from "../actions/constants";

const initialState = {
    stepper: 0,
    message: '',
    basicDetails: [],
    fullData: [],
    wishlist: [],
    eventWithDetails: {},
    categories: [],
    category: {},
    loadingCategories: false,
    childCategories: [],
    loadingChildCategories: false,
    error: null,
    currentEvents: [],
    customizationLoading: false,
    customizationData: null,
};

const eventReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case eventConstants.EVENT_CUSTOMIZATION_FETCH_REQUEST:
            return {
                ...state,
                customizationLoading: true,
                error: null,
                customizationData: null,
            };
        case eventConstants.EVENT_CUSTOMIZATION_FETCH_SUCCESS:
            return {
                ...state,
                customizationLoading: false,
                customizationData: action.payload,
                error: null,
            };
        case eventConstants.EVENT_CUSTOMIZATION_FETCH_FAILURE:
            return {
                ...state,
                customizationLoading: true,
                error: action.payload.message,
                customizationData: null,
            };

        case eventConstants.UPDATE_VALIDATION_VIEW_REQUEST:
            return {
                ...state,
                error: null,
            };

        case eventConstants.UPDATE_VALIDATION_VIEW_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                eventWithDetails: {
                    ...state.eventWithDetails,
                    validationView: action.payload.validationView,
                }
            };

        case eventConstants.UPDATE_VALIDATION_VIEW_FAILURE:
            return {
                ...state,
                message: action.payload.message,
                error: action.payload.error,
            };

        case eventConstants.GET_TODAY_EVENT_REQUEST:
            return {
                ...state,
                error: null,
            };

        case eventConstants.GET_TODAY_EVENT_SUCCESS:
            return {
                ...state,
                currentEvents: action.payload.currentEvents,
                message: action.payload.message
            };

        case eventConstants.GET_TODAY_EVENT_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        case eventConstants.SINGLE_CATEGORY_FETCH_REQUEST:
            return {
                ...state,
                loadingCategories: true,
                error: null,
            };

        case eventConstants.SINGLE_CATEGORY_FETCH_SUCCESS:
            return {
                ...state,
                loadingCategories: false,
                category: action.payload.category,
            };

        case eventConstants.SINGLE_CATEGORY_FETCH_FAILURE:
            return {
                ...state,
                loadingCategories: false,
                error: action.payload.message,
            };

        case eventConstants.EVENT_CATEGORY_FETCH_REQUEST:
            return {
                ...state,
                loadingCategories: true,
                error: null,
            };

        case eventConstants.EVENT_CATEGORY_FETCH_SUCCESS:
            return {
                ...state,
                loadingCategories: false,
                categories: action.payload.categories,
            };

        case eventConstants.EVENT_CATEGORY_FETCH_FAILURE:
            return {
                ...state,
                loadingCategories: false,
                error: action.payload.message,
            };
        case eventConstants.CHILD_CATEGORY_FETCH_REQUEST:
            return {
                ...state,
                loadingChildCategories: true,
                error: null,
            };

        case eventConstants.CHILD_CATEGORY_FETCH_SUCCESS:
            return {
                ...state,
                loadingChildCategories: false,
                childCategories: action.payload.childCategories,
            };

        case eventConstants.CHILD_CATEGORY_FETCH_FAILURE:
            return {
                ...state,
                loadingChildCategories: false,
                error: action.payload.message,
            };

        // Event bY ID FETCH
        case eventConstants.EVENT_BY_ID_REQUEST:
            return { ...state };

        case eventConstants.EVENT_BY_ID_SUCCESS:
            return {
                ...state,
                eventWithDetails: action.payload.eventWithDetails,
            };

        case eventConstants.EVENT_BY_ID_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        // Event Wishlist fetch
        case eventConstants.WISHLIST_GET_REQUEST:
            return { ...state };

        case eventConstants.WISHLIST_GET_SUCCESS:
            return {
                ...state,
                wishlist: action.payload.wishlist,
            };

        case eventConstants.WISHLIST_GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        // Event Create
        case eventConstants.EVENT_CREATE_REQUEST:
            return { ...state };

        case eventConstants.EVENT_CREATE_SUCCESS:
            return {
                ...state,
                stepper: action.payload.stepper,
            };

        case eventConstants.EVENT_CREATE_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        // Get Events
        case eventConstants.EVENT_GET_REQUEST:
            return { ...state };

        case eventConstants.EVENT_GET_SUCCESS:
            return {
                ...state,
                basicDetails: action.payload.basicDetails,
                fullData: action.payload.fullData,
            };

        case eventConstants.EVENT_GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        // Event Ticket Create
        case eventConstants.TICKET_CONFIG_CREATE_REQUEST:
            return { ...state };

        case eventConstants.TICKET_CONFIG_CREATE_SUCCESS:
            return {
                ...state,
                stepper: action.payload.stepper,
            };

        case eventConstants.TICKET_CONFIG_CREATE_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        // Event Ticket Custommization Create
        case eventConstants.EVENT_CUSTOMIZTION_CREATE_REQUEST:
            return { ...state };

        case eventConstants.EVENT_CUSTOMIZTION_CREATE_SUCCESS:
            return {
                ...state,
                stepper: action.payload.stepper,
            };

        case eventConstants.EVENT_CUSTOMIZTION_CREATE_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        // Event publication Create
        case eventConstants.PUBLISH_CREATE_REQUEST:
            return { ...state };

        case eventConstants.PUBLISH_CREATE_SUCCESS:
            return {
                ...state,
                stepper: action.payload.stepper,
            };

        case eventConstants.PUBLISH_CREATE_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };
        default:
            return state; // Always return a valid state
    }
};


export default eventReducer;
