import axiosClient from "../axios";

//
export const getListTransactionApi = (start, length, query, search) => {
  return axiosClient.get(
    `api/admin/transaction_manager/get_list?lang=vi&start=${start}&length=${length}&search=${search}${query}`
  );
};

export const getListTransactionV2Api = (
  start = 0,
  length = 20,
  query,
  search = ""
) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_list?lang=vi&start=${start}&length=${length}&search=${search}${query}`
  );
};
/**
 *
 * @param {*} data
 * @property id_customer : id của KH
 * @property id_collaborator : id của CTV
 * @property id_reason_punish : id lý do phạt
 * @property money: số tiền
 * @property subject: loại chủ thể cho giao dịch này customer - collaborator - other
 * @property id_order: id của đơn hàng liên quan (nếu đó là lệnh phạt)
 * @returns
 */
export const createTransactionApi = (data) => {
  return axiosClient.post(`/admin/transaction_manager/create_item`, data);
};

/**
 *
 * @param {*} id của transaction
 * @returns
 */
export const verifyTransactionApi = (id) => {
  return axiosClient.post(`/admin/transaction_manager/verify_item/${id}`);
};

/**
 *
 * @param {*} id của transaction
 * @returns
 */
export const deleteTransactionApi = (id) => {
  return axiosClient.post(`/admin/transaction_manager/delete_item/${id}`);
};

/**
 *
 * @param {*} id của transaction
 * @returns
 */
export const cancelTransactionApi = (id) => {
  return axiosClient.post(`/admin/transaction_manager/cancel_item/${id}`);
};

export const getTotalTransactionApi = (query, search) => {
  return axiosClient.get(
    `api/admin/transaction_manager/get_total?lang=vi&search=${search}${query}`
  );
};
export const getTotalTransactionCustomerApi = (_query) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_total_transaction_customer?lang=vi&${_query}`
  );
};
export const getTotalTransactionStaffApi = (_query) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_total_transaction_staff?lang=vi&${_query}`
  );
};
export const getTotalMoneyTransactionApi = (key, _query) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_total_money/${key}?lang=vi&${_query}`
  );
};
export const getTotalMoneyTransactionPaySourceApi = (key, _query) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_total_money/${key}?lang=vi&${_query}`
  );
};

/**
 *
 * @param {*} id của transaction
 * @returns
 */
export const getDetailTransactionApi = (id) => {
  return axiosClient.get(`/admin/transaction_manager/detail_item/${id}`);
};

/**
 *
 * @param {*} id của transaction
 * @returns
 */
export const getActivityHistoryTransactionApi = (id) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_activity_history_transaction/${id}`
  );
};

export const getListTransactionAffiliateAdminApi = (
  start,
  length,
  query,
  search
) => {
  return axiosClient.get(
    `api/admin/transaction_manager/get_list_affiliate?start=${start}&length=${length}&search=${search}${query}`
  );
};

export const cancelTransactionAffiliateAdminApi = (id) => {
  return axiosClient.post(
    `api/admin/transaction_manager/cancel_transaction/${id}`
  );
}

export const verifyTransactionAffiliateAdminApi = (id) => {
  return axiosClient.post(
    `api/admin/transaction_manager/verify_transaction/${id}`
  );
};
