import { INIT_STATE } from "../../utils/contant";
import {
  getTopupCollaborator,
  getTopupCustomer,
  getType,
} from "../actions/topup";

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
    case getType(getTopupCustomer.getTopupCustomerRequest):
      return {
        ...state,
      };
    case getType(getTopupCustomer.getTopupCustomerSuccess):
      return {
        ...state,
        dataCustomer: action.payload.data,
        totalItemCustomer: action.payload.total,
      };
    case getType(getTopupCustomer.getTopupCustomerFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
