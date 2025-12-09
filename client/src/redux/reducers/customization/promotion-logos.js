import { customizationConstants } from "src/redux/actions/constants";

const initialState = {
    promotionLogos: [],
    loading: true,
    error: null
};

const customizationReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case customizationConstants.GET_PROMOTION_LOGOS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case customizationConstants.GET_PROMOTION_LOGOS_SUCCESS:
            return {
                ...state,
                loading: false,
                promotionLogos: action.payload,
                error: null,
            };

        case customizationConstants.GET_PROMOTION_LOGOS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state; // Always return a valid state
    }
};


export default customizationReducer;