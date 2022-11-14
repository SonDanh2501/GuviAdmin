import { takeLatest, call, put } from "redux-saga/effects";
import { fetchPromotion } from "../../api/promotion";

import { getType } from "../actions/customerAction";
import { getPromotion } from "../actions/promotion";

function* fetchPromotionSaga() {
  try {
    const promotion = yield call(fetchPromotion);
    yield put(getPromotion.getPromotionSuccess(promotion.data));
  } catch (err) {
    console.error(err);
    yield put(getPromotion.getPromotionFailure(err));
  }
}

function* promotionSaga() {
  yield takeLatest(
    getType(getPromotion.getPromotionRequest),
    fetchPromotionSaga
  );
}

// generator function ES6

export default promotionSaga;
