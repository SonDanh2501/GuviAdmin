import { INIT_STATE } from "../../utils/contant";
import { getFeedback, getType } from "../actions/feedback";

export default function FeedbackReducers(state = INIT_STATE.feedback, action) {
  switch (action.type) {
    case getType(getFeedback.getFeedbackRequest):
      return {
        ...state,
      };
    case getType(getFeedback.getFeedbackSuccess):
      return {
        ...state,
        data: action.payload,
      };
    case getType(getFeedback.getFeedbackFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
