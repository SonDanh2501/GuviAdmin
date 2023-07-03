import { call, put, takeLatest } from "redux-saga/effects";

import {
  getActiveUserApi,
  getConnectionServicePercentApi,
  getHistoryActivityApi,
  getLastestServiceApi,
  getTopCollaboratorApi,
} from "../../api/statistic";
import { errorNotify } from "../../helper/toast";

import { loadingAction } from "../actions/loading";

import {
  getActiveUser,
  getHistoryActivity,
  getLastestService,
  getServiceConnect,
  getTopCollaborator,
  getType,
} from "../actions/statistic";

function* getHistoryActivitySaga(action) {
  try {
    const response = yield call(
      getHistoryActivityApi,
      action.payload.lang,
      action.payload.start,
      action.payload.length
    );
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
    errorNotify({
      message: err,
    });
    yield put(getActiveUser.getActiveUserFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* getServiceConnectSaga(action) {
  try {
    const response = yield call(getConnectionServicePercentApi);
    yield put(getServiceConnect.getServiceConnectSuccess(response));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    errorNotify({
      message: err,
    });
    yield put(getServiceConnect.getServiceConnectFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* getTopCollaboratorSaga(action) {
  try {
    const response = yield call(
      getTopCollaboratorApi,
      action.payload.startDate,
      action.payload.endDate,
      action.payload.start,
      action.payload.length
    );
    yield put(
      getTopCollaborator.getTopCollaboratorSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    errorNotify({
      message: err,
    });
    yield put(getTopCollaborator.getTopCollaboratorFailure(err));
    yield put(loadingAction.loadingRequest(false));
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
    errorNotify({
      message: err,
    });
    yield put(getLastestService.getLastestServiceFailure(err));
    yield put(loadingAction.loadingRequest(false));
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
  yield takeLatest(
    getTopCollaborator.getTopCollaboratorRequest,
    getTopCollaboratorSaga
  );
}

// generator function ES6

export default StatisticSaga;
