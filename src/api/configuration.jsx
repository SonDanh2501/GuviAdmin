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

//create group customer

export const getDetailsGroupCustomerApi = (id) => {
  return axiosClient.get(`/admin/group_customer_mamager/get_detail/${id}`);
};

export const createGroupCustomerApi = (data) => {
  return axiosClient.post(`/admin/group_customer_mamager/create_item`, data);
};

export const editGroupCustomerApi = (id, data) => {
  return axiosClient.post(
    `/admin/group_customer_mamager/edit_item/${id}`,
    data
  );
};

export const deleteGroupCustomerApi = (id) => {
  return axiosClient.post(`/admin/group_customer_mamager/delete_item/${id}`);
};

export const activeGroupCustomerApi = (id, data) => {
  return axiosClient.post(
    `/admin/group_customer_mamager/acti_item/${id}`,
    data
  );
};
