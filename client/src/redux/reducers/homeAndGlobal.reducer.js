import { HomeAndGlobalConstants } from '../actions/constants'

const initialState = {
    contracts: [],
    loading: true,
    error: null,
    message: ''
};
const homeAndGlobalReducers = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case HomeAndGlobalConstants.GET_REQUEST:
            return {
                ...state,
                loading: true
            };
        case HomeAndGlobalConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                contracts: action.payload.contracts,
                loading: false
            };
        case HomeAndGlobalConstants.GET_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                loading: true
            };
        default: state = {
            ...state,
        }
    }
    return state
}

export default homeAndGlobalReducers;
