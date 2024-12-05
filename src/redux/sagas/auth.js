import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { getPermission, getUserByToken, loginApi } from "../../api/auth";
import {
  loginAffiliateApi,
  checkOTPAffiliateApi,
  registerAffiliateApi,
} from "../../api/affeliate";
import { errorNotify, successNotify } from "../../helper/toast";
import { setToken, setTokenAffiliate } from "../../helper/tokenHelper";
import {
  getUserAction,
  languageAction,
  loginAction,
  loginAffiliateAction,
  loginAffiliateWithOTPAction,
  logoutAction,
  permissionAction,
} from "../actions/auth";
import { loadingAction } from "../actions/loading";
import { message } from "antd";
const TestUrl = process.env.REACT_APP_TEST_URL;

function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload.data);
    setToken(response?.token);
    axios
      .get(`${TestUrl}/admin/auth/get_permission_by_token`, {
        headers: {
          Authorization: `Bearer ${response?.token}`,
        },
      })
      .then((res) => {
        res?.data?.forEach((item) => {
          if (item?.id_side_bar === "dashboard") {
            return action.payload.naviga("/");
          } else if (item?.id_side_bar === "guvi_job") {
            return action.payload.naviga("/group-order/manage-order");
          }
        });
      });
    successNotify({
      message: "Đăng nhập thành công",
    });
    yield put(
      loginAction.loginSuccess({
        token: response?.token,
        // permission: permission,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(loginAction.loginFailure(err));
    yield put(loadingAction.loadingRequest(false));
    errorNotify({
      message: err.message
        ? err.message
        : "Đăng nhập không thành công, vui lòng thử lại sau.",
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

function* permissionSaga(action) {
  const checkElement = [];
  try {
    const permission = yield call(getPermission);
    permission?.forEach((item) => {
      item?.id_element?.forEach((i) => {
        checkElement?.push(i);
      });
    });

    yield put(
      permissionAction.permissionSuccess({
        permission: permission,
        element: checkElement,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(permissionAction.permissionFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* languageSaga(action) {
  try {
    yield put(
      languageAction.languageSuccess({
        language: action?.payload?.language,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(languageAction.languageFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* getUserSaga() {
  try {
    const response = yield call(getUserByToken);
    yield put(
      getUserAction.getUserSuccess({
        user: response,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(getUserAction.getUserFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* loginAffiliateSaga(action) {
  try {
    const response = yield call(loginAffiliateApi, action.payload.data);
    setTokenAffiliate(response?.token);
    action.payload.naviga("/");
    successNotify({
      message: "Đăng nhập thành công",
    });
    yield put(
      loginAffiliateAction.loginAffiliateSuccess({
        token: response?.token,
        // permission: permission,
      })
    );
    yield put(loginAffiliateAction.loginAffiliateRequest(false));
  } catch (err) {
    yield put(loginAffiliateAction.loginAffiliateFailure(err));
    yield put(loginAffiliateAction.loadingAffiliateRequest(false));
    errorNotify({
      message: err.message
        ? err.message
        : "Đăng nhập không thành công, vui lòng thử lại sau.",
    });
  }
}

function* loginAffiliateWithOTPSaga(action) {
  try {
    const response = yield call(registerAffiliateApi, action.payload.data);
    setTokenAffiliate(response?.token);
    action.payload.naviga("/");
    successNotify({
      message: "Tạo tài khoản và đăng nhập thành công",
    });
    yield put(
      loginAffiliateWithOTPAction.loginAffiliateWithOTPSuccess({
        token: response?.token,
        user: action.payload.user
      })
    );
    yield put(loginAffiliateWithOTPAction.loginAffiliateWithOTPRequest(false));
  } catch (err) {
    yield put(loginAffiliateAction.loginAffiliateWithOTPFailure(err));
    yield put(loginAffiliateAction.loginAffiliateWithOTPRequest(false));
    errorNotify({
      message: err.message ? err.message : "Tạo tài khoản không thành công",
    });
  }
}

function* AuthSaga() {
  yield takeLatest(loginAction.loginRequest, loginSaga);
  yield takeLatest(logoutAction.logoutRequest, logoutSaga);
  yield takeLatest(permissionAction.permissionRequest, permissionSaga);
  yield takeLatest(languageAction.languageRequest, languageSaga);
  yield takeLatest(getUserAction.getUserRequest, getUserSaga);
  yield takeLatest(
    loginAffiliateAction.loginAffiliateRequest,
    loginAffiliateSaga
  );
  yield takeLatest(
    loginAffiliateWithOTPAction.loginAffiliateWithOTPRequest,
    loginAffiliateWithOTPSaga
  );
}

export default AuthSaga;
