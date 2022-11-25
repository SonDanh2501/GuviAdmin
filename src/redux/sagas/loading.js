import { put, takeLatest } from "redux-saga/effects";
import { getType } from "../actions/banner";
import { loadingAction } from "../actions/loading";

function* loadingSaga(action) {
  try {
    yield put(loadingAction.loadingSuccess(action.payload));
  } catch (err) {
    console.error(err);
    yield put(loadingAction.loadingFailure(err));
  }
}

function* LoadingSaga() {
  yield takeLatest(getType(loadingAction.loadingRequest), loadingSaga);
}

// generator function ES6

export default LoadingSaga;
