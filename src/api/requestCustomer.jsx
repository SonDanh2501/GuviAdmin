import axiosClient from "../axios";

export const getCusomerRequest = (status, start, length, contacted) => {
  return axiosClient.get(
    `/admin/customer-request-manager/get_list?status=${status}&start=${start}&length=${length}&contacted=${contacted}`
  );
};

export const deleteCusomerRequest = (id) => {
  return axiosClient.post(
    `/admin/customer-request-manager/delete_customer_request/${id}`
  );
};

export const contactedCusomerRequest = (id) => {
  return axiosClient.post(`/admin/customer-request-manager/contact/${id}`);
};

export const changeStatusCusomerRequest = (id, data) => {
  return axiosClient.post(
    `/admin/customer-request-manager/change_status/${id}`,
    data
  );
};
