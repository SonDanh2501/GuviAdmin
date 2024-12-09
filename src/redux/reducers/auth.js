import { INIT_STATE } from "../../utils/contant";
import {
  getUserAction,
  languageAction,
  loginAction,
  logoutAction,
  permissionAction,
  loginAffiliateAction,
  loginAffiliateWithOTPAction,
  logoutAffiliateAction,
  getUserAffiliateAction,
  loginWithOnlyTokenAction,
} from "../actions/auth";
import { getType } from "../actions/banner";

export default function LoginReducers(state = INIT_STATE.auth, action) {
  switch (action.type) {
    case getType(loginAction.loginRequest):
      return {
        ...state,
      };
    case getType(loginAction.loginSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: true,
        user: action.payload.user,
      };
    case getType(loginAction.loginFailure):
      return {
        ...state,
      };
    case getType(loginWithOnlyTokenAction.loginWithOnlyTokenRequest):
      return {
        ...state,
      };
    case getType(loginWithOnlyTokenAction.loginWithOnlyTokenSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: true,
        user: action.payload.user,
      };
    case getType(loginWithOnlyTokenAction.loginWithOnlyTokenFailure):
      return {
        ...state,
      };
    case getType(permissionAction.permissionSuccess):
      return {
        ...state,
        permission: action.payload.permission,
        checkElement: action.payload.element,
      };
    case getType(getUserAction.getUserSuccess):
      return {
        ...state,
        user: action.payload.user,
      };
    case getType(languageAction.languageSuccess):
      return {
        ...state,
        language: action.payload.language,
      };
    case getType(logoutAction.logoutRequest):
      return {
        ...state,
      };
    case getType(logoutAction.logoutSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: false,
      };
    case getType(logoutAction.logoutFailure):
      return {
        ...state,
      };
    case getType(loginAffiliateAction.loginAffiliateRequest):
      return {
        ...state,
      };
    case getType(loginAffiliateAction.loginAffiliateSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: true,
        user: action.payload.user,
      };
    case getType(loginAffiliateAction.loginAffiliateFailure):
      return {
        ...state,
      };
    case getType(loginAffiliateWithOTPAction.loginAffiliateWithOTPRequest):
      return {
        ...state,
      };
    case getType(loginAffiliateWithOTPAction.loginAffiliateWithOTPSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: true,
        user: action.payload.user,
      };
    case getType(loginAffiliateWithOTPAction.loginAffiliateWithOTPFailure):
      return {
        ...state,
      };
    case getType(logoutAffiliateAction.logoutAffiliateRequest):
      return {
        ...state,
      };
    case getType(logoutAffiliateAction.logoutAffiliateSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: false,
      };
    case getType(logoutAffiliateAction.logoutAffiliateFailure):
      return {
        ...state,
      };
    case getType(getUserAffiliateAction.getUserAffiliateSuccess):
      return {
        ...state,
        user: action.payload.user,
      };
    default:
      return state;
  }
}
