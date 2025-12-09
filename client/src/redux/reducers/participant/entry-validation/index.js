import { entryValidationReqConstants } from "src/redux/actions/constants";

const initialState = {
    loading: false,
    entryValidation: [],
    error: null,
};

const entryValidationReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }

    switch (action.type) {
        case entryValidationReqConstants.GET_REQUEST:
            return { ...state, loading: true };

        case entryValidationReqConstants.GET_SUCCESS:
            return { ...state, loading: false, entryValidation: action.payload.entryValidation };

        case entryValidationReqConstants.GET_FAILURE:
            return { ...state, loading: false, error: action.payload };
        //
        default:
            return state; // Always return a valid state
    }
};

export default entryValidationReducer;

