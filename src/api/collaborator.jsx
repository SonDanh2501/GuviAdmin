import axiosClient from "../axios";
export const createCollaborator = (payload) => {
  return axiosClient.post("/admin/collaborator_manager/create_item", payload);
};
export const fetchCollaborators = (start, length, type) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_collaborator_by_type?start=${start}&length=${length}&collaborator_type=${type}`
  );
};

export const getCollaboratorsById = (id) => {
  return axiosClient.get(`/admin/collaborator_manager/get_detail/${id}`);
};

export const searchCollaborators = (start, length, type, payload) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_collaborator_by_type?start=${start}&length=${length}&collaborator_type=${type}&search=${payload}`
  );
};

export const updateCollaborator = (id, payload) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_item/${id}`,
    payload
  );
};
export const activeCollaborator = (id, payload) => {
  return axiosClient.post(
    `/admin/collaborator_manager/acti_item/${id}`,
    payload
  );
};
export const deleteCollaborator = (id, payload) => {
  return axiosClient.post(
    `/admin/collaborator_manager/delete_item/${id}`,
    payload
  );
};

export const verifyCollaborator = (id) => {
  return axiosClient.post(`/admin/collaborator_manager/verify_item/${id}`);
};

export const lockTimeCollaborator = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/lock_collaborator/${id}?lang=vi`,
    data
  );
};

export const updateInformationCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_personal_information/${id}`,
    data
  );
};

export const updateDocumentCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_personal_document/${id}`,
    data
  );
};

export const getHistoryActivityCollaborator = (id, start, length) => {
  return axiosClient.get(
    `admin/collaborator_manager/get_history_activity/${id}?start=${start}&length=${length}`
  );
};

export const getHistoryCollaborator = (id, start, length) => {
  return axiosClient.get(
    `admin/collaborator_manager/get_history_collaborator/${id}?start=${start}&length=${length}`
  );
};

export const getTopupWithdrawCollaborator = (id, start, length) => {
  return axiosClient.get(
    `admin/collaborator_manager/get_request_topup_withdraw/${id}?start=${start}&length=${length}`
  );
};

export const getHistoryCollaboratorRemainder = (id, start, length) => {
  return axiosClient.get(
    `admin/collaborator_manager/get_history_remainder/${id}?start=${start}&length=${length}`
  );
};

export const editAccountBankCollaborator = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_account_bank/${id}?lang=vi`,
    data
  );
};

export const getCollaboratorRemainder = (id) => {
  return axiosClient.get(`/admin/collaborator_manager/get_remainder/${id}`);
};

export const getListTransitionByCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_transition/${id}?start=${start}&length=${length}`
  );
};

export const getTransitionDetailsCollaborator = (id) => {
  return axiosClient.get(
    `/admin/collaborator_manager/total_top_up_withdraw/${id}?lang=vi`
  );
};
