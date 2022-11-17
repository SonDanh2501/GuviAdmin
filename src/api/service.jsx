import axiosClient from "../axios";

export const getGroupServiceApi = () => {
  return axiosClient.get("/admin/group_service_manager/get_list");
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
