import axiosClient from "../axios";
//group-service
export const getGroupServiceApi = (start, length) => {
  return axiosClient.get(
    `/admin/group_service_manager/get_list?start=${start}&length=${length}`
  );
};

export const createGroupServiceApi = (payload) => {
  return axiosClient.post("/admin/group_service_manager/create_item", payload);
};

export const updateGroupServiceApi = (id, payload) => {
  return axiosClient.post(
    `/admin/group_service_manager/edit_item/${id}`,
    payload
  );
};

export const deleteGroupServiceApi = (id) => {
  return axiosClient.get(`/admin/group_service_manager/delete_soft/${id}`);
};

export const activeGroupServiceApi = (id) => {
  return axiosClient.post(`/admin/group_service_manager/active/${id}`);
};

//services
export const getServiceApi = () => {
  return axiosClient.get("/admin/service_manager/get_list");
};

export const getServiceByIdApi = (id) => {
  return axiosClient.get(
    `/admin/service_manager/get_list_service_by_group_service/${id}`
  );
};

export const createServiceApi = (data) => {
  return axiosClient.post(`/admin/service_manager/create_item?lang=vi`, data);
};

export const deleteServiceApi = (id) => {
  return axiosClient.get(`/admin/service_manager/delete_soft/${id}`);
};

//optional services

export const getOptionalServiceByIdApi = (id) => {
  return axiosClient.get(`/admin/optional_service_manager/get_detail/${id}`);
};

export const getOptionalServiceByServiceApi = (id) => {
  return axiosClient.get(
    `/admin/optional_service_manager/get_list_optional_service_by_service/${id}`
  );
};

export const getExtendOptionalByOptionalServiceApi = (id) => {
  return axiosClient.get(
    `/admin/extend_optional_manager/get_list_extend_optional_by_optional_service/${id}`
  );
};

export const getPromotionByCustomerApi = (id, start, length, idService) => {
  return axiosClient.get(
    `/admin/promotion_manager/code_available/${id}?brand=guvi&start=${start}&length=${length}&&id_service=${idService}`
  );
};

export const getCalculateFeeApi = (data) => {
  return axiosClient.post(
    `/admin/group-order-manager/calculate_fee_group_order`,
    data
  );
};

//price
export const getPriceServiceApi = (
  id,
  city,
  district,
  startDate,
  endDate,
  startTime,
  endTime
) => {
  return axiosClient.get(
    `/admin/service_manager/price_service/${id}?city=${city}&district=${district}&start_date=${startDate}&end_date=${endDate}&start_time=${startTime}&end_time=${endTime}&step=30&end_minute=30`
  );
};
