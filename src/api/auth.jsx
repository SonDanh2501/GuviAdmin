import axiosClient from "../axios";
export const loginApi = (payload) => {
  return axiosClient.post("/admin/auth/login", payload);
};

export const getPermission = () => {
  return axiosClient.get(`/admin/auth/get_permission_by_token`);
};

export const getRoomApi = () => {
  return axiosClient.get(`/room/get_list`);
};

export const getUserByToken = () => {
  return axiosClient.get("/admin/auth/get_info_by_token");
};
