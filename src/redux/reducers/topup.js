import { INIT_STATE } from "../../utils/contant";
import { getTopupCollaborator, getType } from "../actions/topup";

export default function TopupReducers(state = INIT_STATE.topup, action) {
  switch (action.type) {
    case getType(getTopupCollaborator.getTopupCollaboratorRequest):
      return {
        ...state,
      };
    case getType(getTopupCollaborator.getTopupCollaboratorSuccess):
      return {
        ...state,
        data: action.payload.data,
        totalItem: action.payload.total,
      };
    case getType(getTopupCollaborator.getTopupCollaboratorFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
