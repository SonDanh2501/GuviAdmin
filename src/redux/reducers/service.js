import { INIT_STATE } from "../../utils/contant";

import {
  createGroupServiceAction,
  getGroupServiceAction,
  getType,
  updateGroupServiceAction,
} from "../actions/service";

export default function ServiceReducers(state = INIT_STATE.service, action) {
  switch (action.type) {
    case getType(getGroupServiceAction.getGroupServiceRequest):
      return {
        ...state,
      };
    case getType(getGroupServiceAction.getGroupServiceSuccess):
      return {
        ...state,
        groupService: action.payload,
      };
    case getType(getGroupServiceAction.getGroupServiceFailure):
      return {
        ...state,
      };
    case getType(createGroupServiceAction.createGroupServiceSuccess):
      return {
        ...state,
        groupService: [...state.groupService, action.payload],
      };
    case getType(updateGroupServiceAction.updateGroupServiceRequest):
      return {
        ...state,
      };
    default:
      return state;
  }
}
