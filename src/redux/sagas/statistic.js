import { call, put, takeLatest } from "redux-saga/effects";

import {
  getHistoryActivityApi,
  getLastestServiceApi,
} from "../../api/statistic";

import { loadingAction } from "../actions/loading";

import {
  getHistoryActivity,
  getLastestService,
  getType,
} from "../actions/statistic";

function* getHistoryActivitySaga(action) {
  try {
    const response = yield call(getHistoryActivityApi);
    yield put(getHistoryActivity.getHistoryActivitySuccess(response.data));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getHistoryActivity.getHistoryActivityFailure(err));
  }
}

function* getLastestServiceSaga(action) {
  try {
    const response = yield call(getLastestServiceApi);
    yield put(getLastestService.getLastestServiceSuccess(response.data));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getLastestService.getLastestServiceFailure(err));
  }
}

function* StatisticSaga() {
  yield takeLatest(
    getType(getHistoryActivity.getHistoryActivityRequest),
    getHistoryActivitySaga
  );
  yield takeLatest(
    getType(getLastestService.getLastestServiceRequest),
    getLastestServiceSaga
  );
}

// generator function ES6

export default StatisticSaga;
