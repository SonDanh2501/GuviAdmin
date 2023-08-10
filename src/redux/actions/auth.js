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
  permissionRequest: (payload) => payload,
  permissionSuccess: (payload) => payload,
  permissionFailure: (err) => err,
});

export const languageAction = createActions({
  languageRequest: (payload) => payload,
  languageSuccess: (payload) => payload,
  languageFailure: (err) => err,
});

export const getUserAction = createActions({
  getUserRequest: (payload) => payload,
  getUserSuccess: (payload) => payload,
  getUserFailure: (err) => err,
});
