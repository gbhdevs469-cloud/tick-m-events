import { promotionConstants } from "../actions/constants";

const initialState = {
    promotions: [],
    message: '',
};

const userPersonalServiceReqReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case promotionConstants.GET_REQUEST:
            return { ...state };

        case promotionConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                promotions: action.payload.promotions
            };

        case promotionConstants.GET_FAILURE:
            return {
                ...state,
                message: action.payload.message,
            };

        default:
            return state; // Always return a valid state
    }
};


export default userPersonalServiceReqReducer;
