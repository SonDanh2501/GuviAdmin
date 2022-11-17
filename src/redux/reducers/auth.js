import { INIT_STATE } from "../../utils/contant";
import { loginAction } from "../actions/auth";
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
        token: action.payload,
        isCheckLogin: true,
      };
    case getType(loginAction.loginFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
