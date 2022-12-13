import { call, put, takeLatest } from "redux-saga/effects";

import {
  getActiveUserApi,
  getConnectionServicePercentApi,
  getHistoryActivityApi,
  getLastestServiceApi,
} from "../../api/statistic";

import { loadingAction } from "../actions/loading";

import {
  getActiveUser,
  getHistoryActivity,
  getLastestService,
  getServiceConnect,
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

function* getActiveUserSaga(action) {
  try {
    const response = yield call(getActiveUserApi);
    yield put(getActiveUser.getActiveUserSuccess(response));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getActiveUser.getActiveUserFailure(err));
  }
}

function* getServiceConnectSaga(action) {
  try {
    const response = yield call(getConnectionServicePercentApi);
    yield put(getServiceConnect.getServiceConnectSuccess(response));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getServiceConnect.getServiceConnectFailure(err));
  }
}

function* getLastestServiceSaga(action) {
  try {
    const response = yield call(
      getLastestServiceApi,
      action.payload.start,
      action.payload.length
    );
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
    getLastestService.getLastestServiceRequest,
    getLastestServiceSaga
  );
  yield takeLatest(
    getType(getActiveUser.getActiveUserRequest),
    getActiveUserSaga
  );
  yield takeLatest(
    getServiceConnect.getServiceConnectRequest,
    getServiceConnectSaga
  );
}

// generator function ES6

export default StatisticSaga;
