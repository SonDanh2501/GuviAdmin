import { createActions, createAction } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getCustomers = createActions({
  getCustomersRequest: (payload) => payload,
  getCustomersSuccess: (payload) => payload,
  getCustomersFailure: (err) => err,
});

export const getGroupCustomers = createActions({
  getGroupCustomersRequest: (payload) => payload,
  getGroupCustomersSuccess: (payload) => payload,
  getGroupCustomersFailure: (err) => err,
});

export const createCustomer = createActions({
  createCustomerRequest: (payload) => payload,
  createCustomerSuccess: (payload) => payload,
  createCustomerFailure: (err) => err,
});

export const updateCustomer = createActions({
  updateCustomerRequest: (payload) => payload,
  updateCustomerSuccess: (payload) => payload,
  updateCustomerFailure: (err) => err,
});

export const deleteCustomerAction = createActions({
  deleteCustomerRequest: (payload) => payload,
  deleteCustomerSuccess: (payload) => payload,
  deleteCustomerFailure: (err) => err,
});
