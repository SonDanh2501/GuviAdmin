import axiosClient from "../axios";
export const createCollaborator = (payload) => {
  return axiosClient.post("/admin/collaborator_manager/create_item", payload);
};
export const fetchCollaborators = (start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_item?start=${start}&length=${length}`
  );
};

export const getCollaboratorsById = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_detail/${id}?start=${start}&length=${length}`
  );
};

export const searchCollaborators = (payload, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_item?search=${payload}&start=${start}&length=${length}`
  );
};

export const fetchCollaboratorById = () => {
  return axiosClient.get("/admin/collaborator_manager/:id");
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
  return axiosClient.post(`/admin/collaborator_manager/lock_item/${id}`, data);
};

export const updateInformationCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_personal_information/${id}`,
    data
  );
};

export const getHistoryActivityCollaborator = (id, start, length) => {
  return axiosClient.get(
    `admin/collaborator_manager/get_history_activity/${id}?start=${start}&length=${length}`
  );
};
