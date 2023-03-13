import { INIT_STATE } from "../../utils/contant";
import { getNotification, getType } from "../actions/notification";

export default function NotificationReducers(
  state = INIT_STATE.notification,
  action
) {
  switch (action.type) {
    case getType(getNotification.getNotificationRequest):
      return {
        ...state,
      };
    case getType(getNotification.getNotificationSuccess):
      return {
        ...state,
        data: action.payload.data,
        totalItem: action.payload.total,
      };
    case getType(getNotification.getNotificationFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
