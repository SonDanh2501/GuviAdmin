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

export const getDetailPunishTicketApi = (idPunishTicket) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_item_by_id/${idPunishTicket}?lang=vi`
  );
};

export const getActivityHistoryPunishTicketApi = (idPunishTicket) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_activity_history_punish_ticket/${idPunishTicket}?lang=vi`
  );
};

export const getTotalPunishTicketApi = (query) => {
  return axiosClient.get(
    `/admin/punish_ticket_manage/get_total_punish_ticket?lang=vi${query}`
  );
};
export const verifyPunishTicketApi = (idPunishTicket) => {
  return axiosClient.post(
    `/admin/punish_ticket_manage/verify_item/${idPunishTicket}?lang=vi`
  );
};

export const cancelPunishTicketApi = (idPunishTicket) => {
  return axiosClient.post(
    `/admin/punish_ticket_manage/cancel_item/${idPunishTicket}?lang=vi`
  );
};

export const revokePunishTicketApi = (idPunishTicket) => {
  return axiosClient.post(
    `/admin/punish_ticket_manage/revoke_item/${idPunishTicket}?lang=vi`
  );
};
