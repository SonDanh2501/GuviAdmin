import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/reason";
import * as api from "../../api/reasons";
import { getType } from "../actions/reason";
import { loadingAction } from "../actions/loading";

function* fetchReasonsSaga(action) {
  try {
    const response = yield call(
      api.fetchReasons,
      action.payload.start,
      action.payload.length
    );
    yield put(
      actions.getReasons.getReasonsSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(actions.getReasons.getReasonsFailure(err));
  }
}

function* createReasonSaga(action) {
  try {
    const Reason = yield call(api.createReason, action.payload);
    window.location.reload();
    yield put(actions.createReason.createReasonSuccess(Reason.data));

    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(actions.createReason.createReasonFailure(err));
  }
}

function* updateReasonSaga(action) {
  try {
    const updatedReason = yield call(
      api.updateReason,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(actions.updateReason.updateReasonSuccess(updatedReason.data));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(actions.updateReason.updateReasonFailure(err));
  }
}

function* ReasonSaga() {
  yield takeLatest(
    getType(actions.getReasons.getReasonsRequest),
    fetchReasonsSaga
  );
  yield takeLatest(actions.createReason.createReasonRequest, createReasonSaga);
  yield takeLatest(actions.updateReason.updateReasonRequest, updateReasonSaga);
}

// generator function ES6

export default ReasonSaga;
