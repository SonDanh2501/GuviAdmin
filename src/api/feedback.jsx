import axiosClient from "../axios";

export const getFeedbackApi = (start, length) => {
  return axiosClient.get(
    `/admin/feedback_manager/get_list?start=${start}&length=${length}`
  );
};

export const searchFeedbackApi = (payload) => {
  return axiosClient.get(`/admin/feedback_manager/get_list?search=${payload}`);
};
