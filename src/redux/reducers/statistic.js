import { INIT_STATE } from "../../utils/contant";
import {
  getActiveUser,
  getHistoryActivity,
  getLastestService,
  getServiceConnect,
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
    case getType(getActiveUser.getActiveUserRequest):
      return {
        ...state,
      };
    case getType(getActiveUser.getActiveUserSuccess):
      return {
        ...state,
        activeUser: action.payload,
      };
    case getType(getActiveUser.getActiveUserFailure):
      return {
        ...state,
      };
    case getType(getServiceConnect.getServiceConnectRequest):
      return {
        ...state,
      };
    case getType(getServiceConnect.getServiceConnectSuccess):
      return {
        ...state,
        serviceConnect: action.payload,
      };
    case getType(getServiceConnect.getServiceConnectFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
