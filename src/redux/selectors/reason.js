import {
  rootReducer
} from '../reducers/rootReducer'

export const getReason = (state) =>
  state.reasons.data.data;