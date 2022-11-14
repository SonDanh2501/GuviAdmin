import customerSaga from "./customerSaga";
import collaborator from "./collaborator";

import { take, put, call, fork, cancel, all } from "redux-saga/effects";
import promotionSaga from "./promotion";

export default function* rootSaga() {
  yield all([fork(customerSaga), fork(collaborator), fork(promotionSaga)]);
}
