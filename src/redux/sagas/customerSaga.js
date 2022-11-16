import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/customerAction";
import * as api from "../../api/customer.jsx";
import { getType } from "../actions/customerAction";

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
  console.log("saga createNewSaga");
  try {
    const Customer = yield call(api.createCustomer, action.payload);
    window.location.reload();
    yield put(actions.createCustomer.createCustomerSuccess(Customer.data));
  } catch (err) {
    console.error(err);
    yield put(actions.createCustomer.createCustomerFailure(err));
  }
}

function* updateCustomerSaga(action) {
  try {
    const updatedCustomer = yield call(
      api.updateCustomer,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(
      actions.updateCustomer.updateCustomerSuccess(updatedCustomer.data)
    );
  } catch (err) {
    console.error(err);
    yield put(actions.updateCustomer.updateCustomerFailure(err));
  }
}

function* deleteCustomerSaga(action) {
  try {
    const deleteCustomer = yield call(
      api.deleteCustomer,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(
      actions.deleteCustomerAction.deleteCustomerSuccess(deleteCustomer.data)
    );
  } catch (err) {
    console.error(err);
    yield put(actions.deleteCustomerAction.deleteCustomerFailure(err));
  }
}

function* customerSaga() {
  yield takeLatest(
    getType(actions.getCustomers.getCustomersRequest),
    fetchCustomersSaga
  );
  yield takeLatest(
    actions.createCustomer.createCustomerRequest,
    createCustomerSaga
  );
  yield takeLatest(
    actions.updateCustomer.updateCustomerRequest,
    updateCustomerSaga
  );
  yield takeLatest(
    actions.deleteCustomerAction.deleteCustomerRequest,
    deleteCustomerSaga
  );
}

// generator function ES6

export default customerSaga;
