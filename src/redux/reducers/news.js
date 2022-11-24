import { INIT_STATE } from "../../utils/contant";
import { getNews, getType, createNew, updateNew } from "../actions/news";

export default function NewsReducers(state = INIT_STATE.news, action) {
  switch (action.type) {
    case getType(getNews.getNewsRequest):
      return {
        ...state,
      };
    case getType(getNews.getNewsSuccess):
      return {
        ...state,
        data: action.payload.data,
        totalItem: action.payload.total,
      };
    case getType(getNews.getNewsFailure):
      return {
        ...state,
      };
    case getType(createNew.createNewSuccess):
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case getType(updateNew.updateNewSuccess):
      return {
        ...state,
        data: state.data.map((news) =>
          news._id === action.payload._id ? action.payload : news
        ),
      };
    default:
      return state;
  }
}
