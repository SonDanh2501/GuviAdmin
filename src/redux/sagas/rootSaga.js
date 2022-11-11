import customerSaga from "./customerSaga"
import { take, put, call, fork, cancel ,all} from 'redux-saga/effects'

export default function* rootSaga () {
     yield all([
         fork(customerSaga), // saga1 can also yield [ fork(actionOne), fork(actionTwo) ]
     //     fork(saga2),
     ]);
 }