import {
  combineReducers
} from "redux";
import customer from "./customer";
import collaborator from "./collaborator";
import promotion from "./promotion";
import banner from "./banner";
import news from "./news";
import reasons from "./reason";
const rootReducer = combineReducers({
  customer,
  collaborator,
  promotion,
  banner,
  news,
  reasons
});
export default rootReducer;