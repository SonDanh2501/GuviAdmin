import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getFeedback = createActions({
  getFeedbackRequest: (payload) => payload,
  getFeedbackSuccess: (payload) => payload,
  getFeedbackFailure: (err) => err,
});

// export const createReason = createActions({
//   createReasonRequest: (payload) => payload,
//   createReasonSuccess: (payload) => payload,
//   createReasonFailure: (err) => err,
// });

// export const updateReason = createActions({
//   updateReasonRequest: (payload) => payload,
//   updateReasonSuccess: (payload) => payload,
//   updateReasonFailure: (err) => err,
// });
