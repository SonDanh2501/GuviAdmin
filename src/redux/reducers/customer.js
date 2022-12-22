import { INIT_STATE } from "../../utils/contant";
import {
  getCustomers,
  getType,
  createCustomer,
  updateCustomer,
  deleteCustomerAction,
  getGroupCustomers,
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
        data: action.payload.data,
        totalItem: action.payload.total,
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
    case getType(getGroupCustomers.getGroupCustomersRequest):
      return {
        ...state,
      };
    case getType(getGroupCustomers.getGroupCustomersSuccess):
      return {
        ...state,
        groupCustomer: action.payload.data,
        totalGroupCustomer: action.payload.total,
      };
    case getType(getGroupCustomers.getGroupCustomersFailure):
      return {
        ...state,
      };
    default:
      return state;
  }
}
