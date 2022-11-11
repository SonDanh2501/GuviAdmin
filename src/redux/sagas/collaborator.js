import {
  takeLatest,
  call,
  put
} from 'redux-saga/effects';
import * as actions from '../actions/collaborator';
import * as api from '../../api/collaborator.jsx';
import {
  getType
} from '../actions/collaborator';

function* fetchCollaboratorsSaga() {
  // console.log("saga collaborator");
  try {
    const Collaborators = yield call(api.fetchCollaborators);
    // console.log("saga collaborator", Collaborators);

    yield put(actions.getCollaborators.getCollaboratorsSuccess(Collaborators));
  } catch (err) {
    console.error(err);
    yield put(actions.getCollaborators.getCollaboratorsFailure(err));
  }
}

function* createCollaboratorSaga(action) {
  console.log("saga createCollaboratorSaga");

  try {
    const Collaborator = yield call(api.createCollaborator, action.payload);
    yield put(actions.createCollaborator.createCustomerSuccess(Collaborator.data));
  } catch (err) {
    console.error(err);
    yield put(actions.createCollaborator.createCollaboratorFailure(err));
  }
}

function* updateCollaboratorSaga(action) {
  try {
    const updatedCollaborator = yield call(api.updateCollaborator, action.payload);
    yield put(actions.updateCollaborator.updateCollaboratorSuccess(updatedCollaborator.data));
  } catch (err) {
    console.error(err);
    yield put(actions.updateCollaborator.updateCollaboratorFailure(err));
  }
}

function* collaboratorSaga() {
  yield takeLatest(getType(actions.getCollaborators.getCollaboratorsRequest), fetchCollaboratorsSaga);
  yield takeLatest(actions.createCollaborator.createCollaboratorRequest, createCollaboratorSaga);
  yield takeLatest(actions.updateCollaborator.updateCollaboratorRequest, updateCollaboratorSaga);
}

// generator function ES6

export default collaboratorSaga;