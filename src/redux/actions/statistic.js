import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getHistoryActivity = createActions({
  getHistoryActivityRequest: undefined,
  getHistoryActivitySuccess: (payload) => payload,
  getHistoryActivityFailure: (err) => err,
});

export const getLastestService = createActions({
  getLastestServiceRequest: undefined,
  getLastestServiceSuccess: (payload) => payload,
  getLastestServiceFailure: (err) => err,
});
