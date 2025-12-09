import { eventConstants } from "./constants";
import axios from "../helper/axios";
import { fatchOrgEvents } from "./organizer/pageEvents";

export const removeFromWishlist = ({ eventId }) => async (dispatch) => {
    dispatch({ type: eventConstants.WISHLIST_ADD_REQUEST });

    try {
        const response = await axios.delete(`event-wishlist/${eventId}`);
        dispatch({
            type: eventConstants.WISHLIST_ADD_SUCCESS,
            payload: {
                message: response?.data?.message
            },
        });
        dispatch(wishlistEventFetch())
    } catch (error) {
        dispatch({
            type: eventConstants.WISHLIST_ADD_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

    }
};

export const eventAddToWishlist = (selectedViewEvent) => async (dispatch) => {
    const { _id } = selectedViewEvent.selectedViewEvent
    dispatch({ type: eventConstants.WISHLIST_ADD_REQUEST });

    try {
        const response = await axios.post("event-wishlist", { eventId: _id });
        dispatch({
            type: eventConstants.WISHLIST_ADD_SUCCESS,
            payload: {
                message: response?.data?.message
            },
        });
        dispatch(wishlistEventFetch())
        return {
            type: eventConstants.WISHLIST_ADD_SUCCESS,
            message: response?.data?.message,
            status: response?.status,
        };
    } catch (error) {
        dispatch({
            type: eventConstants.WISHLIST_ADD_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: eventConstants.WISHLIST_ADD_FAILURE,
            message: error?.response?.data?.message,
            status: error?.status,
        };
    }
};

// Event Updation
export const eventUpdate = (updatedEvent) => async (dispatch) => {

    const eventId = updatedEvent?._id
    dispatch({ type: eventConstants.EVENT_UPDATE_REQUEST });

    try {
        const response = await axios.patch(`/event/${eventId}`, updatedEvent);
        dispatch({
            type: eventConstants.EVENT_UPDATE_SUCCESS,
            payload: { message: response?.data?.message },

        });
        dispatch(eventFetch())
        return {
            type: eventConstants.EVENT_UPDATE_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_UPDATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });

        return {
            type: eventConstants.EVENT_UPDATE_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};

export const eventCustomizationPageUpdate = (updatedEvent) => async (dispatch) => {
    const eventId = updatedEvent?._id;
    const formData = updatedEvent?.formData;

    dispatch({ type: eventConstants.EVENT_CUSTOMIZATION_UPDATE_REQUEST });

    try {
        const response = await axios.patch(
            `/event/eventPageCustomization/${eventId}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data',  // <-- important!
                },
            }
        );

        dispatch({
            type: eventConstants.EVENT_CUSTOMIZATION_UPDATE_SUCCESS,
            payload: { message: response?.data?.message },
        });

        return {
            type: eventConstants.EVENT_CUSTOMIZATION_UPDATE_SUCCESS,
            status: response.status,
            message: response?.data?.message,
        };
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_CUSTOMIZATION_UPDATE_FAILURE,
            payload: {
                message: error?.response?.data?.message || 'Server error',
                error: error?.response?.status,
            },
        });

        return {
            type: eventConstants.EVENT_CUSTOMIZATION_UPDATE_FAILURE,
            message: error?.response?.data?.message || 'Server error',
            status: error?.response?.status,
        };
    }
};


export const wishlistEventFetch = () => async (dispatch) => {
    dispatch({ type: eventConstants.WISHLIST_GET_REQUEST });

    try {
        const response = await axios.get(`/event-wishlist`);
        dispatch({
            type: eventConstants.WISHLIST_GET_SUCCESS,
            payload: {
                wishlist: response?.data?.wishlist,
            },
        });
    } catch (error) {
        dispatch({
            type: eventConstants.WISHLIST_GET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const updateEventStatus = (eventId, status, reason) => async (dispatch) => {
    dispatch({ type: eventConstants.UPDATE_EVENT_STATUS_REQUEST });

    try {
        const response = await axios.put(`/event/status/${eventId}/${status}`, {
            reason,
        });

        dispatch({
            type: eventConstants.UPDATE_EVENT_STATUS_SUCCESS,
            payload: { message: response?.data?.message },
        });
        dispatch(eventFetch());

    } catch (error) {
        dispatch({
            type: eventConstants.UPDATE_EVENT_STATUS_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const eventFetch = () => async (dispatch) => {
    dispatch({ type: eventConstants.EVENT_GET_REQUEST });

    try {
        const response = await axios.get(`/event`);
        dispatch({
            type: eventConstants.EVENT_GET_SUCCESS,
            payload: {
                message: response?.data?.message,
                basicDetails: response?.data?.basicDetails,
                fullData: response?.data?.fullData,
            },

        });
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_GET_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

// Event customization
export const eventPublicationCreate = ({ formEventPublicatinData, eventId, ticketCustomId, eventCustomizationId }) => async (dispatch) => {

    dispatch({ type: eventConstants.PUBLISH_CREATE_REQUEST });

    try {
        const response = await axios.post(`/event/tickets/pvo/${eventId}/${ticketCustomId}/${eventCustomizationId}`, formEventPublicatinData);
        // const response = await axios.post('/event/tickets/pvo/6874eda15114ef5b02b58bcf/6874edd55114ef5b02b58be1/6874edef5114ef5b02b58be8', formEventPublicatinData);
        dispatch({
            type: eventConstants.PUBLISH_CREATE_SUCCESS,
            payload: {
                stepper: 0,
                message: response?.data?.message
            },
        });
        return {
            type: eventConstants.PUBLISH_CREATE_SUCCESS,
            message: response?.data?.message,
            status: response.status,
            stepper: 0,

        };
    } catch (error) {
        dispatch({
            type: eventConstants.PUBLISH_CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return null; // or return an error object if you prefer
    }
};

// Event customization
export const eventCustomizationCreate = ({ formEventCustomizeData, eventId, ticketConfigId }) => async (dispatch) => {

    dispatch({ type: eventConstants.EVENT_CUSTOMIZTION_CREATE_REQUEST });

    try {
        const response = await axios.post(`/event/tickets/ec/${eventId}/${ticketConfigId}`, formEventCustomizeData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        console.log(response);

        dispatch({
            type: eventConstants.EVENT_CUSTOMIZTION_CREATE_SUCCESS,
            payload: {
                stepper: 3,
                message: response?.data?.message
            },
        });
        return {
            type: eventConstants.EVENT_CUSTOMIZTION_CREATE_SUCCESS,
            stepper: 3,
            message: response?.data?.message,
            eventCustomizationId: response?.data?.eventCustomizationId
        };
    } catch (error) {
        console.log(error);

        dispatch({
            type: eventConstants.EVENT_CUSTOMIZTION_CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return null; // or return an error object if you prefer
    }
};

// Event creating
export const eventCreate = (data) => async (dispatch) => {
    dispatch({ type: eventConstants.EVENT_CREATE_REQUEST });

    try {
        const response = await axios.post("/event", data, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        dispatch({
            type: eventConstants.EVENT_CREATE_SUCCESS,
            payload: {
                stepper: 1,
                message: response?.data?.message
            },
        });
        return {
            type: eventConstants.EVENT_CREATE_SUCCESS,
            stepper: 1,
            message: response?.data?.message,
            eventId: response?.data?.eventId
        };
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: eventConstants.EVENT_CREATE_FAILURE,
            message: error.response?.data?.message,
            error: error.response?.data?.error,
            status: error.status,
        };
    }
};

// Event config
export const ticketConfigCreate = ({ formEventData, eventId }) => async (dispatch) => {
    dispatch({ type: eventConstants.TICKET_CONFIG_CREATE_REQUEST });

    try {
        const response = await axios.post(`/event/tickets/${eventId}`, formEventData);
        // const response = await axios.post(`/event/tickets/6815cf53789b3d38a21e1faf`, formEventData);
        dispatch({
            type: eventConstants.TICKET_CONFIG_CREATE_SUCCESS,
            payload: {
                stepper: 2,
                message: response?.data?.message
            },
        });
        return {
            type: eventConstants.TICKET_CONFIG_CREATE_SUCCESS,
            stepper: 2,
            message: response?.data?.message,
            ticketConfigId: response?.data?.ticketConfigId
        };
    } catch (error) {
        dispatch({
            type: eventConstants.TICKET_CONFIG_CREATE_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return null; // or return an error object if you prefer
    }
};

export const eventByIdFetch = (eventId) => async (dispatch) => {
    dispatch({ type: eventConstants.EVENT_BY_ID_REQUEST });

    try {
        const response = await axios.get(`/event/${eventId}`);
        dispatch({
            type: eventConstants.EVENT_BY_ID_SUCCESS,
            payload: {
                message: response?.data?.message,
                eventWithDetails: response?.data?.eventWithDetails,
            },

        });
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_BY_ID_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
    }
};

export const uncompletdeventByIdFetch = (eventId) => async (dispatch) => {
    dispatch({ type: eventConstants.UNEVENT_BY_ID_REQUEST });

    try {
        const response = await axios.get(`/event/uncompleted/${eventId}`);
        dispatch({
            type: eventConstants.UNEVENT_BY_ID_SUCCESS,
            payload: {
                message: response?.data?.message,
                DDD: response?.data?.event,
            },
        });
        return {
            type: eventConstants.UNEVENT_BY_ID_SUCCESS,
            message: response?.data?.message,
            urlSlug: response?.data?.event?.urlSlug,
        };
    } catch (error) {
        dispatch({
            type: eventConstants.UNEVENT_BY_ID_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: eventConstants.UNEVENT_BY_ID_FAILURE,
            message: error?.response?.data?.message,
        };
    }
};


export const fetchAllCategories = () => async (dispatch) => {
    dispatch({ type: eventConstants.EVENT_CATEGORY_FETCH_REQUEST });

    try {
        const response = await axios.get("/event/allCategory");
        dispatch({
            type: eventConstants.EVENT_CATEGORY_FETCH_SUCCESS,
            payload: {
                categories: response?.data?.categories
            },
        });
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_CATEGORY_FETCH_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch categories",
                error: error.status
            },
        });
    }
};

export const fetchChildCategories = (parentId) => async (dispatch) => {
    dispatch({ type: eventConstants.CHILD_CATEGORY_FETCH_REQUEST });

    try {
        const response = await axios.get(`/event/children/${parentId}`);
        dispatch({
            type: eventConstants.CHILD_CATEGORY_FETCH_SUCCESS,
            payload: {
                childCategories: response?.data,
            },
        });
    } catch (error) {
        dispatch({
            type: eventConstants.CHILD_CATEGORY_FETCH_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch child categories",
                error: error.status,
            },
        });
    }
};

export const eventSubmitRating = (participantRating) => async (dispatch) => {
    dispatch({ type: eventConstants.EVENT_SUBMIT_RATING_REQUEST });

    try {
        const response = await axios.post("/event/rating", participantRating);
        const successAction = {
            type: eventConstants.EVENT_SUBMIT_RATING_SUCCESS,
            payload: {
                message: response?.data?.message
            },
        };

        dispatch(successAction);
        dispatch(eventByIdFetch(participantRating.eventId));

        return {
            type: eventConstants.EVENT_SUBMIT_RATING_SUCCESS,
            message: response?.data?.message,
            status: response?.status,
        };

    } catch (error) {
        const failureAction = {
            type: eventConstants.EVENT_SUBMIT_RATING_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Server error",
                error: error.status
            },
        };
        dispatch(failureAction);

        // Return the failure action consistently
        return failureAction;
    }
};

export const categoryByIdFetch = (categoryId) => async (dispatch) => {
    dispatch({ type: eventConstants.SINGLE_CATEGORY_FETCH_REQUEST });

    try {
        const response = await axios.get(`/event/category/${categoryId}`);
        dispatch({
            type: eventConstants.SINGLE_CATEGORY_FETCH_SUCCESS,
            payload: {
                category: response?.data?.category
            },
        });
    } catch (error) {
        dispatch({
            type: eventConstants.SINGLE_CATEGORY_FETCH_FAILURE,
            payload: {
                message: error?.response?.data?.message || "Failed to fetch categories",
                error: error.status
            },
        });
    }
};

export const todayEventFetch = () => async (dispatch) => {
    dispatch({ type: eventConstants.GET_TODAY_EVENT_REQUEST });

    try {
        const response = await axios.get(`/event/currentDateEvents`);

        dispatch({
            type: eventConstants.GET_TODAY_EVENT_SUCCESS,
            payload: {
                message: response?.data?.message,
                currentEvents: response?.data?.currentEvents,
            },

        });
    } catch (error) {
        dispatch({
            type: eventConstants.GET_TODAY_EVENT_FAILURE,
            payload: { message: "denied", error: error.status },
        });
    }
};

export const validateViewUpdate = (eventId, validationOptions) => async (dispatch) => {
    dispatch({ type: eventConstants.UPDATE_VALIDATION_VIEW_REQUEST });

    try {
        const response = await axios.patch(`/event/${eventId}/validation-view`, {
            validationOptions,
        });

        dispatch({
            type: eventConstants.UPDATE_VALIDATION_VIEW_SUCCESS,
            payload: {
                message: response?.data?.message,
                validationOptions: response?.data?.validationOptions,
            },
        });
        dispatch(fatchOrgEvents())
    } catch (error) {
        dispatch({
            type: eventConstants.UPDATE_VALIDATION_VIEW_FAILURE,
            payload: {
                message: error?.response?.data?.message || 'Failed to update validation view',
                error: error?.response?.status,
            },
        });
    }
};

export const eventCustomizationPageFetch = (eventId) => async (dispatch) => {
    dispatch({ type: eventConstants.EVENT_CUSTOMIZATION_FETCH_REQUEST });

    try {
        const response = await axios.get(`/event/eventPageCustomization/${eventId}`);

        dispatch({
            type: eventConstants.EVENT_CUSTOMIZATION_FETCH_SUCCESS,
            payload: response.data.customization,
        });

        return {
            type: eventConstants.EVENT_CUSTOMIZATION_FETCH_SUCCESS,
            status: response.status,
            customization: response.data.customization,
        };
    } catch (error) {
        dispatch({
            type: eventConstants.EVENT_CUSTOMIZATION_FETCH_FAILURE,
            payload: { message: error?.response?.data?.message || 'Server error', error: error.status },
        });

        return {
            type: eventConstants.EVENT_CUSTOMIZATION_FETCH_FAILURE,
            message: error?.response?.data?.message || 'Server error',
            status: error.status,
        };
    }
};

// Event Updation
export const eventVisibilityUpdate = (updatedEvent) => async (dispatch) => {

    const eventId = updatedEvent?._id
    dispatch({ type: eventConstants.UPDATE_EVENT_VISIBILITY_REQUEST });

    try {
        const response = await axios.patch(`/o/edit-event-visibility/${eventId}`, updatedEvent);
        dispatch({
            type: eventConstants.UPDATE_EVENT_VISIBILITY_SUCCESS,
            payload: { message: response?.data?.message },
        });
        dispatch(eventFetch())
        return {
            type: eventConstants.UPDATE_EVENT_VISIBILITY_SUCCESS,
            status: response.status,
            message: response?.data?.message
        };
    } catch (error) {
        dispatch({
            type: eventConstants.UPDATE_EVENT_VISIBILITY_FAILURE,
            payload: { message: error?.response?.data?.message || "Server error", error: error.status },
        });
        return {
            type: eventConstants.UPDATE_EVENT_VISIBILITY_FAILURE,
            message: error?.response?.data?.message || "Server error",
            status: error.status
        };
    }
};