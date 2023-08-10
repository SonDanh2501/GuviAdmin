import axiosClient from "../axios";

export const getListRoleAdmin = () => {
  return axiosClient.get(
    `/admin/user_system_manager/get_list_role_admin?lang=vi`
  );
};

export const getListAccount = (start, length) => {
  return axiosClient.get(
    `admin/user_system_manager/get_list?lang=vi&start=${start}&length=${length}`
  );
};

export const getDetailsAccount = (id) => {
  return axiosClient.get(`admin/user_system_manager/get_detail/${id}`);
};

export const createAccountAdmin = (data) => {
  return axiosClient.post(
    `/admin/user_system_manager/create_admin?lang=vi`,
    data
  );
};

export const editAccountAdmin = (id, data) => {
  return axiosClient.post(`admin/user_system_manager/edit_admin/${id}`, data);
};

export const deleteAccountAdmin = (id) => {
  return axiosClient.post(`admin/user_system_manager/delete_admin/${id}`);
};

export const activeAccountAdmin = (id, data) => {
  return axiosClient.post(`admin/user_system_manager/acti_admin/${id}`, data);
};
