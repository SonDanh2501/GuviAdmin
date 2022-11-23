import jwtDecode from "jwt-decode";

import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "../../api/auth";
import { loginAction, logoutAction } from "../actions/auth";
import * as actions from "../actions/banner";

function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);

    const user = jwtDecode(response?.token);
    yield put(loginAction.loginSuccess({ token: response?.token, user: user }));
  } catch (err) {
    console.log(err);
    yield put(loginAction.loginFailure(err));
  }
}
function* logoutSaga(action) {
  try {
    yield put(logoutAction.logoutSuccess({ token: " " }));
  } catch (err) {
    console.log(err);
    yield put(logoutAction.logoutFailure(err));
  }
}

function* AuthSaga() {
  yield takeLatest(loginAction.loginRequest, loginSaga);
  yield takeLatest(logoutAction.logoutRequest, logoutSaga);
}

export default AuthSaga;
