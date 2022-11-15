import { takeLatest, call, put } from "redux-saga/effects";
import {
  createPromotion,
  deletePromotion,
  fetchPromotion,
  getGroupCustomerPromotion,
  updatePromotion,
} from "../../api/promotion";

import { getType } from "../actions/customerAction";
import {
  createPromotionAction,
  createPromotions,
  deletePromotionAction,
  getPromotion,
  updatePromotionAction,
} from "../actions/promotion";

function* fetchPromotionSaga() {
  try {
    const promotion = yield call(fetchPromotion);
    yield put(
      getPromotion.getPromotionSuccess({
        data: promotion.data,
        total: promotion.totalItem,
      })
    );
  } catch (err) {
    console.error(err);
    yield put(getPromotion.getPromotionFailure(err));
  }
}

function* createPromotionSaga(action) {
  try {
    const promotion = yield call(createPromotion, action.payload);
    yield put(createPromotionAction.createPromotionSuccess(promotion));
  } catch (err) {
    console.error(err);
    yield put(createPromotionAction.createPromotionFailure(err));
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
    if (promo) {
      window.location.reload();
    }
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
