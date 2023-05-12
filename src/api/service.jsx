import axiosClient from "../axios";
//group-service
export const getGroupServiceApi = (start, length) => {
  return axiosClient.get(
    `/admin/group_service_manager/get_list?start=${start}&length=${length}`
  );
};

export const createGroupServiceApi = (data) => {
  return axiosClient.post(
    `/admin/group_service_manager/create_item?lang=vi`,
    data
  );
};

export const updateGroupServiceApi = (id, data) => {
  return axiosClient.post(`/admin/group_service_manager/edit_item/${id}`, data);
};

export const deleteGroupServiceApi = (id) => {
  return axiosClient.post(`/admin/group_service_manager/delete_item/${id}`);
};

export const activeGroupServiceApi = (id, data) => {
  return axiosClient.post(
    `/admin/group_service_manager/active_item/${id}`,
    data
  );
};

//services
export const getServiceApi = (id) => {
  return axiosClient.get(
    `/admin/service_manager/get_list_service_by_group_service/${id}`
  );
};

export const getServiceByIdApi = (id) => {
  return axiosClient.get(
    `/admin/service_manager/get_list_service_by_group_service/${id}`
  );
};

export const createServiceApi = (data) => {
  return axiosClient.post(`/admin/service_manager/create_item?lang=vi`, data);
};

export const editServiceApi = (id, data) => {
  return axiosClient.post(
    `/admin/service_manager/edit_item/${id}?lang=vi`,
    data
  );
};

export const activeServiceApi = (id, data) => {
  return axiosClient.post(
    `/admin/service_manager/active_item/${id}?lang=vi`,
    data
  );
};

export const deleteServiceApi = (id) => {
  return axiosClient.post(`/admin/service_manager/delete_item/${id}`);
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

export const deleteOptionServiceApi = (id) => {
  return axiosClient.post(`/admin/optional_service_manager/delete_item/${id}`);
};

export const activeOptionServiceApi = (id, data) => {
  return axiosClient.post(
    `/admin/optional_service_manager/active_item/${id}`,
    data
  );
};

export const editOptionServiceApi = (id, data) => {
  return axiosClient.post(
    `/admin/optional_service_manager/edit_item/${id}`,
    data
  );
};

export const createOptionServiceApi = (data) => {
  return axiosClient.post(`/admin/optional_service_manager/create_item`, data);
};

export const getCalculateFeeApi = (data) => {
  return axiosClient.post(
    `/admin/group-order-manager/calculate_fee_group_order`,
    data
  );
};

//extend optional
export const getExtendByOptionalApi = (id) => {
  return axiosClient.get(
    `/admin/extend_optional_manager/get_list_extend_optional_by_optional_service/${id}`
  );
};

export const deleteExtendOptionalApi = (id) => {
  return axiosClient.post(`/admin/extend_optional_manager/delete_item/${id}`);
};

export const activeExtendOptionApi = (id, data) => {
  return axiosClient.post(
    `/admin/extend_optional_manager/active_item/${id}`,
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
    `/admin/service_manager/price_service/${id}?city=${city}&district=${district}&start_date=${startDate}&end_date=${endDate}&start_time=${startTime}&end_time=${endTime}&step=30&end_minute=30&timezone=7`
  );
};
