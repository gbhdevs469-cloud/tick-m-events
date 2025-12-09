import { combineReducers } from '@reduxjs/toolkit'
import authReducer from './auth.reducer'
import eventReducer from './event.reducer'
import promotionReducer from './promotion.reducer'
import profileServiceReducer from './profile-service.reducer'
import eventOrderReducer from './eventOrder.reducer'
import searchSelectReducer from './searchSelect.reducer'
import homeAndRecommandationReducer from './home-recommedation.reducer'
import ticketTypeReducer from './ticket-reservation.reducer'
import transactionPaymentReducer from './transactionPayment.reducer'
import eventServiceReqReducer from './event-service-request.reducer'
import { activityReducer } from "./activity.reducer";
import reminderReducer from './reminder.reducer'
import serveiceRequestReducer from './serviceRequest.Reducer'
import fetchMessagesReducers from './message.reducer'
import { paymentSettingsReducer } from './payment-setting.reducer';
import { adminVerificationListReducer } from './verificationReducers'
import { userReducer } from './userReducer';
import editEventReducer from './organizer/editEventReducer'
import pageEventReducer from './organizer/pageEvents.reducer'
import homeAndGlobalReducer from './homeAndGlobal.reducer'
import globalOverviewGeneralStatisticsReducer from './global-overview-general-statistice.reducer'
import { notificationReducer } from './notification.reducer';
import placeABidReducer from './provider/Home-Global-View/freelancer.reducer'
import { rewardReducer } from './rewardReducer'
import customizationReducer from './customization/promotion-logos'
import reqAndRefundsReducer from './admin/refund-request/refundreuest.reducer'
import entryValidationReducer from './participant/entry-validation/index'
import reservationContractsReducer from './provider/reservation-contract/index'
import secureInfoReducer from './secure.reducer'

const rootReducer = combineReducers({
    security:secureInfoReducer,
    participant:entryValidationReducer,
    admin: reqAndRefundsReducer,
    customization: customizationReducer,
    provider: placeABidReducer,
    resContracts: reservationContractsReducer,
    organizer: pageEventReducer,
    gogs: globalOverviewGeneralStatisticsReducer,
    notification: notificationReducer,
    homeAndGlobal: homeAndGlobalReducer,
    editEvent: editEventReducer,
    adminVerificationList: adminVerificationListReducer,
    paymentSettings: paymentSettingsReducer,
    allMessages: fetchMessagesReducers,
    serviceReqCategories: serveiceRequestReducer,
    reminder: reminderReducer,
    auth: authReducer,
    event: eventReducer,
    activities: activityReducer,
    promotionList: promotionReducer,
    profile: profileServiceReducer,
    order: eventOrderReducer,
    providers: searchSelectReducer,
    homeRecom: homeAndRecommandationReducer,
    ticketReservationMang: ticketTypeReducer,
    transactions: transactionPaymentReducer,
    serviceRequest: eventServiceReqReducer,
    user: userReducer,
    reward: rewardReducer,
})

export default rootReducer