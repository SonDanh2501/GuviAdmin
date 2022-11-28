import axiosClient from "../axios";
export const createReason = (payload) => {
  return axiosClient.post("/admin/reason_cancel_manager/create_item", payload);
};
export const fetchReasons = (start, length) => {
  return axiosClient.get(
    `/admin/reason_cancel_manager/get_list?start=${start}&length=${length}`
  );
};
export const fetchReasonById = () => {
  return axiosClient.get("/admin/reason_cancel_manager/detail_item/:id");
};
export const updateReason = (id, payload) => {
  return axiosClient.post(
    `/admin/reason_cancel_manager/edit_item/${id}`,
    payload
  );
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
