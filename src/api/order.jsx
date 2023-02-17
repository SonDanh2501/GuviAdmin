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

export const addCollaboratorToOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/order_manager/add_collaborator_to_order/${id}?lang=vi`,
    data
  );
};

export const createOrderApi = (data) => {
  return axiosClient.post(`/admin/group-order-manager/create`, data);
};

export const checkCodePromotionOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/promotion_manager/check_code_promotion/${id}?lang=vi`,
    data
  );
};

export const changeStatusOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/order_manager/change_status_order/${id}?lang=vi`,
    data
  );
};

export const deleteOrderApi = (id) => {
  return axiosClient.post(
    `/admin/group-order-manager/delete_group_order/${id}?lang=vi`
  );
};
