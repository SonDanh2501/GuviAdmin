import axiosClient from "../axios";

export const fetchPromotion = (start, length, type, brand, id_service) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_list?start=${start}&length=${length}&typeSort=${type}&brand=${brand}&id_service=${id_service}`
  );
};

export const searchPromotion = (
  search,
  start,
  length,
  type,
  brand,
  id_service
) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_list?search=${search}&start=${start}&length=${length}&typeSort=${type}&brand=${brand}&id_service=${id_service}`
  );
};

export const filterPromotion = (
  status,
  start,
  length,
  type,
  brand,
  id_service
) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_list?status=${status}&start=${start}&length=${length}&typeSort=${type}&brand=${brand}&id_service=${id_service}`
  );
};

export const createPromotion = (data) => {
  return axiosClient.post("/admin/promotion_manager/create_item?lang=vi", data);
};

export const getGroupCustomerApi = (start, length) => {
  return axiosClient.get(
    `/admin/group_customer_mamager/get_list?start=${start}&length=${length}`
  );
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

export const activePromotion = (id, data) => {
  return axiosClient.post(`/admin/promotion_manager/active/${id}`, data);
};
