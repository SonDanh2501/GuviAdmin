import axiosClient from "../axios";

export const fetchReasons = (start, length) => {
  return axiosClient.get(
    `/admin/reason_cancel_manager/get_list?start=${start}&length=${length}`
  );
};
export const fetchReasonById = (id) => {
  return axiosClient.get(`/admin/reason_cancel_manager/detail_item/${id}`);
};
export const updateReason = (id, data) => {
  return axiosClient.post(`/admin/reason_cancel_manager/edit_item/${id}`, data);
};
export const activeReason = (id, payload) => {
  return axiosClient.post(
    `/admin/reason_cancel_manager/active_item/${id}`,
    payload
  );
};
export const deleteReason = (id, payload) => {
  return axiosClient.post(
    `/admin/reason_cancel_manager/delete_item/${id}`,
    payload
  );
};

export const getListReasonCancel = (lang) => {
  return axiosClient.get(
    `/admin/reason_cancel_manager/get_list_reason_admin?lang=${lang}`
  );
};

export const createReason = (data) => {
  return axiosClient.post(
    `/admin/reason_cancel_manager/create_item?lang=vi`,
    data
  );
};

//reason punish
export const getReasonPunishApi = (start, length) => {
  return axiosClient.get(
    `/admin/reason_punish_manager/get_list?lang=vi&start=${start}&length=${length}`
  );
};

export const getDetailsReasonPunishApi = (id) => {
  return axiosClient.get(`/admin/reason_punish_manager/detail_item/${id}`);
};

export const createReasonPunish = (data) => {
  return axiosClient.post(
    `/admin/reason_punish_manager/create_item?lang=vi`,
    data
  );
};

export const editReasonPunish = (id, data) => {
  return axiosClient.post(
    `/admin/reason_punish_manager/edit_item/${id}?lang=vi`,
    data
  );
};

export const deleteReasonPunish = (id) => {
  return axiosClient.post(
    `/admin/reason_punish_manager/delete_item/${id}?lang=vi`
  );
};

export const activeReasonPunish = (id, data) => {
  return axiosClient.post(
    `/admin/reason_punish_manager/active_item/${id}?lang=vi`,
    data
  );
};
