import { useEffect } from "react";
import { INIT_STATE } from "../../utils/contant";
import { loginAction, logoutAction, permissionAction } from "../actions/auth";
import { getType } from "../actions/banner";
import { getPermission } from "../../api/auth";

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
    default:
      return state;
  }
}
