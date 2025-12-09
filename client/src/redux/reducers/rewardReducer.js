import { rewardConstants } from "../actions/constants";

const initialState = {
    loading: false,
    rewards: [],
    history: [],
    points: 0,
    redeeming: false,
    redeemedCode: null,
    error: null,
};

export const rewardReducer = (state, action) => {
    if (state === undefined) {
        state = initialState;
    }
    switch (action.type) {
        case rewardConstants.FETCH_REWARDS_REQUEST:
        case rewardConstants.FETCH_REWARD_HISTORY_REQUEST:
        case rewardConstants.FETCH_USER_POINTS_REQUEST:
            return { ...state, loading: true, error: null };

        case rewardConstants.FETCH_REWARDS_SUCCESS:
            return {
                ...state,
                loading: false,
                rewards: action.payload.rewards,  
                totalPoints: action.payload.totalPoints,
            };

        case rewardConstants.FETCH_REWARD_HISTORY_SUCCESS:
            return { ...state, loading: false, history: action.payload };

        case rewardConstants.FETCH_USER_POINTS_SUCCESS:
            return { ...state, loading: false, points: action.payload };

        case rewardConstants.FETCH_REWARDS_FAILURE:
        case rewardConstants.FETCH_REWARD_HISTORY_FAILURE:
        case rewardConstants.FETCH_USER_POINTS_FAILURE:
            return { ...state, loading: false, error: action.payload };

        // Redeem flow
        case rewardConstants.REDEEM_REWARD_REQUEST:
            return { ...state, redeeming: true, redeemedCode: null };

        case rewardConstants.REDEEM_REWARD_SUCCESS:
            return { ...state, redeeming: false, redeemedCode: action.payload };

        case rewardConstants.REDEEM_REWARD_FAILURE:
            return { ...state, redeeming: false, error: action.payload };
        default:
            return state;
    }
};
