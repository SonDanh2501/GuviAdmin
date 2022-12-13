import axiosClient from "../axios";

export const getOrderApi = (start, length) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?start=${start}&length=${length}`
  );
};

export const getOrderStatusApi = (status, start, length) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?status=${status}&start=${start}&length=${length}`
  );
};

export const filterOrderApi = (start, length, payload) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?start=${start}&length=${length}&id_service=${payload}`
  );
};

export const searchOrderApi = (start, length, payload) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?start=${start}&length=${length}&search=${payload}`
  );
};
