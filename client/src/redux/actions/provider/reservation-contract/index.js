import axios from "../../../helper/axios";
import { reservationContractsConstants } from "../../constants";

export const getReservationContracts = () => async (dispatch) => {
  dispatch({ type: reservationContractsConstants.GET_REQUEST });
  try {
    const response = await axios.get(`/p/reservation-contracts`);
    dispatch({
      type: reservationContractsConstants.GET_SUCCESS,
      payload: {
        message: response?.data?.message,
        resarvationContracts: response?.data?.contracts || {
          summary: { totalActiveProjects: 0, totalCompletedProjects: 0, overallExpectedPayments: 0 },
          activeProjects: { projects: [], totalExpectedPayments: 0 },
          completedProjects: { projects: [], totalExpectedPayments: 0 }
        },
      },
    });
  } catch (error) {
    dispatch({
      type: reservationContractsConstants.GET_FAILURE,
      payload: { 
        message: error?.response?.data?.message || "Server error", 
        error: error.status 
      },
    });
  }
};