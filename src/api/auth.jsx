import axiosClient from "../axios";
export const loginApi = (payload) => {
  return axiosClient.post("/admin/auth/login", payload);
};
