import axiosClient from "../axios";

export const fetchCustomers = (
  lang,
  start,
  length,
  type,
  group,
  payload,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/customer_manager/get_customer_by_type?lang=${lang}&start=${start}&length=${length}&customer_type=${type}&id_group_customer=${group}&start_date=${start_date}&end_date=${end_date}&search=${payload}`
  );
};

export const searchCustomersApi = (value) => {
  return axiosClient.get(
    `/admin/customer_manager/search_customer?lang=vi&start=0&length=30&search=${value}`
  );
};

export const fetchCustomerById = (id) => {
  return axiosClient.get(`/admin/customer_manager/get_detail/${id}`);
};

export const getInviteCustomerById = (id, start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_invite_customer/${id}?start=${start}&length=${length}`
  );
};

export const createCustomer = (payload) => {
  return axiosClient.post(
    "api/admin/customer_manager/create_new_customer",
    payload
  );
};
export const updateCustomer = (id, payload) => {
  return axiosClient.post(
    `api/admin/customer_manager/edit_item/${id}?lang=vi`,
    payload
  );
};
export const activeCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/acti_item/${id}`, payload);
};
export const deleteCustomer = (id, payload) => {
  return axiosClient.post(`/admin/customer_manager/delete_item/${id}`, payload);
};

export const getOrderByCustomers = (id, start, length) => {
  return axiosClient.get(
    `api/admin/group_order_manager/get_group_order_by_customer/${id}?start=${start}&length=${length}&typeSort=date_create&valueSort=-1`
    // `/admin/order_manager/get_order_by_customer/${id}?start=${start}&length=${length}`
  );
};

export const updatePointCustomer = (id, payload) => {
  return axiosClient.post(
    `/admin/customer_manager/edit_point_and_rank_point/${id}?lang=vi`,
    payload
  );
};

export const getHistoryTransitionByCustomers = (id, start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_history_activity_customer/${id}?start=${start}&length=${length}`
  );
};

/**
 *
 * @param {*} id id của khách hàng
 * @param {*} status hiện tại đang chỉ nhận favourite hoặc không, nếu không thì lấy thông tin collaborator block
 * @param {*} start điểm bắt đầu lấy dữ liệu
 * @param {*} length số lượng dữ liệu cần lấy
 * @returns
 */
export const getFavoriteAndBlockByCustomers = (id, status, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_collaborator_block_or_favourite/${id}?status=${status}&start=${start}&length=${length}`
  );
};

export const getUsedPromotionByCustomers = (id) => {
  return axiosClient.get(
    `/admin/customer_manager/get_used_promotion_by_customer/${id}`
  );
};

export const favouriteCustomerApi = (idUser, idCollaborator) => {
  return axiosClient.post(
    `/admin/customer_manager/add_favourite_collaborator/${idUser}?id_collaborator=${idCollaborator}`
  );
};

export const unfavouriteCustomerApi = (idUser, idCollaborator) => {
  return axiosClient.post(
    `/admin/customer_manager/unfavourite_collaborator/${idUser}?id_collaborator=${idCollaborator}`
  );
};

export const blockCustomerApi = (idUser, idCollaborator) => {
  return axiosClient.post(
    `/admin/customer_manager/block_collaborator/${idUser}?id_collaborator=${idCollaborator}`
  );
};

export const unblockCustomerApi = (idUser, idCollaborator) => {
  return axiosClient.post(
    `/admin/customer_manager/unblock_collaborator/${idUser}?id_collaborator=${idCollaborator}`
  );
};

export const getReviewByCustomers = (id, start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_customer_review/${id}?start=${start}&length=${length}`
  );
};

export const setIsStaffCustomerApi = (id, data) => {
  return axiosClient.post(`/admin/customer_manager/set_is_staff/${id}`, data);
};

/**
 *
 * @param {*} id của KH
 * @param {*} data  token:string; type_address_work?: string; note_address?: string;
 * @returns
 */
export const createAddressForCustomer = (id, data) => {
  return axiosClient.post(
    `/admin/customer_manager/create_address_for_customer/${id}`,
    data
  );
};
