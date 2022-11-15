import { INIT_STATE } from '../../utils/contant';
import { getReasons, getType, createReason, updateReason } from '../actions/reason';

export default function ReasonsReducers(state = INIT_STATE.reasons, action) {
  switch (action.type) {
    case getType(getReasons.getReasonsRequest):
      return {
        ...state,
      };
    case getType(getReasons.getReasonsSuccess):
      return {
        ...state,
        data: action.payload,
      };
    case getType(getReasons.getReasonsFailure):
      return {
        ...state,
      };
    case getType(createReason.createReasonSuccess):
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case getType(updateReason.updateReasonSuccess):
      return {
        ...state,
        data: state.data.map((reason) =>
        reason._id === action.payload._id ? action.payload : reason
        ),
      };
    default:
      return state;
  }
}
