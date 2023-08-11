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

export const getListQuestionApi = (start, length, type, exam) => {
  return axiosClient.get(
    `/admin/exam_test/get_list?start=${start}&length=${length}&type=${type}&type_exam=${exam}`
  );
};

export const getExamByLessonApi = (id, start, length) => {
  return axiosClient.get(
    `/admin/exam_test/get_exam_by_training_lesson/${id}?start=${start}&length=${length}`
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
export const getListTestByCollabotatorApi = (id, start, length, type) => {
  return axiosClient.get(
    `/admin/info_test_collaborator/get_list_by_collaborator/${id}?start=${start}&length=${length}&type_exam=${type}`
  );
};

export const getListTrainningLessonApi = (start, length, type) => {
  return axiosClient.get(
    `/admin/training_lesson_manager/get_list?start=${start}&length=${length}&type_training_lesson=${type}`
  );
};

export const getDetailsTrainningLessonApi = (id) => {
  return axiosClient.get(
    `/admin/training_lesson_manager/get_detail_trainging_lesson/${id}`
  );
};

export const createLessonApi = (data) => {
  return axiosClient.post(
    `/admin/training_lesson_manager/create_trainging_lesson`,
    data
  );
};

export const editLessonApi = (id, data) => {
  return axiosClient.post(
    `/admin/training_lesson_manager/edit_trainging_lesson/${id}`,
    data
  );
};

export const deleteLessonApi = (id) => {
  return axiosClient.post(
    `/admin/training_lesson_manager/delete_trainging_lesson/${id}`
  );
};

export const activeLessonApi = (id, data) => {
  return axiosClient.post(
    `/admin/training_lesson_manager/active_trainging_lesson/${id}`,
    data
  );
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

// rewards collaborators

export const getListRewardCollaborator = (start, length) => {
  return axiosClient.get(
    `/admin/reward_collaborator_manager/get_list?lang=vi&start=${start}&length=${length}`
  );
};

export const getDetailRewardCollaborator = (id) => {
  return axiosClient.get(
    `/admin/reward_collaborator_manager/detail_reward/${id}`
  );
};

export const createRewardCollaboratorApi = (data) => {
  return axiosClient.post(
    `/admin/reward_collaborator_manager/create_reward`,
    data
  );
};

export const editRewardCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/reward_collaborator_manager/edit_reward/${id}`,
    data
  );
};

export const activeRewardCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/reward_collaborator_manager/acti_reward/${id}`,
    data
  );
};

export const deleteRewardCollaboratorApi = (id) => {
  return axiosClient.post(
    `/admin/reward_collaborator_manager/delete_reward/${id}`
  );
};

//group promotion

export const getGroupPromotion = (start, length, value) => {
  return axiosClient.get(
    `/admin/group_promotion_manager/get_list?lang=vi&start=${start}&length=${length}&search=${value}`
  );
};

export const createGroupPromotion = (data) => {
  return axiosClient.post(`/admin/group_promotion_manager/create_item`, data);
};

export const editGroupPromotion = (id, data) => {
  return axiosClient.post(
    `/admin/group_promotion_manager/edit_item/${id}`,
    data
  );
};
export const deleteGroupPromotion = (id) => {
  return axiosClient.post(`/admin/group_promotion_manager/delete_item/${id}`);
};

export const activeGroupPromotion = (id, data) => {
  return axiosClient.post(
    `/admin/group_promotion_manager/acti_item/${id}`,
    data
  );
};

// config business

export const getListBusiness = (start, length, value) => {
  return axiosClient.get(
    `/admin/business_manager/get_list?lang=vi&start=${start}&length=${length}&search=${value}`
  );
};

export const getDetailBusiness = (id) => {
  return axiosClient.get(`/admin/business_manager/get_detail/${id}`);
};

export const createBusiness = (data) => {
  return axiosClient.post(`/admin/business_manager/create_item`, data);
};

export const editBusiness = (id, data) => {
  return axiosClient.post(`/admin/business_manager/edit_item/${id}`, data);
};

export const activeBusiness = (id, data) => {
  return axiosClient.post(`/admin/business_manager/acti_item/${id}`, data);
};

export const deleteBusiness = (id) => {
  return axiosClient.post(`/admin/business_manager/delete_item/${id}`);
};
