import {
  rootReducer
} from '../reducers/rootReducer'

export const getNews = (state) =>
  state.news.data.data;

