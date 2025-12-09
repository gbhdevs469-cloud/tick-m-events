import { authConstants } from "./constants";
import axios from "../helper/axios";
import { saveUserFcmToken } from './notification.actions';

// Checking SINGUP login or not
export const updateProAvatar = (data) => async (dispatch) => {
    dispatch({ type: authConstants.UPDATE_AVATAR_REQUEST });

    try {
        const response = await axios.put("/auth/avatar", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: authConstants.UPDATE_AVATAR_SUCCESS,
            payload: { message: response?.data?.message },
        });
        return {
            type: authConstants.UPDATE_AVATAR_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: authConstants.UPDATE_AVATAR_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: authConstants.UPDATE_AVATAR_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const updateProCover = (data) => async (dispatch) => {
    dispatch({ type: authConstants.UPDATE_COVER_REQUEST });

    try {
        const response = await axios.put("/auth/cover", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response,'cover');
        
        dispatch({
            type: authConstants.UPDATE_COVER_SUCCESS,
            payload: { message: response?.data?.message },
        });
        return {
            type: authConstants.UPDATE_COVER_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: authConstants.UPDATE_COVER_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: authConstants.UPDATE_COVER_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

// Checking SINGUP login or not
export const signup = (data) => async (dispatch) => {
    dispatch({ type: authConstants.SIGNUP_REQUEST });
    try {
        const response = await axios.post("/auth/signup", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        dispatch({
            type: authConstants.SIGNUP_SUCCESS,
            payload: { message: response?.data?.message },
        });

        return {
            type: authConstants.SIGNUP_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };

    } catch (error) {
        dispatch({
            type: authConstants.SIGNUP_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: authConstants.SIGNUP_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

// Checking admin login or not
export const login = (data) => async (dispatch) => {
    const { email, password } = data;

    dispatch({ type: authConstants.LOGIN_REQUEST });

    try {
        const response = await axios.post("/auth/login", { email, password });
        const { token, user, message, expiresIn } = response.data;

        // Calculate expiration time (current time + expiresIn)
        const expirationTime = Date.now() + expiresIn;

        // Store token and expiration time in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("expiresAt", expirationTime.toString());

        // Set a timer to log the user out when the token expires
        const timeout = setTimeout(() => {
            dispatch(logout()); // Dispatch logout action when the token expires
        }, expiresIn);

        // Store the timeout ID in localStorage (to clear it on logout)
        localStorage.setItem("logoutTimer", timeout);

        // ✅ Dispatch success
        dispatch({
            type: authConstants.LOGIN_SUCCESS,
            payload: { token, user, message },
        });
        if (user?._id && user?.email) {
            dispatch(saveUserFcmToken(user._id, user.email));
        }
        // ✅ Explicitly return the response data
        return {
            type: authConstants.LOGIN_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };

    } catch (error) {
        // Dispatch failure
        dispatch({
            type: authConstants.LOGIN_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: authConstants.LOGIN_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

// Logout action
export const logout = () => async (dispatch) => {
    dispatch({ type: authConstants.LOGOUT_REQUEST });

    try {
        await axios.post("/auth/logout"); // Call the backend logout API
    } catch (error) {
        console.error("Logout error:", error);
    }

    // Clear authentication data
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiresAt");

    // Clear the logout timer
    const timeout = localStorage.getItem("logoutTimer");
    if (timeout) {
        clearTimeout(Number(timeout));
        localStorage.removeItem("logoutTimer");
    }

    dispatch({ type: authConstants.LOGOUT_SUCCESS });
};

// User login or not
export const isUserLoggedIn = () => async (dispatch) => {
    const token = localStorage.getItem("token");
    const user = token ? JSON.parse(localStorage.getItem("user") || "{}") : null;

    dispatch({
        type: token ? authConstants.LOGIN_SUCCESS : authConstants.LOGIN_FAILURE,
        payload: token ? { token, user } : { message: "Failed to login!!!" },
    });
};

export const validateReferralCode = (code) => async (dispatch) => {
    try {
        const response = await axios.get(`/auth/validate-referral/${code}`);
        return response.data;
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Error validating referral code'
        };
    }
};

export const verifyResetCode = (email, code) => async (dispatch) => {
    dispatch({ type: authConstants.VERIFY_CODE_REQUEST });
    try {
        const response = await axios.post('/auth/verify-reset-code', { email, code });

        dispatch({ type: authConstants.VERIFY_CODE_SUCCESS, payload: response.data.message });
        return {
            type: authConstants.VERIFY_CODE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({ type: authConstants.VERIFY_CODE_FAILURE, payload: error.response?.data?.message || 'Error verifying code' });
        return {
            type: authConstants.VERIFY_CODE_FAILURE,
            status: error.status,
            error: error?.response?.data?.message
        };
    }
}
export const resetPassword = (email, code, newPassword) => async (dispatch) => {
    dispatch({ type: authConstants.RESET_PASSWORD_REQUEST });
    try {
        const response = await axios.post('/auth/reset-password', { email, code, newPassword });
        console.log(response);

        dispatch({ type: authConstants.RESET_PASSWORD_SUCCESS, payload: response.data.message });
        return {
            type: authConstants.RESET_PASSWORD_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({ type: authConstants.RESET_PASSWORD_FAILURE, payload: error.response?.data?.message || 'Error resetting password' });
        return {
            type: authConstants.RESET_PASSWORD_FAILURE,
            status: error.status,
            error: error?.response?.data?.message
        };
    }
}
export const sendResetCode = (email) => async (dispatch) => {
    dispatch({ type: authConstants.RESET_CODE_REQUEST });
    try {
        const response = await axios.post('/auth/send-reset-code', { email });
        dispatch({ type: authConstants.RESET_CODE_SUCCESS, payload: response.data.message });
        return {
            type: authConstants.RESET_CODE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        console.log(error);
        dispatch({ type: authConstants.RESET_CODE_FAILURE, payload: error.response?.data?.message || 'Error sending code' });
        return {
            type: authConstants.RESET_CODE_FAILURE,
            status: error.status,
            error: error?.response?.data?.message
        };
    }
}