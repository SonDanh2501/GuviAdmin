import { INIT_STATE } from "../../utils/contant";
import {
  getCustomers,
  getType,
  createCustomer,
  updateCustomer,
} from "../actions/customerAction";
import { createPromotions, getPromotion } from "../actions/promotion";

export default function PromotionReducers(
  state = INIT_STATE.customers,
  action
) {
  switch (action.type) {
    case getType(getPromotion.getPromotionRequest):
      return {
        ...state,
      };
    case getType(getPromotion.getPromotionSuccess):
      return {
        ...state,
        data: action.payload,
      };
    case getType(getPromotion.getPromotionFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
