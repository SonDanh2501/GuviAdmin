import { call, put, takeLatest } from "redux-saga/effects";
import { loginApi } from "../../api/auth";
import { loginAction } from "../actions/auth";
import * as actions from "../actions/banner";

function* loginSaga(action) {
  try {
    const response = yield call(loginApi, action.payload);
    yield put(loginAction.loginSuccess(response?.token));
  } catch (err) {
    console.log(err);
    yield put(loginAction.loginFailure(err));
  }
}

function* AuthSaga() {
  yield takeLatest(loginAction.loginRequest, loginSaga);
}

export default AuthSaga;
