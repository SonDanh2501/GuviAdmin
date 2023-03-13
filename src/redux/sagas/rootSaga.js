import { take, put, call, fork, cancel, all } from "redux-saga/effects";
import customerSaga from "./customerSaga";
import collaboratorSaga from "./collaborator";
import bannerSaga from "./banner";
import promotionSaga from "./promotion";
import newsSaga from "./news";
import authSaga from "./auth";
import serviceSaga from "./service";
import ReasonSaga from "./reason";
import brandSaga from "./brand";
import feedbackSaga from "./feedback";
import loadingSaga from "./loading";
import orderSaga from "./order";
import topupSaga from "./topup";
import statisticSaga from "./statistic";
import notificationSaga from "./notification";

export default function* rootSaga() {
  yield all([
    fork(customerSaga),
    fork(collaboratorSaga),
    fork(promotionSaga),
    fork(bannerSaga),
    fork(newsSaga),
    fork(ReasonSaga),
    fork(authSaga),
    fork(serviceSaga),
    fork(brandSaga),
    fork(feedbackSaga),
    fork(loadingSaga),
    fork(orderSaga),
    fork(topupSaga),
    fork(statisticSaga),
    fork(notificationSaga),
  ]);
}
