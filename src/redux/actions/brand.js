import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getBrand = createActions({
  getBrandRequest: (payload) => payload,
  getBrandSuccess: (payload) => payload,
  getBrandFailure: (err) => err,
});
