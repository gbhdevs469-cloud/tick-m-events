import { userConstants } from "./constants";
import axios from "../helper/axios";

export const getAllUsers = () => async (dispatch) => {
    try {
        dispatch({ type: userConstants.GET_USERS_REQUEST });

        const { data } = await axios.get('/admin');

        dispatch({
            type: userConstants.GET_USERS_SUCCESS,
            payload: data.data, 
        });
    } catch (error) {
        dispatch({
            type: userConstants.GET_USERS_FAIL,
            payload:
                error.response?.data?.message || error.message,
        });
    }
};

export const validateUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: userConstants.VALIDATE_USER_REQUEST });

    const { data } = await axios.put(`/admin/validate/${userId}`);

    dispatch({
      type: userConstants.VALIDATE_USER_SUCCESS,
      payload: data.data,
    });

    dispatch(getAllUsers());
  } catch (error) {
    dispatch({
      type: userConstants.VALIDATE_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};

export const blockUser = (userId) => async (dispatch) => {
  try {
    dispatch({ type: userConstants.BLOCK_USER_REQUEST });

    const { data } = await axios.put(`/admin/block/${userId}`);

    dispatch({
      type: userConstants.BLOCK_USER_SUCCESS,
      payload: data.data,
    });
    dispatch(getAllUsers());
  } catch (error) {
    dispatch({
      type: userConstants.BLOCK_USER_FAIL,
      payload: error.response?.data?.message || error.message,
    });
  }
};