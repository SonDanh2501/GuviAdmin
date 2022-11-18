import axiosClient from "../axios";
export const createCollaborator = (payload) => {
  return axiosClient.post("/admin/collaborator_manager/create_item", payload);
};
export const fetchCollaborators = (start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_item?start=${start}&length=${length}`
  );
};

export const searchCollaborators = (payload) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_item?search=${payload}`
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
