import axiosClient from "../axios";

export const getOrderApi = (start, length, status) => {
  return axiosClient.get(
    `/admin/statistic/job_lists?start=${start}&length=${length}&status=${status}`
  );
};

export const filterOrderApi = (start, length, payload) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?start=${start}&length=${length}&id_service=${payload}`
  );
};

export const searchOrderApi = (start, length, status, value) => {
  return axiosClient.get(
    `/admin/statistic/job_lists?start=${start}&length=${length}&status=${status}&search=${value}`
  );
};

export const getOrderDetailApi = (id) => {
  return axiosClient.get(`/admin/order_manager/get_detail/${id}`);
};
