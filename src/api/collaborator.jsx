import axiosClient from "../axios";
export const createCollaborator = (payload) => {
  return axiosClient.post("/admin/collaborator_manager/create_item", payload);
};
export const fetchCollaborators = (
  lang,
  start,
  length,
  type,
  search,
  city
) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_collaborator_by_type?lang=${lang}&start=${start}&length=${length}&collaborator_type=${type}&search=${search}&city=${city}`
  );
};

export const getListDataCollaborator = (
  lang,
  search,
  start,
  length,
  city,
  status
) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list?lang=${lang}&start=${start}&length=${length}&search=${search}&city=${city}&status=${status}`
  );
};

export const getCollaboratorsById = (id) => {
  return axiosClient.get(`/admin/collaborator_manager/get_detail/${id}`);
};

export const searchCollaboratorsCreateOrder = (id, payload) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_collaborator_block_or_favorite/${id}?search=${payload}`
  );
};

export const updateCollaborator = (id, payload) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_item/${id}`,
    payload
  );
};
export const activeCollaborator = (id, payload) => {
  return axiosClient.post(
    `/admin/collaborator_manager/acti_item/${id}`,
    payload
  );
};
export const deleteCollaborator = (id) => {
  return axiosClient.post(
    `/admin/collaborator_manager/delete_item/${id}`
  );
};

export const verifyCollaborator = (id) => {
  return axiosClient.post(`/admin/collaborator_manager/verify_item/${id}`);
};

export const lockTimeCollaborator = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/lock_collaborator/${id}?lang=vi`,
    data
  );
};

export const updateInformationCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_personal_information/${id}`,
    data
  );
};

export const updateDocumentCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_personal_document/${id}`,
    data
  );
};

export const getHistoryActivityCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_history_activity_v2/${id}?start=${start}&length=${length}`
  );
};

export const getInviteCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_invite_collaborator/${id}?start=${start}&length=${length}`
  );
};

export const getDetailsHistoryActivityCollaborator = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/detail_history_activity/${id}`,
    data
  );
};

export const getHistoryCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_history_collaborator/${id}?start=${start}&length=${length}`
  );
};

export const getTopupWithdrawCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_request_topup_withdraw/${id}?start=${start}&length=${length}`
  );
};

export const getHistoryCollaboratorRemainder = (id, start, length) => {
  return axiosClient.get(
    `admin/collaborator_manager/get_history_remainder/${id}?start=${start}&length=${length}`
  );
};

export const editAccountBankCollaborator = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/edit_account_bank/${id}?lang=vi`,
    data
  );
};

export const getCollaboratorRemainder = (id) => {
  return axiosClient.get(`/admin/collaborator_manager/get_remainder/${id}`);
};

export const getListTransitionByCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_transition/${id}?start=${start}&length=${length}`
  );
};

export const getTransitionDetailsCollaborator = (id) => {
  return axiosClient.get(
    `/admin/collaborator_manager/total_top_up_withdraw/${id}?lang=vi`
  );
};

export const changeContactedCollaborator = (id) => {
  return axiosClient.post(
    `/admin/collaborator_manager/contacted_collaborator/${id}?lang=vi`
  );
};

export const getReviewCollaborator = (id, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_review/${id}?lang=vi&start=${start}&length=${length}`
  );
};

export const getOverviewCollaborator = (id) => {
  return axiosClient.get(
    `/admin/collaborator_manager/dash_board_collaborator/${id}?lang=vi`
  );
};

export const getListTrainingLessonByCollaboratorApi = (
  id,
  start,
  length,
  type
) => {
  return axiosClient.get(
    `/admin/training_lesson_manager/get_list_training_lesson_by_collaborator/${id}?lang=vi&start=${start}&length=${length}&type_training_lesson=${type}`
  );
};

export const getInfoTestTrainingLessonByCollaboratorApi = (
  idLesson,
  idCollaborator
) => {
  return axiosClient.get(
    `/admin/info_test_collaborator/get_list_info_test_by_training_lesson/${idLesson}/${idCollaborator}`
  );
};

export const passInfoTestApi = (data) => {
  return axiosClient.post(
    `/admin/info_test_collaborator/create_info_exam`,
    data
  );
};

export const updateStatusCollaborator = (idCollaborator, payload) => {
  return axiosClient.post(
    `/admin/collaborator_manager/update_status_collaborator/${idCollaborator}`,
    payload
  )
}


export const getTotalCollaboratorByStatus = (arrStatus, search, city) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_total_collaborator_by_status?arr_status=${arrStatus}&search=${search}&city=${city}`
  )
}

export const getTotalCollaboratorByArea = (arrStatus, search) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_total_collaborator_by_area?arr_status=${arrStatus}&search=${search}&city=`
  )
}