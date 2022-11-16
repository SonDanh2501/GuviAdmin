import axiosClient from "../axios";

export const fetchPromotion = () => {
  return axiosClient.get(`/admin/promotion_manager/get_list`);
};

export const searchPromotion = (search) => {
  return axiosClient.get(`/admin/promotion_manager/get_list?search=${search}`);
};

export const createPromotion = (data) => {
  return axiosClient.post("/admin/promotion_manager/create_item?lang=vi", data);
};

export const getGroupCustomerPromotion = () => {
  return axiosClient.get("/admin/group_customer_mamager/get_list");
};

export const deletePromotion = (params) => {
  return axiosClient.get(
    `/admin/promotion_manager/delete_soft/${params}?lang=vi`
  );
};

export const getPromotionDetails = (id) => {
  return axiosClient.get(`/admin/promotion_manager/detail/${id}?lang=vi`);
};

export const updatePromotion = (id, data) => {
  return axiosClient.post(`/admin/promotion_manager/edit_item/${id}`, data);
};
