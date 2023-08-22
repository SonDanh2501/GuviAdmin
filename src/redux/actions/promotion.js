import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getPromotion = createActions({
  getPromotionRequest: (payload) => payload,
  getPromotionSuccess: (payload) => payload,
  getPromotionFailure: (err) => err,
});

export const createPromotionAction = createActions({
  createPromotionRequest: (payload) => payload,
  createPromotionSuccess: (payload) => payload,
  createPromotionFailure: (err) => err,
});

export const updatePromotionAction = createActions({
  updatePromotionRequest: (payload) => payload,
  updatePromotionSuccess: (payload) => payload,
  updatePromotionFailure: (err) => err,
});

export const deletePromotionAction = createActions({
  deletePromotionRequest: (payload) => payload,
  deletePromotionSuccess: (payload) => payload,
  deletePromotionFailure: (err) => err,
});
