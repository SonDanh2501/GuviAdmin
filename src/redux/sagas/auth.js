import jwtDecode from "jwt-decode";

import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "../../api/auth";
import { errorNotify, successNotify } from "../../helper/toast";
import { setToken } from "../../helper/tokenHelper";
import { loginAction, logoutAction } from "../actions/auth";
import * as actions from "../actions/banner";
import { loadingAction } from "../actions/loading";

function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload.data);
    setToken(response?.token);
    const user = jwtDecode(response?.token);
    successNotify({
      message: "Đăng nhập thành công",
    });
    action.payload.naviga("/");
    yield put(loginAction.loginSuccess({ token: response?.token, user: user }));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(loginAction.loginFailure(err));
    errorNotify({
      message:
        err.response.data.response[0].message ||
        "Đăng nhập không thành công, vui lòng thử lại sau.",
    });
    yield put(loadingAction.loadingRequest(false));
  }
}
function* logoutSaga(action) {
  try {
    yield put(logoutAction.logoutSuccess({ token: " " }));
    successNotify({
      message: "Đăng xuất thành công",
    });
    action.payload("/auth/login", { replace: true });
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(logoutAction.logoutFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* AuthSaga() {
  yield takeLatest(loginAction.loginRequest, loginSaga);
  yield takeLatest(logoutAction.logoutRequest, logoutSaga);
}

export default AuthSaga;
