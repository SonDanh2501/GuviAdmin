import { INIT_STATE } from "../../utils/contant";
import {
  getCustomers,
  getType,
  createCustomer,
  updateCustomer,
} from "../actions/customerAction";
import {
  createPromotionAction,
  createPromotions,
  getPromotion,
} from "../actions/promotion";

export default function PromotionReducers(
  state = INIT_STATE.promotions,
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
        data: action.payload.data,
        totalItem: action.payload.total,
      };
    case getType(getPromotion.getPromotionFailure):
      return {
        ...state,
      };
    case getType(createPromotionAction.createPromotionSuccess):
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    default:
      return state;
  }
}
