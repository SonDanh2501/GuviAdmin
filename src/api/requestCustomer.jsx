import axiosClient from "../axios";

export const getCusomerRequest = (search, start, length, status, lang, contacted) => {
  return axiosClient.get(
    `/admin/customer_request_manager/get_list?search=${search}&status=${status}&start=${start}&length=${length}&lang=${lang}&contacted=${contacted || "all"}`
  );
};

export const deleteCusomerRequest = (id) => {
  return axiosClient.post(
    `/admin/customer_request_manager/delete_customer_request/${id}`
  );
};

export const contactedCusomerRequest = (id) => {
  return axiosClient.post(`/admin/customer_request_manager/contact/${id}`);
};

export const changeStatusCusomerRequest = (id, data) => {
  return axiosClient.post(
    `/admin/customer_request_manager/change_status/${id}`,
    data
  );
};
