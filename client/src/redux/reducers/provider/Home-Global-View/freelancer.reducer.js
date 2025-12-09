import { placeABidConstants, providerProposalConstants, statisticsPerformanceConstants } from "src/redux/actions/constants";

const initialState = {
    loading: false,
    statistics: {},
    _projects: [],
    _mybids: [],
    _project: {},
    error: null,
    message: ""
};

const placeABidReducer = (state, action) => {
    if (state === undefined) {
        state = initialState; // Assign initial state here
    }

    switch (action.type) {
        case statisticsPerformanceConstants.GET_REQUEST:
            return {
                ...state,
                loading: true
            };
        case statisticsPerformanceConstants.GET_SUCCESS:
            return {
                ...state,
                message: action.payload.message,
                statistics: action.payload.statistics,
                loading: false
            };
        case statisticsPerformanceConstants.GET_FAILURE:
            return {
                ...state,
                error: action.payload.error,
                loading: true
            };

        case providerProposalConstants.UPDATE_MYBID_REQUEST:
            return { ...state, loading: true };

        case providerProposalConstants.UPDATE_MYBID_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                // Optionally update the specific bid in _mybids
                _mybids: state._mybids.map((bid) =>
                    bid._id === action.payload.updatedBid._id ? action.payload.updatedBid : bid
                ),
            };

        case providerProposalConstants.UPDATE_MYBID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case providerProposalConstants.GET_MYBIDS_REQUEST:
            return { ...state, loading: true };

        case providerProposalConstants.GET_MYBIDS_SUCCESS:
            return {
                ...state,
                loading: false,
                _mybids: action.payload.mybids,
                message: action.payload.message
            };

        case providerProposalConstants.GET_MYBIDS_FAILURE:
            return { ...state, loading: false, error: action.payload };


        case placeABidConstants.GET_PROJECTBYID_REQUEST:
            return { ...state, loading: true };

        case placeABidConstants.GET_PROJECTBYID_SUCCESS:
            return {
                ...state,
                loading: false,
                _project: action.payload.project,
                message: action.payload.message
            };

        case placeABidConstants.GET_PROJECTBYID_FAILURE:
            return { ...state, loading: false, error: action.payload };

        case placeABidConstants.GET_REQ_REQUEST:
            return { ...state, loading: true };

        case placeABidConstants.GET_REQ_SUCCESS:
            return {
                ...state,
                loading: false,
                _projects: action.payload.projects,
                message: action.payload.message
            };

        case placeABidConstants.GET_REQ_FAILURE:
            return { ...state, loading: false, error: action.payload };

        default:
            return state; // Always return a valid state
    }
};

export default placeABidReducer;

