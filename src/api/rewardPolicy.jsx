import axiosClient from "../axios";

export const getListRewardPolicyApi = (start, length, search) => {
  return axiosClient.get(
    `api/admin/reward_policy_manager/get_list?lang=vi&start=${start}&length=${length}&search=${search}`
  );
};

export const createNewRewardPolicyApi = (payload) => {
  return axiosClient.post(
    `api/admin/reward_policy_manager/create_item?lang=vi`,
    payload
  );
};

export const updateRewardPolicyApi = (idRewardPolicy,payload) => {
  return axiosClient.post(
    `api/admin/reward_policy_manager/update_item/${idRewardPolicy}`,
    payload
  );
};

export const getDetailRewardPolicyApi = (idRewardPolicy) => {
  return axiosClient.get(
    `api/admin/reward_policy_manager/get_detail_item/${idRewardPolicy}`
  );
};
