import { createActions, createAction } from 'redux-actions';

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getReasons = createActions({
  getReasonsRequest: undefined,
  getReasonsSuccess: (payload) => payload,
  getReasonsFailure: (err) => err, 
});

export const createReason = createActions({
  createReasonRequest: (payload) => payload,
  createReasonSuccess: (payload) => payload,
  createReasonFailure: (err) => err,
});

export const updateReason = createActions({
  updateReasonRequest: (payload) => payload,
  updateReasonSuccess: (payload) => payload,
  updateReasonFailure: (err) => err,
});

