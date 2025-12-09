import { globalOverviewStatisticsConstants } from "./constants";
import axios from "../helper/axios";

export const fetchMarketPlaceactivity = () => async (dispatch) => {
    dispatch({ type: globalOverviewStatisticsConstants.GET_MARKET_ACTIVITY_REQUEST });

    try {
        const response = await axios.get("/admin/gogs/pro-list");
        dispatch({
            type: globalOverviewStatisticsConstants.GET_MARKET_ACTIVITY_SUCCESS,
            payload: {
                providers: response?.data?.providers,
                message: response?.data?.message
            },
        });
    } catch (error) {
        dispatch({
            type: globalOverviewStatisticsConstants.GET_MARKET_ACTIVITY_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch providers list",
                error: error.status
            },
        });
    }
};

export const fetchDashboardActivity = () => async (dispatch) => {
    dispatch({ type: globalOverviewStatisticsConstants.GET_DASHBOARD_ACTIVITY_REQUEST });

    try {
        const response = await axios.get("/admin/dashboard");
        dispatch({
            type: globalOverviewStatisticsConstants.GET_DASHBOARD_ACTIVITY_SUCCESS,
            payload: {
                dashboardData: response?.data?.dashboardData,
                message: response?.data?.message
            },
        });
    } catch (error) {
        dispatch({
            type: globalOverviewStatisticsConstants.GET_DASHBOARD_ACTIVITY_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch providers list",
                error: error.status
            },
        });
    }
};

export const fetchTicketingActivity = () => async (dispatch) => {
    dispatch({ type: globalOverviewStatisticsConstants.FETCH_TICKETING_ACTIVITY_REQUEST });

    try {
        const response = await axios.get("/admin/ticketingActivity");

        const rawData = response.data?.data || [];

        const enrichedData = rawData.map((item) => ({
            ...item,
            status: mapStatus(item.status),
        }));

        dispatch({
            type: globalOverviewStatisticsConstants.FETCH_TICKETING_ACTIVITY_SUCCESS,
            payload: enrichedData,
        });

        return {
            type: globalOverviewStatisticsConstants.FETCH_TICKETING_ACTIVITY_SUCCESS,
            status: response.status,
            message: response.data.message,
            payload: enrichedData,
        };
    } catch (error) {
        const errMsg =
            error?.response?.data?.message || "Failed to fetch ticketing activity";

        dispatch({
            type: globalOverviewStatisticsConstants.FETCH_TICKETING_ACTIVITY_FAILURE,
            payload: {
                message: errMsg,
                error: error.status,
            },
        });

        return {
            type: globalOverviewStatisticsConstants.FETCH_TICKETING_ACTIVITY_FAILURE,
            message: errMsg,
            status: error.status,
        };
    }
};

// Optional status mapper
function mapStatus(status) {
    switch (status) {
        case "approved":
            return "Active";
        case "pending":
            return "Pending";
        case "cancelled":
            return "Cancelled";
        default:
            return "In Progress";
    }
}