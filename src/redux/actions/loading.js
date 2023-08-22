import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const loadingAction = createActions({
  loadingRequest: (payload) => payload,
  loadingSuccess: (payload) => payload,
  loadingFailure: (err) => err,
});
