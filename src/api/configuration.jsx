import axiosClient from "../axios";

export const getSettingAppCustomerApi = () => {
  return axiosClient.get(`/admin/setting_app_customer/get_setting`);
};

export const updateSettingAppCustomerApi = (data) => {
  return axiosClient.post(`/admin/setting_app_customer/edit_setting`, data);
};

export const getSettingAppCollaboratorApi = () => {
  return axiosClient.get(`/admin/setting_app_collaborator/get_setting`);
};

export const updateSettingAppCollaboratorApi = (data) => {
  return axiosClient.post(`/admin/setting_app_collaborator/edit_setting`, data);
};
