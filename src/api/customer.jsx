import axiosClient from "../axios";

export const fetchCustomers = (start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_list?start=${start}&length=${length}`
  );
};
export const searchCustomers = (payload) => {
  return axiosClient.get(`/admin/customer_manager/all_items?search=${payload}`);
};
export const fetchCustomerById = (id) => {
  return axiosClient.get(`/admin/customer_manager/${id}`);
};
export const createCustomer = (payload) => {
  return axiosClient.post("/admin/customer_manager/create_item", payload);
};
export const updateCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/edit_item/${id}`, payload);
};
export const activeCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/acti_item/${id}`, payload);
};
export const deleteCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/delete_item/${id}`, payload);
};
