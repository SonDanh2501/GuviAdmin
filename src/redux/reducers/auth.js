import { INIT_STATE } from "../../utils/contant";
import {
  getUserAction,
  languageAction,
  loginAction,
  logoutAction,
  permissionAction,
  loginAffiliateAction
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
        ...state
      }
    case getType(loginAffiliateAction.loginAffiliateSuccess):
      return {
        ...state,
        token: action.payload.token,
        isCheckLogin: true,
        user: action.payload.user,
      }
    case getType(loginAffiliateAction.loginAffiliateFailure):
      return { 
        ...state
      }
    default:
      return state;
  }
}
