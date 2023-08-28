import axios from "axios";
import { call, put, takeLatest } from "redux-saga/effects";
import { getPermission, getUserByToken, loginApi } from "../../api/auth";
import { errorNotify, successNotify } from "../../helper/toast";
import { setToken } from "../../helper/tokenHelper";
import {
  getUserAction,
  languageAction,
  loginAction,
  logoutAction,
  permissionAction,
} from "../actions/auth";
import { loadingAction } from "../actions/loading";
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

function* AuthSaga() {
  yield takeLatest(loginAction.loginRequest, loginSaga);
  yield takeLatest(logoutAction.logoutRequest, logoutSaga);
  yield takeLatest(permissionAction.permissionRequest, permissionSaga);
  yield takeLatest(languageAction.languageRequest, languageSaga);
  yield takeLatest(getUserAction.getUserRequest, getUserSaga);
}

export default AuthSaga;
