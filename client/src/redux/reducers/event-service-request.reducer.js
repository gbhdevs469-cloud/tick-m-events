import { serviceRequestConstants } from "../actions/constants";

const initialState = {
    message: '',
    completedRequests: [],
    signedReqests: [],
    pendingRequests: [],
    totalRequests: [],
    allActiveProjects: [],
    proposal: null,
    total: 0,
    currentPage: 1,
    error: '',
    loading: false,
    organizerRequests: [],
    orgLoading: false,
    accepedProviderReq: [],
    activeContracts: [],
};

const eventServiceRequestReducer = (state, action) => {
    if (typeof state === 'undefined') {
        state = initialState;
    }
    switch (action.type) {
        case serviceRequestConstants.ACTIVE_CONTRACTS_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case serviceRequestConstants.ACTIVE_CONTRACTS_SUCCESS:
            return {
                ...state,
                loading: false,
                activeContracts: action.payload.activeContracts,
            };

        case serviceRequestConstants.ACTIVE_CONTRACTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };
        case serviceRequestConstants.PROVIDER_ACCEPTED_REQUEST:
            return {
                ...state,
                loading: true,
            };

        case serviceRequestConstants.PROVIDER_ACCEPTED_SUCCESS:
            return {
                ...state,
                loading: false,
                accepedProviderReq: action.payload.accepedProviderReq,
            };

        case serviceRequestConstants.PROVIDER_ACCEPTED_FAILURE:
            return {
                ...state,
                loading: false,  // fix: loading false on failure
                error: action.payload.message,
            };

        // GET requested services by provider
        case serviceRequestConstants.GET_REQUESTED_SERVICE_REQUEST:
            return { ...state, loading: true };

        case serviceRequestConstants.GET_REQUESTED_SERVICE_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                allActiveProjects: action.payload.allActiveProjects,
                completedRequests: action.payload.completedRequests,
                signedReqests: action.payload.signedReqests,
                pendingRequests: action.payload.pendingRequests,
                totalRequests: action.payload.totalRequests
            };

        case serviceRequestConstants.GET_REQUESTED_SERVICE_FAILURE:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                error: action.payload.error,
            };

        // Organizer sends request to provider
        case serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_REQUEST:
            return { ...state, loading: true };

        case serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
            };

        case serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        // Get proposal by ID
        case serviceRequestConstants.GET_PROPOSAL_BY_ID_REQUEST:
            return { ...state, loading: true, proposal: null };

        case serviceRequestConstants.GET_PROPOSAL_BY_ID_SUCCESS:
            return {
                ...state,
                loading: false,
                proposal: action.payload,
            };

        case serviceRequestConstants.GET_PROPOSAL_BY_ID_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        // Update proposal
        case serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_REQUEST:
            return { ...state, loading: true };

        case serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_SUCCESS:
            return {
                ...state,
                loading: false,
                proposal: action.payload,
                message: "Proposal updated successfully.",
            };

        case serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        // Get organizer requests
        case serviceRequestConstants.GET_ORGANIZER_REQUESTS_REQUEST:
            return { ...state, loading: true };

        case serviceRequestConstants.GET_ORGANIZER_REQUESTS_SUCCESS:
            return {
                ...state,
                loading: false,
                organizerRequests: action.payload.requests,
                total: action.payload.total,
                currentPage: action.payload.currentPage,
            };

        case serviceRequestConstants.GET_ORGANIZER_REQUESTS_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        case serviceRequestConstants.UPDATE_ORGANIZER_DECISION_REQUEST:
            return { ...state, loading: true };

        case serviceRequestConstants.UPDATE_ORGANIZER_DECISION_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                requests: state.requests.map((req) =>
                    req._id === action.payload.updatedRequest._id ? action.payload.updatedRequest : req
                ),
                organizerRequests: state.organizerRequests.map((req) =>
                    req._id === action.payload.updatedRequest._id ? action.payload.updatedRequest : req
                ),
            };

        case serviceRequestConstants.UPDATE_ORGANIZER_DECISION_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        case serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_REQUEST:
            return { ...state, loading: true };

        case serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                requests: state.requests.map((req) =>
                    req._id === action.payload.updatedRequest._id
                        ? action.payload.updatedRequest
                        : req
                ),
                organizerRequests: state.organizerRequests.map((req) =>
                    req._id === action.payload.updatedRequest._id
                        ? action.payload.updatedRequest
                        : req
                ),
            };

        case serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.message,
            };

        default:
            return state;
    }
};

export default eventServiceRequestReducer;
