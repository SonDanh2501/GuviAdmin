import { INIT_STATE } from '../../utils/contant';
import { getBanners, getType, createBanner, updateBanner } from '../actions/banner';

export default function BannersReducers(state = INIT_STATE.banners, action) {
  switch (action.type) {
    case getType(getBanners.getBannersRequest):
      return {
        ...state,
      };
    case getType(getBanners.getBannersSuccess):
      return {
        ...state,
        data: action.payload,
      };
    case getType(getBanners.getBannersFailure):
      return {
        ...state,
      };
    case getType(createBanner.createBannerSuccess):
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case getType(updateBanner.updateBannerSuccess):
      return {
        ...state,
        data: state.data.map((banner) =>
        banner._id === action.payload._id ? action.payload : banner
        ),
      };
    default:
      return state;
  }
}
