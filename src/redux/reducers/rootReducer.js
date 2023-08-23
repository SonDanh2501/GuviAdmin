import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import Auth from "./auth";
import banner from "./banner";
import brand from "./brand";
import collaborator from "./collaborator";
import customer from "./customer";
import feedback from "./feedback";
import loading from "./loading";
import news from "./news";
import notification from "./notification";
import order from "./order";
import promotion from "./promotion";
import reasons from "./reason";
import service from "./service";
import statistic from "./statistic";
import topup from "./topup";

const authPersistConfig = {
  key: "auth",
  storage: storage,
};

const rootReducer = combineReducers({
  customer,
  collaborator,
  promotion,
  banner,
  news,
  reasons,
  auth: persistReducer(authPersistConfig, Auth),
  service,
  brand,
  feedback,
  loading,
  order,
  topup,
  statistic,
  notification,
});
export default rootReducer;
