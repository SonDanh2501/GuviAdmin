import axiosClient from "../axios";

export const getListRoleAdmin = () => {
  return axiosClient.get(
    `/admin/user_system_manager/get_list_role_admin?lang=vi`
  );
};
