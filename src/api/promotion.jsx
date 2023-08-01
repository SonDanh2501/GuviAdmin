import axiosClient from "../axios";

export const fetchPromotion = (
  search,
  status,
  start,
  length,
  type,
  brand,
  id_service,
  exchange,
  sort
) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_list?search=${search}&status=${status}&start=${start}&length=${length}&typeSort=${type}&brand=${brand}&id_service=${id_service}&exchange=${exchange}&fieldSort=date_create&valueSort=${sort}`
  );
};

export const getPromotionList = () => {
  return axiosClient.get(`/admin/promotion_manager/get_list`);
};

export const searchPromotion = (
  search,
  start,
  length,
  type,
  brand,
  id_service,
  exchange,
  status
) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_list?search=${search}&start=${start}&length=${length}&typeSort=${type}&brand=${brand}&id_service=${id_service}&exchange=${exchange}&status=${status}`
  );
};

export const filterPromotion = (
  status,
  start,
  length,
  type,
  brand,
  id_service,
  exchange
) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_list?status=${status}&start=${start}&length=${length}&typeSort=${type}&brand=${brand}&id_service=${id_service}&exchange=${exchange}`
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

export const deletePromotion = (id) => {
  return axiosClient.get(`/admin/promotion_manager/delete_soft/${id}?lang=vi`);
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

export const getOrderUsePromotion = (id, status) => {
  return axiosClient.get(
    `/admin/promotion_manager/detail_used_promotion/${id}?lang=vi&status=${status}`
  );
};

export const getChildPromotion = (code, status, start, length) => {
  return axiosClient.get(
    `/admin/promotion_manager/get_child_promotion/${code}?lang=vi&status=${status}&start=${start}&length=${length}`
  );
};

export const getPromotionByPosition = () => {
  return axiosClient.get(`/admin/promotion_manager/get_promotion_by_position`);
};

export const updatePositionPromotion = (data) => {
  return axiosClient.post(
    `/admin/promotion_manager/set_position_promotion`,
    data
  );
};
