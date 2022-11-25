import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/reason";
import * as api from "../../api/reasons";
import { getType } from "../actions/reason";
import { getFeedbackApi } from "../../api/feedback";
import { getFeedback } from "../actions/feedback";
import { loadingAction } from "../actions/loading";

function* fetchFeedbackSaga(action) {
  try {
    const response = yield call(
      getFeedbackApi,
      action.payload.start,
      action.payload.length
    );
    yield put(
      getFeedback.getFeedbackSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    console.error(err);
    yield put(getFeedback.getFeedbackFailure(err));
  }
}

function* FeedbackSaga() {
  yield takeLatest(getType(getFeedback.getFeedbackRequest), fetchFeedbackSaga);
}

// generator function ES6

export default FeedbackSaga;
