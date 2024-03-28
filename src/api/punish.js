import axiosClient from "../axios";

export const getListPunishTicketApi = (start = 0, length = 20, query) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_list?lang=vi&start=${start}&length=${length}&${query}`
  );
};

export const createPunishTicketApi = (data) => {
  return axiosClient.post(
    `/admin/punish_ticket_manage/create_item_from_policy`,
    data
  );
};
