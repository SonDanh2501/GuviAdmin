import axiosClient from "../axios";

//
export const getListTransactionApi = (
  start = 0,
  length = 20,
  type_transfer = "all",
  kind_transfer = "all",
  search = ""
) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_list?lang=vi&start=${start}&length=${length}&type_transfer=${type_transfer}&kind_transfer=${kind_transfer}&search=${search}`
  );
};
export const getListTransactionV2Api = (start = 0, length = 20, query) => {
  return axiosClient.get(
    `/admin/transaction_manager/get_list?lang=vi&start=${start}&length=${length}&${query}`
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
