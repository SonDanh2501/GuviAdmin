import { INIT_STATE } from "../../utils/contant";
import {
  getHistoryActivity,
  getLastestService,
  getType,
} from "../actions/statistic";

export default function StatisticReducers(
  state = INIT_STATE.statistic,
  action
) {
  switch (action.type) {
    case getType(getHistoryActivity.getHistoryActivityRequest):
      return {
        ...state,
      };
    case getType(getHistoryActivity.getHistoryActivitySuccess):
      return {
        ...state,
        historyActivity: action.payload,
      };
    case getType(getHistoryActivity.getHistoryActivityFailure):
      return {
        ...state,
      };
    case getType(getLastestService.getLastestServiceRequest):
      return {
        ...state,
      };
    case getType(getLastestService.getLastestServiceSuccess):
      return {
        ...state,
        lastestService: action.payload,
      };
    case getType(getLastestService.getLastestServiceFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
