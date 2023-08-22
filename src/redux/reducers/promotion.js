import { INIT_STATE } from "../../utils/contant";
import { getType } from "../actions/customerAction";
import { createPromotionAction, getPromotion } from "../actions/promotion";

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
