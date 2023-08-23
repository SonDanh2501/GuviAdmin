import { call, put, takeLatest } from "redux-saga/effects";
import { getOrderApi } from "../../api/order";

import { getType } from "../actions/banner";
import { loadingAction } from "../actions/loading";
import { getOrder } from "../actions/order";

function* fetchOrderSaga(action) {
  try {
    const response = yield call(
      getOrderApi,
      action.payload.start,
      action.payload.length,
      action.payload.status,
      action.payload.kind
    );
    yield put(
      getOrder.getOrderSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(getOrder.getOrderFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

// function* searchOrderSaga(action) {
//   try {
//     const response = yield call(
//       searchOrderApi,
//       action.payload.start,
//       action.payload.length,
//       action.payload.status,
//       action.payload.value,
//       action.payload.kind
//     );
//     yield put(
//       searchOrder.searchOrderSuccess({
//         data: response.data,
//         total: response.totalItem,
//       })
//     );
//     yield put(loadingAction.loadingRequest(false));
//   } catch (err) {
//     yield put(searchOrder.searchOrderFailure(err));
//     yield put(loadingAction.loadingRequest(false));
//   }
// }

function* OrderSaga() {
  yield takeLatest(getType(getOrder.getOrderRequest), fetchOrderSaga);
  // yield takeLatest(searchOrder.searchOrderRequest, searchOrderSaga);
}

// generator function ES6

export default OrderSaga;
