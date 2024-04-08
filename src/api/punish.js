import axiosClient from "../axios";

export const getListPunishTicketApi = (
  start = 0,
  length = 20,
  status = "",
  query
) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_list?lang=vi&start=${start}&length=${length}&status=${status}&${query}`
  );
};

export const createPunishTicketApi = (data) => {
  return axiosClient.post(
    `/admin/punish_ticket_manage/create_item_from_policy`,
    data
  );
};

export const getDetailPunishTicket = (idPunishTicket) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_item_by_id/${idPunishTicket}?lang=vi`
  );
};

export const getActivityHistoryPunishTicket = (
  start = 0,
  length = 20,
  idPunishTicket
) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_item_by_id/${idPunishTicket}?lang=vi`
  );
};

export const getTotalPunishTicket = (query) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_total_punish_ticket?lang=vi${query}`
  );
};
