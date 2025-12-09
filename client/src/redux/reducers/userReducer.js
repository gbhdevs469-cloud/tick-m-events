import { userConstants } from '../actions/constants';

const initialState = {
    users: [],
    loading: false,
    error: null,
};

export const userReducer = (state, action) => {
    if (state === undefined) {
        state = initialState;
    }

    switch (action.type) {
        case userConstants.GET_USERS_REQUEST:
            return { ...state, loading: true, error: null };

        case userConstants.GET_USERS_SUCCESS:
            return { ...state, loading: false, users: action.payload };

        case userConstants.GET_USERS_FAIL:
            return { ...state, loading: false, error: action.payload };
        // Validate User
        case userConstants.VALIDATE_USER_REQUEST:
            return { ...state, loading: true, error: null };

        case userConstants.VALIDATE_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                ),
                error: null,
            };

        case userConstants.VALIDATE_USER_FAIL:
            return { ...state, loading: false, error: action.payload };

        // Block User
        case userConstants.BLOCK_USER_REQUEST:
            return { ...state, loading: true, error: null };

        case userConstants.BLOCK_USER_SUCCESS:
            return {
                ...state,
                loading: false,
                users: state.users.map(user =>
                    user._id === action.payload._id ? action.payload : user
                ),
                error: null,
            };

        case userConstants.BLOCK_USER_FAIL:
            return { ...state, loading: false, error: action.payload };

        default:
            return state;
    }
};

