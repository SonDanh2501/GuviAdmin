import axiosClient from "../axios";

export const fetchCustomers = (start, length, type) => {
  return axiosClient.get(
    `/admin/customer_manager/get_customer_by_type?start=${start}&length=${length}&customer_type=${type}`
  );
};
export const searchCustomers = (start, length, type, payload) => {
  return axiosClient.get(
    `/admin/customer_manager/get_customer_by_type?start=${start}&length=${length}&customer_type=${type}&search=${payload}`
  );
};
export const fetchCustomerById = (id) => {
  return axiosClient.get(`/admin/customer_manager/get_detail/${id}`);
};
export const createCustomer = (payload) => {
  return axiosClient.post("/admin/customer_manager/create_item", payload);
};
export const updateCustomer = (id, payload) => {
  return axiosClient.post(
    `/admin/customer_manager/edit_item/${id}?lang=vi`,
    payload
  );
};
export const activeCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/acti_item/${id}`, payload);
};
export const deleteCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/delete_item/${id}`, payload);
};

export const getOrderByCustomers = (id, start, length) => {
  return axiosClient.get(
    `/admin/order_manager/get_order_by_customer/${id}?start=${start}&length=${length}`
  );
};

export const updatePointCustomer = (id, payload) => {
  return axiosClient.post(
    `/admin/customer_manager/edit_point_and_rank_point/${id}?lang=vi`,
    payload
  );
};

export const getHistoryTransitionByCustomers = (id, start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_history_activity_customer/${id}?start=${start}&length=${length}`
  );
};
