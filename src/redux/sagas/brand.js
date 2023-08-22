import { put, takeLatest } from "redux-saga/effects";
import { getType } from "../actions/banner";
import { getBrand } from "../actions/brand";

function* brandSaga(action) {
  try {
    yield put(getBrand.getBrandSuccess(action.payload));
  } catch (err) {
    console.error(err);
    yield put(getBrand.getBrandFailure(err));
  }
}

function* BrandSaga() {
  yield takeLatest(getType(getBrand.getBrandRequest), brandSaga);
}

// generator function ES6

export default BrandSaga;
