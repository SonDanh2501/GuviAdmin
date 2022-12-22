import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../actions/collaborator";
import * as api from "../../api/collaborator.jsx";
import { getType } from "../actions/collaborator";
import { Alert } from "reactstrap";
import { loadingAction } from "../actions/loading";
import { errorNotify } from "../../helper/toast";

function* fetchCollaboratorsSaga(action) {
  try {
    const resoponse = yield call(
      api.fetchCollaborators,
      action.payload.start,
      action.payload.length
    );

    yield put(
      actions.getCollaborators.getCollaboratorsSuccess({
        data: resoponse.data,
        total: resoponse.totalItem,
      })
    );
    yield put(loadingAction.loadingRequest(false));
  } catch (err) {
    errorNotify({
      message: err,
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
      message: err,
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
      message: err,
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
