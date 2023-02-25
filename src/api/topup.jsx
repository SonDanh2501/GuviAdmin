import axiosClient from "../axios";

export const getTopupCollaboratorApi = (start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_transitions?start=${start}&length=${length}`
  );
};

export const searchTopupCollaboratorApi = (search, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_transitions?search=${search}&start=${start}&length=${length}`
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
