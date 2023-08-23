import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getHistoryActivity = createActions({
  getHistoryActivityRequest: (payload) => payload,
  getHistoryActivitySuccess: (payload) => payload,
  getHistoryActivityFailure: (err) => err,
});

export const getLastestService = createActions({
  getLastestServiceRequest: (payload) => payload,
  getLastestServiceSuccess: (payload) => payload,
  getLastestServiceFailure: (err) => err,
});

export const getActiveUser = createActions({
  getActiveUserRequest: undefined,
  getActiveUserSuccess: (payload) => payload,
  getActiveUserFailure: (err) => err,
});

export const getServiceConnect = createActions({
  getServiceConnectRequest: undefined,
  getServiceConnectSuccess: (payload) => payload,
  getServiceConnectFailure: (err) => err,
});

export const getTopCollaborator = createActions({
  getTopCollaboratorRequest: (payload) => payload,
  getTopCollaboratorSuccess: (payload) => payload,
  getTopCollaboratorFailure: (err) => err,
});
