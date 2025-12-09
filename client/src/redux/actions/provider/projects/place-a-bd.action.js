import { providerProposalConstants } from "../../constants";
import axios from "../../../helper/axios";

// Place a bid on a project
export const placeBid = (projectId,bidPayload) => async (dispatch) => {
  dispatch({ type: providerProposalConstants.POST_SENDPROPOSAL_REQUEST });
  try {
    const response = await axios.post(`/p/project/${projectId}/bids`,bidPayload);
    dispatch({
      type: providerProposalConstants.POST_SENDPROPOSAL_SUCCESS,
      payload: {
        message: response?.data?.message,
        project: response?.data?.project,
      },
    });
  } catch (error) {
    dispatch({
      type: providerProposalConstants.POST_SENDPROPOSAL_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};

// Provider see all bids only
export const getMyBids = () => async (dispatch) => {
  dispatch({ type: providerProposalConstants.GET_MYBIDS_REQUEST });
  try {
    const response = await axios.get(`/p/project/my-bids`);
    
    dispatch({
      type: providerProposalConstants.GET_MYBIDS_SUCCESS,
      payload: {
        message: response?.data?.message,
        mybids: response?.data?.mybids,
      },
    });
  } catch (error) {
    dispatch({
      type: providerProposalConstants.GET_MYBIDS_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};

// Provider see all bids only
export const withdrawnMyBids = (bidId) => async (dispatch) => {
  dispatch({ type: providerProposalConstants.DELETE_MYBID_REQUEST });
  try {
    const response = await axios.delete(`/p/project/${bidId}`);
    
    dispatch({
      type: providerProposalConstants.DELETE_MYBID_SUCCESS,
      payload: {
        message: response?.data?.message,
      },
    });
    dispatch(getMyBids())
  } catch (error) {
    dispatch({
      type: providerProposalConstants.DELETE_MYBID_FAILURE,
      payload: { message: error?.response?.data?.message || "Server error", error: error.status },
    });
  }
};

export const updateBid = (bidId, updatedData) => async (dispatch) => {
  dispatch({ type: providerProposalConstants.UPDATE_MYBID_REQUEST });
 
  try {
    const response = await axios.put(`/p/project/${bidId}`, updatedData);
 
    dispatch({
      type: providerProposalConstants.UPDATE_MYBID_SUCCESS,
      payload: {
        message: response?.data?.message,
        updatedBid: response?.data?.data, // Assuming `data` contains the updated bid
      },
    });
 
    // Refresh the bid list to reflect updates
    dispatch(getMyBids());
  } catch (error) {
    dispatch({
      type: providerProposalConstants.UPDATE_MYBID_FAILURE,
      payload: {
        message: error?.response?.data?.message || "Failed to update bid",
        error: error?.status,
      },
    });
  }
};