import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/banner";
import * as api from "../../api/banner";
import { getType } from "../actions/banner";
import {
  createGroupServiceApi,
  getGroupServiceApi,
  getServiceApi,
  updateGroupServiceApi,
} from "../../api/service";
import {
  createGroupServiceAction,
  getGroupServiceAction,
  getServiceAction,
  updateGroupServiceAction,
} from "../actions/service";
import { loadingAction } from "../actions/loading";

//group-service

function* fetchGroupServiceSaga() {
  try {
    const response = yield call(getGroupServiceApi);
    yield put(getGroupServiceAction.getGroupServiceSuccess(response.data));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getGroupServiceAction.getGroupServiceFailure(err));
  }
}

function* createGroupServiceSaga(action) {
  try {
    const response = yield call(createGroupServiceApi, action.payload);
    window.location.reload();
    yield put(
      createGroupServiceAction.createGroupServiceSuccess(response.data)
    );
  } catch (err) {
    console.error(err);
    yield put(createGroupServiceAction.createGroupServiceFailure(err));
  }
}

function* updateGroupServiceSaga(action) {
  try {
    const response = yield call(
      updateGroupServiceApi,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(
      updateGroupServiceAction.updateGroupServiceSuccess(response.data)
    );
  } catch (err) {
    console.error(err);
    yield put(updateGroupServiceAction.updateGroupServiceFailure(err));
  }
}

//services
function* fetchServiceSaga() {
  try {
    const response = yield call(getServiceApi);
    yield put(getServiceAction.getServiceSuccess(response.data));
  } catch (err) {
    console.error(err);
    yield put(getServiceAction.getServiceFailure(err));
  }
}

function* ServiceSaga() {
  yield takeLatest(
    getGroupServiceAction.getGroupServiceRequest,
    fetchGroupServiceSaga
  );
  yield takeLatest(
    createGroupServiceAction.createGroupServiceRequest,
    createGroupServiceSaga
  );
  yield takeLatest(
    updateGroupServiceAction.updateGroupServiceRequest,
    updateGroupServiceSaga
  );
  yield takeLatest(getServiceAction.getServiceRequest, fetchServiceSaga);
}

// generator function ES6

export default ServiceSaga;
