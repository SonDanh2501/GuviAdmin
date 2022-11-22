import { INIT_STATE } from "../../utils/contant";

import {
  createGroupServiceAction,
  getGroupServiceAction,
  getServiceAction,
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
    case getType(getServiceAction.getServiceRequest):
      return {
        ...state,
      };
    case getType(getServiceAction.getServiceSuccess):
      return {
        ...state,
        services: action.payload,
      };
    case getType(getServiceAction.getServiceFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
