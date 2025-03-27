import { call, put, takeLatest } from "redux-saga/effects";
import {
  createPromotion,
  fetchPromotionApi,
  updatePromotion,
} from "../../api/promotion";
import { errorNotify, successNotify } from "../../helper/toast";

import { getType } from "../actions/customerAction";
import { loadingAction } from "../actions/loading";
import {
  createPromotionAction,
  getPromotion,
  updatePromotionAction,
} from "../actions/promotion";

function* fetchPromotionSaga(action) {
  try {
    const promotion = yield call(
      fetchPromotionApi,
      action.payload.start,
      action.payload.length,
      action.payload.type,
      action.payload.brand,
      action.payload.id_service,
      action.payload.exchange
    );
    yield put(
      getPromotion.getPromotionSuccess({
        data: promotion.data,
        total: promotion.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getPromotion.getPromotionFailure(err));
  }
}

function* createPromotionSaga(action) {
  try {
    const promotion = yield call(createPromotion, action.payload);
    window.location.reload();
    successNotify({
      message: "Tạo khuyến mãi thành công",
    });
    yield put(createPromotionAction.createPromotionSuccess(promotion));
  } catch (err) {
    yield put(createPromotionAction.createPromotionFailure(err));
    yield put(loadingAction.loadingRequest(false));
    errorNotify({
      message: err || "Tạo khuyến mãi không thành công",
    });
  }
}

function* updatePromotionSaga(action) {
  try {
    yield call(updatePromotion, action.payload.id, action.payload.data);
    window.location.reload();
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(loadingAction.loadingRequest(false));
  }
}

function* promotionSaga() {
  yield takeLatest(
    getType(getPromotion.getPromotionRequest),
    fetchPromotionSaga
  );
  yield takeLatest(
    getType(createPromotionAction.createPromotionRequest),
    createPromotionSaga
  );
  yield takeLatest(
    getType(updatePromotionAction.updatePromotionRequest),
    updatePromotionSaga
  );
}

// generator function ES6

export default promotionSaga;
