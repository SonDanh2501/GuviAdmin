import axiosClient from "../axios";

export const getTopupCollaboratorApi = (start, length, type) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_transitions?start=${start}&length=${length}&type_transition=${type}`
  );
};

export const searchTopupCollaboratorApi = (search, start, length, type) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_transitions?search=${search}&start=${start}&length=${length}&type_transition=${type}`
  );
};

export const TopupMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/top_up/${id}?lang=vi`,
    data
  );
};

export const withdrawMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/withdraw/${id}?lang=vi`,
    data
  );
};

export const updateMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(`/admin/collaborator_manager/edit_trans/${id}`, data);
};

export const verifyMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/verify_trans/${id}?lang=vi`,
    data
  );
};

export const deleteMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/delete_trans/${id}?lang=vi`,
    data
  );
};

export const cancelMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/cancel_trans/${id}?lang=vi`,
    data
  );
};

export const getRevenueCollaboratorApi = (startDate, endDate) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_revenue_and_expenditure?lang=vi&start_date=${startDate}&end_date=${endDate}`
  );
};

//punish collaborator
export const getListPunishApi = (start, length) => {
  return axiosClient.get(
    `/admin/punish_manager/get_list_punish?lang=vi&start=${start}&length=${length}`
  );
};

export const punishMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/punish_manager/monetary_fine/${id}?lang=vi`,
    data
  );
};

export const confirmMoneyPunishApi = (id) => {
  return axiosClient.post(`/admin/punish_manager/verify_punish/${id}`);
};

export const cancelMoneyPunishApi = (id) => {
  return axiosClient.post(`/admin/punish_manager/cancel_punish/${id}?lang=vi`);
};

export const deleteMoneyPunishApi = (id) => {
  return axiosClient.post(`/admin/punish_manager/delete_punish/${id}`);
};

export const editMoneyPunishApi = (id, data) => {
  return axiosClient.post(
    `/admin/punish_manager/edit_punish/${id}?lang=vi`,
    data
  );
};

export const refundMoneyPunishApi = (id) => {
  return axiosClient.post(`/admin/punish_manager/refurn_punish/${id}?lang=vi`);
};

//reward collaborator
export const getListInfoRewardApi = (start, length) => {
  return axiosClient.get(
    `/admin/info_reward_collaborator/get_list?lang=vi&start=${start}&length=${length}`
  );
};

export const getDetailInfoRewardApi = (id) => {
  return axiosClient.get(`/admin/info_reward_collaborator/detail_item/${id}`);
};

export const verifyRewardApi = (id) => {
  return axiosClient.post(`/admin/info_reward_collaborator/verify_item/${id}`);
};

export const noteRewardApi = (id, data) => {
  return axiosClient.post(
    `/admin/info_reward_collaborator/note_admin_item/${id}`,
    data
  );
};

export const cancelRewardApi = (id, data) => {
  return axiosClient.post(
    `/admin/info_reward_collaborator/cancel_item/${id}`,
    data
  );
};

export const deleteRewardApi = (id) => {
  return axiosClient.post(`/admin/info_reward_collaborator/delete_item/${id}`);
};

//customer

export const getTopupCustomerApi = (start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_list_transitions?start=${start}&length=${length}`
  );
};

export const searchTopupCustomerApi = (search, start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_list_transitions?search=${search}&start=${start}&length=${length}`
  );
};

export const TopupMoneyCustomerApi = (id, data) => {
  return axiosClient.post(`/admin/customer_manager/top_up/${id}?lang=vi`, data);
};

export const withdrawMoneyCustomerApi = (id, data) => {
  return axiosClient.post(
    `/admin/customer_manager/withdraw/${id}?lang=vi`,
    data
  );
};

export const updateMoneyCustomerApi = (id, data) => {
  return axiosClient.post(`/admin/customer_manager/edit_trans/${id}`, data);
};

export const verifyMoneyCustomerApi = (id, data) => {
  return axiosClient.post(
    `/admin/customer_manager/verify_trans/${id}?lang=vi`,
    data
  );
};

export const deleteMoneyCustomerApi = (id, data) => {
  return axiosClient.post(
    `/admin/customer_manager/delete_trans/${id}?lang=vi`,
    data
  );
};

export const cancelMoneyCustomerApi = (id) => {
  return axiosClient.post(
    `/admin/customer_manager/cancel_transition/${id}?lang=vi`
  );
};

// point customer

export const getTopupPointCustomerApi = (start, length) => {
  return axiosClient.get(
    `/admin/customer_manager/get_list_transition_point_customer?lang=vi&start=${start}&length=${length}`
  );
};

export const searchTopupPointCustomerApi = (start, length, search) => {
  return axiosClient.get(
    `/admin/customer_manager/get_list_transition_point_customer?lang=vi&start=${start}&length=${length}&search=${search}`
  );
};

export const deletePointCustomerApi = (id) => {
  return axiosClient.post(
    `/admin/customer_manager/delete_point_customer/${id}?lang=vi`
  );
};

export const topupPointCustomerApi = (id, data) => {
  return axiosClient.post(
    `/admin/customer_manager/top_up_point_customer/${id}?lang=vi`,
    data
  );
};

export const verifyPointCustomerApi = (id) => {
  return axiosClient.post(
    `/admin/customer_manager/verify_point_customer/${id}?lang=vi`
  );
};

export const cancelPointCustomerApi = (id) => {
  return axiosClient.post(
    `/admin/customer_manager/cancel_point_customer/${id}?lang=vi`
  );
};
