import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/banner";
import * as api from "../../api/banner";
import { getType } from "../actions/banner";
import {
  createGroupServiceApi,
  getGroupServiceApi,
  getListService,
  getServiceApi,
  updateGroupServiceApi,
} from "../../api/service";
import {
  createGroupServiceAction,
  getGroupServiceAction,
  getProvinceAction,
  getServiceAction,
  updateGroupServiceAction,
} from "../actions/service";
import { loadingAction } from "../actions/loading";
import { getDistrictApi } from "../../api/file";

//group-service

function* fetchGroupServiceSaga(action) {
  try {
    const response = yield call(
      getGroupServiceApi,
      action.payload.start,
      action.payload.length
    );
    yield put(
      getGroupServiceAction.getGroupServiceSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(loadingAction.loadingRequest(false));
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
    const response = yield call(getListService);
    yield put(getServiceAction.getServiceSuccess(response.data));
  } catch (err) {
    console.error(err);
    yield put(getServiceAction.getServiceFailure(err));
  }
}
//province
function* fetchProvinceSaga() {
  try {
    const response = yield call(getDistrictApi);
    yield put(
      getProvinceAction.getProvinceSuccess(response?.aministrative_division)
    );
  } catch (err) {
    console.error(err);
    yield put(getProvinceAction.getProvinceFailure(err));
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
  yield takeLatest(getProvinceAction.getProvinceRequest, fetchProvinceSaga);
}

// generator function ES6

export default ServiceSaga;
