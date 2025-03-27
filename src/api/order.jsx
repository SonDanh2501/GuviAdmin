import axiosClient from "../axios";

export const getOrderApi = (
  search,
  start,
  length,
  status,
  service,
  type,
  startDate,
  endDate,
  city,
  district,
  payment_method,
  is_duplicate
) => {
  return axiosClient.get(
    `/admin/statistic/job_lists?search=${search}&start=${start}&length=${length}&status=${status}&id_service=${service}&type_sort=${type}&start_date=${startDate}&end_date=${endDate}&city=${city}&district=${district}&payment_method=${payment_method}&is_duplicate=${is_duplicate}`
  );
};

export const getOrderExpiredApi = (start, length, status) => {
  return axiosClient.get(
    `/admin/group-order-manager/get_list_group_order_expired?start=${start}&length=${length}&status=${status}`
  );
};

export const checkOrderApi = (id, data) => {
  return axiosClient.post(`/admin/order_manager/note_admin/${id}`, data);
};

export const searchOrderExpiredApi = (start, length, status, value) => {
  return axiosClient.get(
    `/admin/group-order-manager/get_list_group_order_expired?start=${start}&length=${length}&status=${status}&search=${value}`
  );
};

export const filterOrderApi = (start, length, payload) => {
  return axiosClient.get(
    `/admin/order_manager/get_list?start=${start}&length=${length}&id_service=${payload}`
  );
};

export const getOrderDetailApi = (id) => {
  return axiosClient.get(`/admin/order_manager/get_detail/${id}`);
};

export const getHistoryOrderApi = (id, start, length, lang = "vi") => {
  return axiosClient.get(
    `api/admin/group_order_manager/get_history_order_by_group_order/${id}?start=${start}&length=${length}&lang=${lang}`
  );
};

export const addCollaboratorToOrderApi = (id, data) => {
  // return axiosClient.post(
  //   `/admin/order_manager/add_collaborator_to_order/${id}?lang=vi`,
  //   data
  // );
  return axiosClient.post(
    `api/admin/order_manager/add_collaborator_to_order/${id}?lang=vi`,
    data
  );
};

export const changeCollaboratorToOrderApi = (id, data) => {
  return axiosClient.post(
    `api/admin/order_manager/change_collaborator/${id}?lang=vi`,
    data
  );
};

export const createOrderApi = (data) => {
  // return axiosClient.post(`/admin/group-order-manager/create`, data);
  return axiosClient.post(`/api/admin/group_order_manager/create`, data);
};

export const getAddressCustomerApi = (id, start = 0, length = 10) => {
  return axiosClient.get(
    `admin/customer_manager/get_address_by_customer/${id}?start=${start}&length=${length}`
  );
};

export const checkCodePromotionOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/promotion_manager/check_code_promotion/${id}?lang=vi`,
    data
  );
};

export const changeStatusOrderApi = (id, data) => {
  return axiosClient.post(
    `api/admin/order_manager/change_status_order/${id}?lang=vi`,
    data
  );
  // return axiosClient.post(
  //   `/api/admin/order_manager/change_status_order/${id}?lang=vi`,
  //   data
  // );
};

export const cancelGroupOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/group-order-manager/cancel_group_order_v2/${id}?lang=vi`,
    data
  );
};

export const deleteOrderApi = (id) => {
  return axiosClient.post(
    `/admin/group-order-manager/delete_group_order/${id}?lang=vi`
  );
};

export const checkEventCodePromotionOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/promotion_manager/check_event_promotion/${id}`,
    data
  );
};

export const getServiceFeeOrderApi = (data) => {
  return axiosClient.post(`/admin/group-order-manager/get_service_fee`, data);
};

export const getOrderByGroupOrderApi = (
  id,
  lang = "vi",
  start = 0,
  length = 20
) => {
  return axiosClient.get(
    `/admin/order_manager/get_order_by_group_order/${id}?lang=${lang}&start=${start}&length=${length}`
  );
};

export const changeOrderCancelToDoneApi = (id) => {
  return axiosClient.post(
    `/admin/group-order-manager/change_cancel_to_done/${id}?lang=vi`
  );
};

export const editTimeOrderApi = (id, data) => {
  return axiosClient.post(
    `/admin/group-order-manager/edit_item/${id}?lang=vi`,
    data
  );
};

export const editTimeOrderScheduleApi = (id, data) => {
  return axiosClient.post(
    `/admin/order_manager/edit_date_work/${id}?lang=vi`,
    data
  );
};

export const searchOrderApi = (start, length, search) => {
  return axiosClient.get(
    `/admin/order_manager/search_order?lang=vi&start=${start}&length=${length}&search=${search}`
  );
};

export const getTotalOrder = (
  startDate,
  endDate,
  service,
  payment_method,
  city,
  district
) => {
  return axiosClient.get(
    `/admin/order_manager/get_total_order?lang=vi&start_date=${startDate}&end_date=${endDate}&id_service=${service}&payment_method=${payment_method}&city=${city}&district=${district}`
  );
};

export const updateAddressOrderApi = (idOrder, payload) => {
  return axiosClient.post(
    `api/admin/order_manager/update_address_for_order/${idOrder}`,
    payload
  );
};
