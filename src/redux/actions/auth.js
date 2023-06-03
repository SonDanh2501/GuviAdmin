import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const loginAction = createActions({
  loginRequest: (payload) => payload,
  loginSuccess: (payload) => payload,
  loginFailure: (err) => err,
});

export const logoutAction = createActions({
  logoutRequest: (payload) => payload,
  logoutSuccess: (payload) => payload,
  logoutFailure: (err) => err,
});

export const permissionAction = createActions({
  permissionRequest: undefined,
  permissionSuccess: (payload) => payload,
  permissionFailure: (err) => err,
});
