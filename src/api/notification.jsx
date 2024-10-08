import axiosClient from "../axios";

export const getListNotification = (status, start, length) => {
  return axiosClient.get(
    `/admin/push_notification_manager/get_list?lang=vi&status=${status}&start=${start}&length=${length}`
  );
};

export const getDetailNotification = (id) => {
  return axiosClient.get(`/admin/push_notification_manager/detail_item/${id}`);
};

export const editPushNotification = (id, data) => {
  return axiosClient.post(
    `/admin/push_notification_manager/edit_item/${id}`,
    data
  );
};

export const deletePushNotification = (id) => {
  return axiosClient.post(`/admin/push_notification_manager/delete_item/${id}`);
};

export const activePushNotification = (id, data) => {
  return axiosClient.post(
    `/admin/push_notification_manager/active_item/${id}`,
    data
  );
};

// Hàm tạo mới
export const getListNotifications = (start, length, is_created) => {
  return axiosClient.get(
    `api/admin/notification_schedule_manager/get_list?start=${start}&length=${length}&is_created=${is_created}`
  );
};

export const createPushNotification = (data) => {
  return axiosClient.post(
    "api/admin/notification_schedule_manager/create_item",
    data
  );
};
