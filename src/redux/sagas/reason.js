import {
     takeLatest,
     call,
     put
   } from 'redux-saga/effects';
   import * as actions from '../actions/reason';
   import * as api from '../../api/reasons';
   import {
     getType
   } from '../actions/reason';
   
   function* fetchReasonsSaga() {
     console.log("saga Reason");
     try {
       const Reasons = yield call(api.fetchReasons);
       console.log("saga Reason", Reasons);
   
       yield put(actions.getReasons.getReasonsSuccess(Reasons));
     } catch (err) {
       console.error(err);
       yield put(actions.getReasons.getReasonsFailure(err));
     }
   }
   
   function* createReasonSaga(action) {
     console.log("saga createReasonSaga");
   
     try {
       const Reason = yield call(api.createReason, action.payload);
       yield put(actions.createReason.createReasonSuccess(Reason.data));
     } catch (err) {
       console.error(err);
       yield put(actions.createReason.createReasonFailure(err));
     }
   }
   
   function* updateReasonSaga(action) {
     try {
       const updatedReason = yield call(api.updateReason, action.payload);
       yield put(actions.updateReason.updateReasonSuccess(updatedReason.data));
     } catch (err) {
       console.error(err);
       yield put(actions.updateReason.updateReasonFailure(err));
     }
   }
   
   function* ReasonSaga() {
     yield takeLatest(getType(actions.getReasons.getReasonsRequest), fetchReasonsSaga);
     yield takeLatest(actions.createReason.createReasonRequest, createReasonSaga);
     yield takeLatest(actions.updateReason.updateReasonRequest, updateReasonSaga);
   }
   
   // generator function ES6
   
   export default ReasonSaga;