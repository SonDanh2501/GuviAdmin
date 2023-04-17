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
    if (user.role === "admin") {
      action.payload.naviga("/");
    } else if (user.role === "marketing" || user.role === "marketing-manager") {
      action.payload.naviga("/promotion/manage-setting");
    } else if (user.role === "support_customer") {
      action.payload.naviga("/group-order/manage-order");
    } else if (user.role === "accountant") {
      action.payload.naviga("/topup/manage-topup");
    } else if (user.role === "support") {
      action.payload.naviga("/group-order/manage-order");
    }
    yield put(loginAction.loginSuccess({ token: response?.token, user: user }));
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(loginAction.loginFailure(err));
    yield put(loadingAction.loadingRequest(false));
    errorNotify({
      message: err || "Đăng nhập không thành công, vui lòng thử lại sau.",
    });
  }
}
function* logoutSaga(action) {
  try {
    yield put(logoutAction.logoutSuccess({ token: " " }));
    successNotify({
      message: "Đã đăng xuất",
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
