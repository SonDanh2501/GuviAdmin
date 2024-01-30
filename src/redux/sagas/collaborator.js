import { call, put, takeLatest } from "redux-saga/effects";
import * as api from "../../api/collaborator.jsx";
import { errorNotify } from "../../helper/toast";
import * as actions from "../actions/collaborator";
import { getType } from "../actions/collaborator";
import { loadingAction } from "../actions/loading";

function* fetchCollaboratorsSaga(action) {
  try {
    const resoponse = yield call(
      api.fetchCollaborators,
      action.payload.start,
      action.payload.length,
      action.payload.type
    );

    yield put(
      actions.getCollaborators.getCollaboratorsSuccess({
        data: resoponse.data,
        total: resoponse.totalItems,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.getCollaborators.getCollaboratorsFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* createCollaboratorSaga(action) {
  try {
    const Collaborator = yield call(api.createCollaborator, action.payload);
    window.location.reload();
    yield put(
      actions.createCollaborator.createCollaboratorSuccess(Collaborator.data)
    );
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.createCollaborator.createCollaboratorFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* updateCollaboratorSaga(action) {
  try {
    const updatedCollaborator = yield call(
      api.updateCollaborator,
      action.payload.id,
      action.payload.data
    );
    window.location.reload();
    yield put(
      actions.updateCollaborator.updateCollaboratorSuccess(
        updatedCollaborator.data
      )
    );
  } catch (err) {
    errorNotify({
      message: err?.message,
    });
    yield put(actions.updateCollaborator.updateCollaboratorFailure(err));
    yield put(loadingAction.loadingRequest(false));
  }
}

function* collaboratorSaga() {
  yield takeLatest(
    getType(actions.getCollaborators.getCollaboratorsRequest),
    fetchCollaboratorsSaga
  );
  yield takeLatest(
    actions.createCollaborator.createCollaboratorRequest,
    createCollaboratorSaga
  );
  yield takeLatest(
    actions.updateCollaborator.updateCollaboratorRequest,
    updateCollaboratorSaga
  );
}

// generator function ES6

export default collaboratorSaga;
