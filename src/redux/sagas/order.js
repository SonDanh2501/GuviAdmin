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
      action.payload.length
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
  }
}

// function* createBannerSaga(action) {
//   try {
//     const Banner = yield call(api.createBanner, action.payload);
//     window.location.reload();
//     yield put(actions.createBanner.createBannerSuccess(Banner.data));
//   } catch (err) {
//     yield put(actions.createBanner.createBannerFailure(err));
//   }
// }

// function* updateBannerSaga(action) {
//   try {
//     const updatedBanner = yield call(
//       api.updateBanner,
//       action.payload.id,
//       action.payload.data
//     );
//     window.location.reload();
//     yield put(actions.updateBanner.updateBannerSuccess(updatedBanner.data));
//   } catch (err) {
//     yield put(actions.updateBanner.updateBannerFailure(err));
//   }
// }

function* OrderSaga() {
  yield takeLatest(getType(getOrder.getOrderRequest), fetchOrderSaga);
  // yield takeLatest(actions.createBanner.createBannerRequest, createBannerSaga);
  // yield takeLatest(actions.updateBanner.updateBannerRequest, updateBannerSaga);
}

// generator function ES6

export default OrderSaga;
