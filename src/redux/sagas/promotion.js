import { takeLatest, call, put } from "redux-saga/effects";
import {
  createPromotion,
  deletePromotion,
  fetchPromotion,
  getGroupCustomerPromotion,
  updatePromotion,
} from "../../api/promotion";
import { errorNotify, successNotify } from "../../helper/toast";

import { getType } from "../actions/customerAction";
import { loadingAction } from "../actions/loading";
import {
  createPromotionAction,
  createPromotions,
  deletePromotionAction,
  getPromotion,
  updatePromotionAction,
} from "../actions/promotion";

function* fetchPromotionSaga(action) {
  try {
    const promotion = yield call(
      fetchPromotion,
      action.payload.start,
      action.payload.length
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
    errorNotify({
      message:
        err.response.data[0].message || "Tạo khuyến mãi không thành công",
    });
  }
}

function* updatePromotionSaga(action) {
  try {
    const promotion = yield call(
      updatePromotion,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
  } catch (err) {
    console.error(err);
  }
}

function* deletePromotionSaga(action) {
  try {
    const promo = yield call(deletePromotion, action.payload);

    window.location.reload();
  } catch (err) {
    console.error(err);
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
  yield takeLatest(
    getType(deletePromotionAction.deletePromotionRequest),
    deletePromotionSaga
  );
}

// generator function ES6

export default promotionSaga;
