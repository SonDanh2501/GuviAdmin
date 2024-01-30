import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/news";
import * as api from "../../api/news";
import { getType } from "../actions/news";
import { loadingAction } from "../actions/loading";
import { errorNotify } from "../../helper/toast";

function* fetchNewsSaga(action) {
  try {
    const response = yield call(
      api.fetchNews,
      action.payload.start,
      action.payload.length
    );

    yield put(
      actions.getNews.getNewsSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(actions.getNews.getNewsFailure(err));
  }
}

function* createNewSaga(action) {
  try {
    const New = yield call(api.createNew, action.payload);
    window.location.reload();
    yield put(actions.createNew.createNewSuccess(New.data));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(loadingAction.loadingRequest(false));
    yield put(actions.createNew.createNewFailure(err));
  }
}

function* updateNewSaga(action) {
  try {
    const updatedNew = yield call(
      api.updateNew,
      action.payload.id,
      action.payload.data
    );

    window.location.reload();
    yield put(actions.updateNew.updateNewSuccess(updatedNew.data));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(loadingAction.loadingRequest(false));
    yield put(actions.updateNew.updateNewFailure(err));
  }
}

function* newsSaga() {
  yield takeLatest(getType(actions.getNews.getNewsRequest), fetchNewsSaga);
  yield takeLatest(actions.createNew.createNewRequest, createNewSaga);
  yield takeLatest(actions.updateNew.updateNewRequest, updateNewSaga);
}

// generator function ES6

export default newsSaga;
