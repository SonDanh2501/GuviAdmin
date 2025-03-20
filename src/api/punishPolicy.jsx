import axiosClient from "../axios";

export const getListPunishPolicyApi = (start, length, search) => {
  return axiosClient.get(
    `api/admin/punish_policy_manager/get_list?lang=vi&start=${start}&length=${length}&search=${search}`
  );
};

export const createNewPunishPolicyApi = (payload) => {
  return axiosClient.post(
    `api/admin/punish_policy_manager/create_item?lang=vi`,
    payload
  );
};

export const updatePunishPolicyApi = (idPunishPolicy,payload) => {
  return axiosClient.post(
    `api/admin/punish_policy_manager/update_item/${idPunishPolicy}`,
    payload
  );
};

export const getDetailPunishPolicyApi = (idPunishPolicy) => {
  return axiosClient.get(
    `api/admin/punish_policy_manager/get_detail_item/${idPunishPolicy}`
  );
};
