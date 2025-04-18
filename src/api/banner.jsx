import axiosClient from "../axios";
export const createBanner = (payload) => {
  return axiosClient.post("/admin/banner_manager/create_item", payload);
};
export const fetchBanners = (start, length) => {
  return axiosClient.get(
    `/admin/banner_manager/get_list?start=${start}&length=${length}`
  );
};
export const searchBanners = (payload) => {
  return axiosClient.get(`/admin/banner_manager/get_list?search=${payload}`);
};
export const fetchBannerById = () => {
  return axiosClient.get("/admin/banner_manager/get_detail_item/:id");
};
export const updateBanner = (id, payload) => {
  return axiosClient.post(`/admin/banner_manager/edit_item/${id}`, payload);
};
export const activeBanner = (id, payload) => {
  return axiosClient.post(`/admin/banner_manager/acti_item/${id}`, payload);
};
export const deleteBanner = (id, payload) => {
  return axiosClient.post(`/admin/banner_manager/delete_item/${id}`, payload);
};
