import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getOrder = createActions({
  getOrderRequest: (payload) => payload,
  getOrderSuccess: (payload) => payload,
  getOrderFailure: (err) => err,
});

export const searchOrder = createActions({
  searchOrderRequest: (payload) => payload,
  searchOrderSuccess: (payload) => payload,
  searchOrderFailure: (err) => err,
});
