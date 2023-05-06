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

export const punishMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/monetary_fine/${id}?lang=vi`,
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
