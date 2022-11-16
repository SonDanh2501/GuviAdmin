import { INIT_STATE } from "../../utils/contant";
import {
  getCustomers,
  getType,
  createCustomer,
  updateCustomer,
  deleteCustomerAction,
} from "../actions/customerAction";

export default function CustomersReducers(
  state = INIT_STATE.customers,
  action
) {
  switch (action.type) {
    case getType(getCustomers.getCustomersRequest):
      return {
        ...state,
      };
    case getType(getCustomers.getCustomersSuccess):
      return {
        ...state,
        data: action.payload,
      };
    case getType(getCustomers.getCustomersFailure):
      return {
        ...state,
      };
    case getType(createCustomer.createCustomerSuccess):
      return {
        ...state,
        data: [...state.data, action.payload],
      };
    case getType(updateCustomer.updateCustomerSuccess):
      return {
        ...state,
        data: state.data.map((customer) =>
          customer._id === action.payload._id ? action.payload : customer
        ),
      };
    case getType(deleteCustomerAction.deleteCustomerSuccess):
      return {
        ...state,
      };
    default:
      return state;
  }
}
