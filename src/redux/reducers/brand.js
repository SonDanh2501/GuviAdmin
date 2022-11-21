import { INIT_STATE } from "../../utils/contant";
import { getBrand, getType } from "../actions/brand";

export default function BrandReducers(state = INIT_STATE.brand, action) {
  switch (action.type) {
    case getType(getBrand.getBrandRequest):
      return {
        ...state,
      };
    case getType(getBrand.getBrandSuccess):
      return {
        ...state,
        title: action.payload,
      };
    case getType(getBrand.getBrandFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
