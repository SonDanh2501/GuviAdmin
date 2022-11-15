import {
  take,
  put,
  call,
  fork,
  cancel,
  all
} from "redux-saga/effects";
import customerSaga from "./customerSaga";
import collaboratorSaga from "./collaborator";
import bannerSaga from "./banner";
import promotionSaga from "./promotion";
import newsSaga from "./news";
import ReasonSaga from "./reason";


export default function* rootSaga() {
  yield all([
    fork(customerSaga),
    fork(collaboratorSaga),
    fork(promotionSaga),
    fork(bannerSaga),
    fork(newsSaga),
    fork(ReasonSaga),

  ]);
}