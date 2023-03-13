import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getNotification = createActions({
  getNotificationRequest: (payload) => payload,
  getNotificationSuccess: (payload) => payload,
  getNotificationFailure: (err) => err,
});
