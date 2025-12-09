import { eventServiceConstants, serviceRequestConstants } from "./constants";
import axios from "../helper/axios";


export const getRequestsByProvider = (data) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.GET_REQUESTED_SERVICE_REQUEST });

  try {

    const response = await axios.get(`/event-requests`);

    dispatch({
      type: serviceRequestConstants.GET_REQUESTED_SERVICE_SUCCESS,
      payload: {
        message: response?.data?.message,
        allActiveProjects: response?.data?.allActiveProjects,
        completedRequests: response?.data?.completedRequests,
        signedReqests: response?.data?.signedReqests,
        pendingRequests: response?.data?.pendingRequests,
        totalRequests: response?.data?.totalRequests
      },
    });
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.GET_REQUESTED_SERVICE_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Server error",
        error: error?.response?.status,
      },
    });
  }
};

// Event creating
export const organizerRequstToProvider = (formDataObj) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_REQUEST });

  try {
    const response = await axios.post("/event-requests", formDataObj);
    dispatch({
      type: serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_SUCCESS,
      payload: {
        message: response?.data?.message
      },
    });
    dispatch(getRequestsByProvider());

    return {
      type: serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_SUCCESS,
      message: response?.data?.message,
      status: response?.status,
    };
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
    return {
      type: serviceRequestConstants.ORGANIZER_SERVICE_TO_PROVIDER_FAILURE,
      message: error?.response?.data?.message,
      status: error?.status
    };
  }
};



// get proposal
export const getProposalById = (eventRequestId) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.GET_PROPOSAL_BY_ID_REQUEST });

  try {
    const response = await axios.get(`/event-requests/${eventRequestId}/getPraposal`);

    dispatch({
      type: serviceRequestConstants.GET_PROPOSAL_BY_ID_SUCCESS,
      payload: response.data,
    });

    return {
      type: serviceRequestConstants.GET_PROPOSAL_BY_ID_SUCCESS,
      data: response.data,
    };
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.GET_PROPOSAL_BY_ID_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Server error",
        error: error?.status,
      },
    });

    return {
      type: serviceRequestConstants.GET_PROPOSAL_BY_ID_FAILURE,
      message: error?.response?.data?.message || "Server error",
      error: error?.status,
    };
  }
};

// Provider sends proposal
export const sendProviderProposal = (eventRequestId, proposalData) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.SEND_PROVIDER_PROPOSAL_REQUEST });

  try {
    const response = await axios.post(`/event-requests/${eventRequestId}/propose`, proposalData);
    console.log(response);
    dispatch({
      type: serviceRequestConstants.SEND_PROVIDER_PROPOSAL_SUCCESS,
      payload: response.data,
    });

    return {
      type: serviceRequestConstants.SEND_PROVIDER_PROPOSAL_SUCCESS,
      data: response.data,
      status: response.status,
    };


  } catch (error) {
    dispatch({
      type: serviceRequestConstants.SEND_PROVIDER_PROPOSAL_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Server error",
        error: error?.status,
      },
    });

    return {
      type: serviceRequestConstants.SEND_PROVIDER_PROPOSAL_FAILURE,
      message: error?.response?.data?.message || "Server error",
      error: error?.status,
      status: error.status,

    };
  }
};

// update
export const updateProviderProposal = (eventRequestId, proposalData) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_REQUEST });

  try {
    const response = await axios.patch(`/event-requests/${eventRequestId}/proposal`, proposalData);

    dispatch({
      type: serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_SUCCESS,
      payload: response.data,
    });

    return {
      type: serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_SUCCESS,
      data: response.data,
      status: response.status,
    };
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Server error",
        error: error?.status,
      },
    });

    return {
      type: serviceRequestConstants.UPDATE_PROVIDER_PROPOSAL_FAILURE,
      message: error?.response?.data?.message || "Server error",
      error: error?.status,
      status: error.status,

    };
  }
};

// get orgainzer request
export const getRequestsByOrganizer = () => async (dispatch) => {
  try {
    dispatch({ type: serviceRequestConstants.GET_ORGANIZER_REQUESTS_REQUEST });

    const { data } = await axios.get(`/event-requests/organizer-requests`);

    dispatch({
      type: serviceRequestConstants.GET_ORGANIZER_REQUESTS_SUCCESS,
      payload: {
        requests: data.requests,
        total: data.total,
        currentPage: data.currentPage,
      },
    });
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.GET_ORGANIZER_REQUESTS_FAILURE,
      payload: { message: error?.response?.data?.message || "Failed to fetch organizer requests" },
    });
  }
};

export const updateOrganizerDecision = (id, status, contractStatus) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.UPDATE_ORGANIZER_DECISION_REQUEST });
  try {
    const res = await axios.put(`/event-requests/${id}/status`, {
      status,
      contractStatus,
    });

    dispatch({
      type: serviceRequestConstants.UPDATE_ORGANIZER_DECISION_SUCCESS,
      payload: {
        message: res.data.message,
        updatedRequest: res.data.data,
      },
    });
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.UPDATE_ORGANIZER_DECISION_FAILURE,
      payload: {
        message: error.response?.data?.message || 'Something went wrong',
      },
    });
  }
};

export const updateAcceptProviderStatus = (row, proStatus) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.ACCEPT_PROVIDER_REQUEST });
  try {
    const res = await axios.put(`/event-requests/p/${row?._id}/status`, {
      proStatus,
    });

    dispatch({
      type: serviceRequestConstants.ACCEPT_PROVIDER_SUCCESS,
      payload: {
        message: res.data.message,
        updatedRequest: res.data.data,
      },
    });
    dispatch(getRequestsByProvider({ orgStatus: "request", isSigned: false, projectStatus: "pending" }));

  } catch (error) {
    dispatch({
      type: serviceRequestConstants.ACCEPT_PROVIDER_FAILURE,
      payload: {
        message: error.response?.data?.message || 'Something went wrong',
      },
    });
  }
};

export const markRequestAsCompleted = (eventRequestId) => async (dispatch) => {
  dispatch({ type: serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_REQUEST });

  try {
    const res = await axios.patch(`/event-requests/mark-completed/${eventRequestId}`);

    dispatch({
      type: serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_SUCCESS,
      payload: {
        message: res.data.message,
        updatedRequest: res.data.data,
      },
    });

    return {
      type: serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_SUCCESS,
      message: res.data.message,
      status: res.status,
    };
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Failed to mark request as completed",
        error: error?.response?.status,
      },
    });

    return {
      type: serviceRequestConstants.MARK_REQUEST_AS_COMPLETED_FAILURE,
      message: error?.response?.data?.message,
      status: error?.response?.status,
    };
  }
};

export const serviceEventReqDelete = ({ serviceId }) => async (dispatch) => {

  dispatch({ type: eventServiceConstants.CANCEL_SERVICE_REQUEST });

  try {
    const response = await axios.delete(`/event-requests/${serviceId}`);
    dispatch({
      type: eventServiceConstants.CANCEL_SERVICE_SUCCESS,
      payload: { message: response?.data?.message },

    });
    dispatch(getRequestsByOrganizer())
    return {
      type: eventServiceConstants.CANCEL_SERVICE_SUCCESS,
      message: response?.data?.message,
      status: response?.status,
    };

  } catch (error) {
    dispatch({
      type: eventServiceConstants.CANCEL_SERVICE_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
    return {
      type: eventServiceConstants.CANCEL_SERVICE_FAILURE,
      message: "Server errors",
      status: error?.status,
    };
  }
};

export const getAccepedByProiver = () => async (dispatch) => {
  try {
    dispatch({ type: serviceRequestConstants.PROVIDER_ACCEPTED_REQUEST });

    const result = await axios.get(`/event-requests/acceptedByProvider`);
    dispatch({
      type: serviceRequestConstants.PROVIDER_ACCEPTED_SUCCESS,
      payload: {
        accepedProviderReq: result.data.requests
      },
    });
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.PROVIDER_ACCEPTED_FAILURE,
      payload: { message: error?.response?.data?.message || "Failed to fetch organizer requests" },
    });
  }
};

export const getActiveContractsByProvider = () => async (dispatch) => {
  try {
    dispatch({ type: serviceRequestConstants.ACTIVE_CONTRACTS_REQUEST });

    const result = await axios.get(`/event-requests/active-contracts`);
    dispatch({
      type: serviceRequestConstants.ACTIVE_CONTRACTS_SUCCESS,
      payload: {
        activeContracts: result.data.requests,
      },
    });
  } catch (error) {
    dispatch({
      type: serviceRequestConstants.ACTIVE_CONTRACTS_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Failed to fetch active contracts",
      },
    });
  }
};
