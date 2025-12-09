import { refundReqConstants } from "../../constants";
import axios from "../../../helper/axios";

export const getAdminRefundReq = () => async (dispatch: any) => {
    dispatch({ type: refundReqConstants.GET_RR_REQUEST });

    try {
        const response = await axios.get("/refund-request");
        console.log(response);

        dispatch({
            type: refundReqConstants.GET_RR_SUCCESS,
            payload: response.data.formattedData // this must be the array
        });
    } catch (error) {
        console.error("❌ Error fetching withdrawals:", error);
        dispatch({
            type: refundReqConstants.GET_RR_FAILURE,
            payload: error?.response?.data?.message || "Server error"
        });
    }
};