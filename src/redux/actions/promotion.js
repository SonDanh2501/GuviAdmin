import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getPromotion = createActions({
  getPromotionRequest: undefined,
  getPromotionSuccess: (payload) => payload,
  getPromotionFailure: (err) => err,
});
