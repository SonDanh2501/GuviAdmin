import axiosClient from "../axios";

export const getListPunishTicketPolicyApi = (start = 0, length = 20, query) => {
  return axiosClient.get(
    `/admin/policy_manage/get_list_punish_policy?lang=vi&start=${start}&length=${length}&${query}`
  );
};
