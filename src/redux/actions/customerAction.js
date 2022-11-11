import { createActions, createAction } from 'redux-actions';

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getCustomers = createActions({
  getCustomersRequest: undefined,
  getCustomersSuccess: (payload) => payload,
  getCustomersFailure: (err) => err, 
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

// export const showModal = createAction('SHOW_CREATE_POST_MODAL');
// export const hideModal = createAction('HIDE_CREATE_POST_MODAL');

/*
  getType(getPosts.getPostSuccess)
  =>  
  {
    type: 'getPostSuccess',
    payload: {
      name: 'Test'
    }
  }
*/
