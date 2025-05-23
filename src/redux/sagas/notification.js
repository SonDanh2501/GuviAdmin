import { call, put, takeLatest } from "redux-saga/effects";
import { getListNotification } from "../../api/notification";
import { loadingAction } from "../actions/loading";
import { getNotification, getType } from "../actions/notification";

function* fetchNotificationSaga(action) {
  try {
    const response = yield call(
      getListNotification,
      action.payload.status,
      action.payload.start,
      action.payload.length
    );

    yield put(
      getNotification.getNotificationSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getNotification.getNotificationFailure(err));
  }
}

function* notificationSaga() {
  yield takeLatest(
    getType(getNotification.getNotificationRequest),
    fetchNotificationSaga
  );
}

// generator function ES6

export default notificationSaga;
