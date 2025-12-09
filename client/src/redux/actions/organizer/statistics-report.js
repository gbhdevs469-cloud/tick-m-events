import { organizerEventConstants } from "../constants";
import axios from "../../helper/axios";

export const fatchDashBoardStatisitcs = (_id) => async (dispatch) => {
    dispatch({ type: organizerEventConstants.GET_DASHBOARDSTATISTICS_REQUEST });

    try {
        const response = await axios.get(`/o/statistics-reports-pro/${_id}`)

        dispatch({
            type: organizerEventConstants.GET_DASHBOARDSTATISTICS_SUCCESS,
            payload: {
                message: response?.data?.statistics?.message,
                graph: response?.data?.statistics?.graphs,
                overview: response?.data?.statistics?.overview,
                peakSalesInfo: response?.data?.statistics?.peakSalesInfo,
            },

        });
    } catch (error) {
        dispatch({
            type: organizerEventConstants.GET_DASHBOARDSTATISTICS_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Server error",
                error: error.status
            },
        });
    }
};