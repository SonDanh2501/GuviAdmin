import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/reason";
import * as api from "../../api/reasons";
import { getType } from "../actions/reason";
import { getFeedbackApi } from "../../api/feedback";
import { getFeedback } from "../actions/feedback";

function* fetchFeedbackSaga() {
  try {
    const response = yield call(getFeedbackApi);
    yield put(getFeedback.getFeedbackSuccess(response.data));
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
