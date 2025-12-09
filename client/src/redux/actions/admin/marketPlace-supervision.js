import axios from "../../helper/axios";
import { marketPlaceSupervisionConstants } from "../constants";


export const fetchMonitoringMarketplace = (selectedProviderId) => async (dispatch) => {
    dispatch({ type: marketPlaceSupervisionConstants.GET_PERFORMANCE_REQUEST });

    try {
        const response = await axios.get(`/admin/monitering-providers/${selectedProviderId}`);
        
        dispatch({
            type: marketPlaceSupervisionConstants.GET_PERFORMANCE_SUCCESS,
            payload: {
                performanceSumm: response?.data?.data,
                message: response?.data?.message
            },
        });
    } catch (error) {
        dispatch({
            type: marketPlaceSupervisionConstants.GET_PERFORMANCE_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch providers list",
                error: error.status
            },
        });
    }
};

export const fetchProviderList = () => async (dispatch) => {
    dispatch({ type: marketPlaceSupervisionConstants.GET_PROVIDER_REQUEST });

    try {
        const response = await axios.get("/admin/role-providers");
        
        dispatch({
            type: marketPlaceSupervisionConstants.GET_PROVIDER_SUCCESS,
            payload: {
                providerList: response?.data?.providers,
                message: response?.data?.message,
                count: response?.data?.count,
            },
        });
    } catch (error) {
        dispatch({
            type: marketPlaceSupervisionConstants.GET_PROVIDER_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch providers list",
                error: error.status
            },
        });
    }
};