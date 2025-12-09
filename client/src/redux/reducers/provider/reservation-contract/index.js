import { reservationContractsConstants } from "src/redux/actions/constants";

const initialState = {
    loading: false,
    resarvationContracts: {
        summary: {
            totalActiveProjects: 0,
            totalCompletedProjects: 0,
            overallExpectedPayments: 0
        },
        activeProjects: {
            projects: [],
            totalExpectedPayments: 0
        },
        completedProjects: {
            projects: [],
            totalExpectedPayments: 0
        }
    },
    error: null,
    message: ""
};

const reservationContractsReducer = (state , action) => {
     if (state === undefined) {
        state = initialState; // Assign initial state here
    }
    switch (action.type) {
        case reservationContractsConstants.GET_REQUEST:
            return {
                ...state,
                loading: true,
                error: null // Clear previous errors on new request
            };
        
        case reservationContractsConstants.GET_SUCCESS:
            return {
                ...state,
                loading: false,
                message: action.payload.message,
                resarvationContracts: {
                    // Ensure we always have the proper structure even if API returns partial data
                    summary: {
                        totalActiveProjects: action.payload.resarvationContracts?.summary?.totalActiveProjects || 0,
                        totalCompletedProjects: action.payload.resarvationContracts?.summary?.totalCompletedProjects || 0,
                        overallExpectedPayments: action.payload.resarvationContracts?.summary?.overallExpectedPayments || 0
                    },
                    activeProjects: {
                        projects: action.payload.resarvationContracts?.activeProjects?.projects || [],
                        totalExpectedPayments: action.payload.resarvationContracts?.activeProjects?.totalExpectedPayments || 0
                    },
                    completedProjects: {
                        projects: action.payload.resarvationContracts?.completedProjects?.projects || [],
                        totalExpectedPayments: action.payload.resarvationContracts?.completedProjects?.totalExpectedPayments || 0
                    }
                },
                error: null
            };
        
        case reservationContractsConstants.GET_FAILURE:
            return {
                ...state,
                loading: false,
                error: action.payload.error || action.payload.message, // Handle both error formats
                message: action.payload.message || "Failed to load reservation contracts"
            };

        default:
            return state;
    }
};

export default reservationContractsReducer;