import axiosClient from "../axios";

export const getOrderApi = (start, length) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?start=${start}&length=${length}`
  );
};
// export const createNew = (payload) => {
//   return axiosClient.post("/admin/news_manager/create_item", payload);
// };

// export const updateNew = (id, payload) => {
//   return axiosClient.post(`/admin/news_manager/edit_item/${id}`, payload);
// };
// export const activeNew = (id, payload) => {
//   return axiosClient.post(`/admin/news_manager/active/${id}`, payload);
// };
// export const deleteNew = (id) => {
//   return axiosClient.get(`/admin/news_manager/delete/${id}`);
// };
