import { createActions, createAction } from 'redux-actions';

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getCollaborators = createActions({
  getCollaboratorsRequest: undefined,
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

// export const showModal = createAction('SHOW_CREATE_POST_MODAL');
// export const hideModal = createAction('HIDE_CREATE_POST_MODAL');

/*
  getType(getPosts.getPostSuccess)
  =>  
  {
    type: 'getPostSuccess',
    payload: {
      name: 'Test'
    }
  }
*/
