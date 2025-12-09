import { messageConstants } from '../actions/constants'

const initialState = {
    messages: {},
    conv: [],
    userList: [],
    loading: true,
    error: null,
    message: ''
};
const fetchMessagesReducers = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case messageConstants.FETCH_CONV_USER_REQUEST:
            return {
                ...state,
                error: null,
            };
        case messageConstants.FETCH_CONV_USER_SUCCESS:
            return {
                ...state,
                userList: action.payload.userList,
            };
        case messageConstants.FETCH_CONV_USER_FAILURE:
            return {
                ...state,
                error: action.payload.error,
            };

        case messageConstants.FETCH_CONV_REQUEST:
            return {
                ...state,
                error: null,
            };
        case messageConstants.FETCH_CONV_SUCCESS:
            return {
                ...state,
                conv: action.payload.conv,
            };
        case messageConstants.FETCH_CONV_FAILURE:
            return {
                ...state,
                error: action.payload.error,
            };

        case messageConstants.FETCH_MESSAGES_REQUEST:
            return {
                ...state,
                loading: true,
                error: null,
            }
        case messageConstants.FETCH_MESSAGES_SUCCESS:
            return {
                ...state,
                messages: {
                    messages: action.payload.userMessages,
                    receiver: action.payload.receiver,
                    conversationId: action.payload.conversationId,
                },
                message: action.payload.message,
                loading: false
            }
        case messageConstants.FETCH_MESSAGES_FAILURE:
            return {
                ...state,
                loading: true,
                error: action.payload.error,
            }
        default: state = {
            ...state,
        }
    }
    return state
}

export default fetchMessagesReducers;
