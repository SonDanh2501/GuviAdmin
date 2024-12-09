import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const loginAction = createActions({
  loginRequest: (payload) => payload,
  loginSuccess: (payload) => payload,
  loginFailure: (err) => err,
});

export const loginWithOnlyTokenAction = createActions({
  loginWithOnlyTokenRequest: (payload) => payload,
  loginWithOnlyTokenSuccess: (payload) => payload,
  loginWithOnlyTokenFailure: (err) => err,
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

// Affiliate
export const loginAffiliateAction = createActions({
  loginAffiliateRequest: (payload) => payload,
  loginAffiliateSuccess: (payload) => payload,
  loginAffiliateFailure: (err) => err,
});

export const loginAffiliateWithOTPAction = createActions({
  loginAffiliateWithOTPRequest: (payload) => payload,
  loginAffiliateWithOTPSuccess: (payload) => payload,
  loginAffiliateWithOTPFailure: (err) => err,
});

export const logoutAffiliateAction = createActions({
  logoutAffiliateRequest: (payload) => payload,
  logoutAffiliateSuccess: (payload) => payload,
  logoutAffiliateFailure: (err) => err,
});

export const getUserAffiliateAction = createActions({
  getUserAffiliateRequest: (payload) => payload,
  getUserAffiliateSuccess: (payload) => payload,
  getUserAffiliateFailure: (err) => err,
});
