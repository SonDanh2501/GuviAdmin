import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "../../api/auth";
import { loginAction } from "../actions/auth";
import * as actions from "../actions/banner";

function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);
    yield put(loginAction.loginSuccess(response?.token));
  } catch (err) {
    console.error(err);
    yield put(actions.getBanners.getBannersFailure(err));
  }
}

function* AuthSaga() {
  yield takeLatest(loginAction.loginRequest, loginSaga);
}

export default AuthSaga;
