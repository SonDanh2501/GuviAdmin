import { all, fork } from "redux-saga/effects";
import authSaga from "./auth";
import bannerSaga from "./banner";
import brandSaga from "./brand";
import collaboratorSaga from "./collaborator";
import customerSaga from "./customerSaga";
import feedbackSaga from "./feedback";
import loadingSaga from "./loading";
import newsSaga from "./news";
import notificationSaga from "./notification";
import orderSaga from "./order";
import promotionSaga from "./promotion";
import ReasonSaga from "./reason";
import serviceSaga from "./service";
import statisticSaga from "./statistic";
import topupSaga from "./topup";

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
