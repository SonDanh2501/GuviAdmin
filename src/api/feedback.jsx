import axiosClient from "../axios";

export const getFeedbackApi = () => {
  return axiosClient.get("/admin/feedback_manager/get_list");
};

export const searchFeedbackApi = (payload) => {
  return axiosClient.get(`/admin/feedback_manager/get_list?search=${payload}`);
};
