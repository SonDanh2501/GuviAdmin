import { takeLatest, call, put } from 'redux-saga/effects';
import * as actions from '../actions/customerAction';
import * as api from '../../api/customer'; 
import {getType} from '../actions/customerAction';

function* fetchCustomersSaga() {
  try {
    const Customers = yield call(api.fetchCustomers);
    yield put(actions.getCustomers.getCustomersSuccess(Customers));
  } catch (err) {
    console.error(err);
    yield put(actions.getCustomers.getCustomersFailure(err));
  }
}

function* createCustomerSaga(action) {
  try {
    const Customer = yield call(api.createCustomer, action.payload);
    yield put(actions.createCustomer.createCustomerSuccess(Customer.data));
  } catch (err) {
    console.error(err);
    yield put(actions.createCustomer.createCustomerFailure(err));
  }
}

function* updateCustomerSaga(action) {
  try {
    const updatedCustomer = yield call(api.updateCustomer, action.payload);
    yield put(actions.updateCustomer.updateCustomerSuccess(updatedCustomer.data));
  } catch (err) {
    console.error(err);
    yield put(actions.updateCustomer.updateCustomerFailure(err));
  }
}

function* customerSaga() {
  yield takeLatest(getType(actions.getCustomers.getCustomersRequest), fetchCustomersSaga);
  yield takeLatest(actions.createCustomer.createCustomerRequest, createCustomerSaga);
  yield takeLatest(actions.updateCustomer.updateCustomerRequest, updateCustomerSaga);
}

// generator function ES6

export default customerSaga;
