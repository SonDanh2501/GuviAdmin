import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getTopupCollaborator = createActions({
  getTopupCollaboratorRequest: (payload) => payload,
  getTopupCollaboratorSuccess: (payload) => payload,
  getTopupCollaboratorFailure: (err) => err,
});

export const getTopupCustomer = createActions({
  getTopupCustomerRequest: (payload) => payload,
  getTopupCustomerSuccess: (payload) => payload,
  getTopupCustomerFailure: (err) => err,
});
