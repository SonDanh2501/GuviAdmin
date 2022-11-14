import axiosClient from "../axios";

export const fetchCustomers = () => {
  return axiosClient.get("/admin/customer_manager/all_items");
};
export const fetchCustomerById = () => {
  return axiosClient.get("/admin/customer_manager/:id");
};
export const createCustomer = (payload) => {
  return axiosClient.post("/admin/customer_manager/create_item", payload);
};
export const updateCustomer = (payload) => {
  return axiosClient.post("/admin/customer_manager/edit_item/:id", payload);
};
export const activeCustomer = (payload) => {
  return axiosClient.post("/admin/customer_manager/acti_item/:id", payload);
};
export const deleteCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/delete_item/${id}`, payload);
};
