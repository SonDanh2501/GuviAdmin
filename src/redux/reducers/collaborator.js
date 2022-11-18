import { INIT_STATE } from "../../utils/contant";
import {
  getCollaborators,
  getType,
  createCollaborator,
  updateCollaborator,
} from "../actions/collaborator";

export default function CollaboratorsReducers(
  state = INIT_STATE.collaborators,
  action
) {
  switch (action.type) {
    case getType(getCollaborators.getCollaboratorsRequest):
      return {
        ...state,
      };
    case getType(getCollaborators.getCollaboratorsSuccess):
      return {
        ...state,
        data: action.payload.data,
        totalItem: action.payload.total,
      };
    case getType(getCollaborators.getCollaboratorsFailure):
      return {
        ...state,
      };
    case getType(createCollaborator.createCollaboratorSuccess):
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case getType(updateCollaborator.updateCollaboratorSuccess):
      return {
        ...state,
        data: state.data.map((collaborator) =>
          collaborator._id === action.payload._id
            ? action.payload
            : collaborator
        ),
      };
    default:
      return state;
  }
}
