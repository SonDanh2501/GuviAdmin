import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import { PersistConfig, persistReducer } from "redux-persist";
import customer from "./customer";
import collaborator from "./collaborator";
import promotion from "./promotion";
import banner from "./banner";
import news from "./news";
import reasons from "./reason";
import service from "./service";
import Auth from "./auth";

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
});
export default rootReducer;
