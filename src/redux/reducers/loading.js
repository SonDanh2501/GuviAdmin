import { INIT_STATE } from "../../utils/contant";
import { getType, loadingAction } from "../actions/loading";

export default function LoadingReducers(state = INIT_STATE.loading, action) {
  switch (action.type) {
    case getType(loadingAction.loadingRequest):
      return {
        ...state,
      };
    case getType(loadingAction.loadingSuccess):
      return {
        ...state,
        loading: action.payload,
      };
    case getType(loadingAction.loadingFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
