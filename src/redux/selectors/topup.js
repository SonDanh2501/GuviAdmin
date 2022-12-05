import { rootReducer } from "../reducers/rootReducer";

export const getTopupCTV = (state) => state.topup.data;
export const totalTopupCTV = (state) => state.topup.totalItem;

export const getTopupKH = (state) => state.topup.dataCustomer;
export const totalTopupKH = (state) => state.topup.totalItemCustomer;
