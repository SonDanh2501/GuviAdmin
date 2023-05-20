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

// create quizz

export const getListQuestionApi = (start, length) => {
  return axiosClient.get(
    `/admin/exam_test/get_list?start=${start}&length=${length}`
  );
};

export const addQuestionApi = (data) => {
  return axiosClient.post(`/admin/exam_test/create_question`, data);
};

export const getDetailsQuestionApi = (id) => {
  return axiosClient.get(`/admin/exam_test/detail_question/${id}`);
};

export const editQuestionApi = (id, data) => {
  return axiosClient.post(`/admin/exam_test/edit_question/${id}`, data);
};

export const deleteQuestionApi = (id) => {
  return axiosClient.post(`/admin/exam_test/delete_question/${id}`);
};

export const activeQuestionApi = (id, data) => {
  return axiosClient.post(`/admin/exam_test/acti_question/${id}`, data);
};

// create account

export const getSettingAccountApi = () => {
  return axiosClient.get(
    `/admin/user_system_manager/get_setting_key_api?lang=vi`
  );
};

export const createRoleApi = (data) => {
  return axiosClient.post(
    `/admin/user_system_manager/create_role_admin?lang=vi`,
    data
  );
};

export const editRoleApi = (id, data) => {
  return axiosClient.post(
    `/admin/user_system_manager/edit_role_admin/${id}?lang=vi`,
    data
  );
};
