import axiosClient from "../axios";

export const getListPunishTicketApi = (
  start,
  length,
  start_date,
  end_date,
  status,
  user_apply,
  created_by,
  search
) => {
  return axiosClient.get(
    `api/admin/punish_ticket_manager/get_list?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&status=${status}&user_apply=${user_apply}&created_by=${created_by}&search=${search}`
  );
};

export const getTotalPunishTicketApi = (start_date,end_date) => {
  return axiosClient.get(
    `api/admin/punish_ticket_manager/get_total_punish_ticket?lang=vi&start_date=${start_date}&end_date=${end_date}`
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
    // `/admin/punish_ticket_manage/revoke_item/${idPunishTicket}?lang=vi`
    `/api/admin/punish_ticket_manager/revoke_item/${idPunishTicket}?lang=vi`
  );
};
