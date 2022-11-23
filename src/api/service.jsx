import axiosClient from "../axios";
//group-service
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
