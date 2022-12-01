import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/banner";
import * as api from "../../api/banner";
import { getType } from "../actions/banner";
import { loadingAction } from "../actions/loading";
import { getTopupCollaboratorApi } from "../../api/topup";
import { getTopupCollaborator } from "../actions/topup";

function* fetchTopupCollaboratorSaga(action) {
  try {
    const response = yield call(
      getTopupCollaboratorApi,
      action.payload.start,
      action.payload.length
    );

    yield put(
      getTopupCollaborator.getTopupCollaboratorSuccess({
        data: response.data,
        total: response.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    yield put(loadingAction.loadingRequest(false));
    yield put(getTopupCollaborator.getTopupCollaboratorFailure(err));
  }
}

function* TopupSaga() {
  yield takeLatest(
    getType(getTopupCollaborator.getTopupCollaboratorRequest),
    fetchTopupCollaboratorSaga
  );
}

// generator function ES6

export default TopupSaga;
