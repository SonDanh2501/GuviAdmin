import { createActions } from "redux-actions";

export const getType = (reduxAction) => {
  return reduxAction().type;
};

export const getNews = createActions({
  getNewsRequest: (payload) => payload,
  getNewsSuccess: (payload) => payload,
  getNewsFailure: (err) => err,
});

export const createNew = createActions({
  createNewRequest: (payload) => payload,
  createNewSuccess: (payload) => payload,
  createNewFailure: (err) => err,
});

export const updateNew = createActions({
  updateNewRequest: (payload) => payload,
  updateNewSuccess: (payload) => payload,
  updateNewFailure: (err) => err,
});
