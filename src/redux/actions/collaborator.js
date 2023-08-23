import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getCollaborators = createActions({
  getCollaboratorsRequest: (payload) => payload,
  getCollaboratorsSuccess: (payload) => payload,
  getCollaboratorsFailure: (err) => err,
});

export const createCollaborator = createActions({
  createCollaboratorRequest: (payload) => payload,
  createCollaboratorSuccess: (payload) => payload,
  createCollaboratorFailure: (err) => err,
});

export const updateCollaborator = createActions({
  updateCollaboratorRequest: (payload) => payload,
  updateCollaboratorSuccess: (payload) => payload,
  updateCollaboratorFailure: (err) => err,
});
