import { rewardConstants } from "./constants";
import axios from "../helper/axios";

export const fetchUserPoints = () => async (dispatch) => {
  dispatch({ type: rewardConstants.FETCH_USER_POINTS_REQUEST });

  try {
    const response = await axios.get("/loyalty/allPoints");

    dispatch({
      type: rewardConstants.FETCH_USER_POINTS_SUCCESS,
      payload: response.data.points,
    });

    return {
      type: rewardConstants.FETCH_USER_POINTS_SUCCESS,
      status: response.status,
      message: response.data.message || "User points fetched successfully",
      payload: response.data.points,
    };
  } catch (error) {
    dispatch({
      type: rewardConstants.FETCH_USER_POINTS_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Failed to fetch points",
        error: error?.response?.status || 500,
      },
    });

    return {
      type: rewardConstants.FETCH_USER_POINTS_FAILURE,
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch points",
    };
  }
};

export const fetchAvailableRewards = () => async (dispatch) => {
  dispatch({ type: rewardConstants.FETCH_REWARDS_REQUEST });

  try {
    const response = await axios.get("/loyalty/available");
    console.log("fetchAvailableRewards response.data:", response.data);

    dispatch({
      type: rewardConstants.FETCH_REWARDS_SUCCESS,
      payload: {
        rewards: response.data.rewards,   // already merged with txn
        totalPoints: response.data.totalPoints,
      },
    });

    return {
      type: rewardConstants.FETCH_REWARDS_SUCCESS,
      status: response.status,
      message: response.data.message,
      payload: {
        rewards: response.data.rewards,
        totalPoints: response.data.totalPoints,
      },
    };
  } catch (error) {
    dispatch({
      type: rewardConstants.FETCH_REWARDS_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Failed to fetch rewards",
        error: error?.response?.status || 500,
      },
    });

    return {
      type: rewardConstants.FETCH_REWARDS_FAILURE,
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to fetch rewards",
    };
  }
};

export const fetchRewardHistory = () => async (dispatch) => {
  dispatch({ type: rewardConstants.FETCH_REWARD_HISTORY_REQUEST });

  try {
    const response = await axios.get("/loyalty/history");

    dispatch({
      type: rewardConstants.FETCH_REWARD_HISTORY_SUCCESS,
      payload: response.data.history,
    });

    return {
      type: rewardConstants.FETCH_REWARD_HISTORY_SUCCESS,
      status: response.status,
      message: response.data.message,
      payload: response.data.history,
    };
  } catch (error) {
    dispatch({
      type: rewardConstants.FETCH_REWARD_HISTORY_FAILURE,
      payload: {
        message:
          error?.response?.data?.message || "Failed to fetch reward history",
        error: error?.response?.status || 500,
      },
    });

    return {
      type: rewardConstants.FETCH_REWARD_HISTORY_FAILURE,
      status: error?.response?.status || 500,
      message:
        error?.response?.data?.message || "Failed to fetch reward history",
    };
  }
};

export const redeemReward = (rewardId, code,discountValue, discountType) => async (dispatch) => {
  dispatch({ type: rewardConstants.REDEEM_REWARD_REQUEST });
 
  try {
    const response = await axios.post("/loyalty/redeemCode", {
      rewardId,
      code,
      discountValue,
      discountType,
    });
 
       console.log("🎯 Redeem API Response:", response.data);
         dispatch({
      type: rewardConstants.REDEEM_REWARD_SUCCESS,
      payload: response.data,
    });
 
    return {
      type: rewardConstants.REDEEM_REWARD_SUCCESS,
      status: response.status,
      ...response.data, // success, code, message
    };
  } catch (error) {
    dispatch({
      type: rewardConstants.REDEEM_REWARD_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Failed to redeem reward",
        error: error?.response?.status || 500,
      },
    });
 
    return {
      type: rewardConstants.REDEEM_REWARD_FAILURE,
      status: error?.response?.status || 500,
      message: error?.response?.data?.message || "Failed to redeem reward",
    };
  }
};