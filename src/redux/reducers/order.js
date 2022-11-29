import { INIT_STATE } from "../../utils/contant";
import { getOrder, getType } from "../actions/order";

export default function OrderReducers(state = INIT_STATE.order, action) {
  switch (action.type) {
    case getType(getOrder.getOrderRequest):
      return {
        ...state,
      };
    case getType(getOrder.getOrderSuccess):
      return {
        ...state,
        data: action.payload.data,
        totalItem: action.payload.total,
      };
    case getType(getOrder.getOrderFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
