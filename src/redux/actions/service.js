import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};
//group-service
export const getGroupServiceAction = createActions({
  getGroupServiceRequest: (payload) => payload,
  getGroupServiceSuccess: (payload) => payload,
  getGroupServiceFailure: (err) => err,
});

export const createGroupServiceAction = createActions({
  createGroupServiceRequest: (payload) => payload,
  createGroupServiceSuccess: (payload) => payload,
  ccreateGroupServiceFailure: (err) => err,
});

export const updateGroupServiceAction = createActions({
  updateGroupServiceRequest: (payload) => payload,
  updateGroupServiceSuccess: (payload) => payload,
  updateGroupServiceFailure: (err) => err,
});

//services
export const getServiceAction = createActions({
  getServiceRequest: undefined,
  getServiceSuccess: (payload) => payload,
  getServiceFailure: (err) => err,
});
