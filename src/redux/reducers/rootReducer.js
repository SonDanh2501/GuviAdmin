import { combineReducers } from "redux";
import customer from "./customer";
import collaborator from "./collaborator";
import promotion from "./promotion";

const rootReducer = combineReducers({
  customer,
  collaborator,
  promotion,
});
export default rootReducer;
