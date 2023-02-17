import axiosClient from "../axios";

export const getFeedbackApi = (start, length) => {
  return axiosClient.get(
    `/admin/feedback_manager/get_list?start=${start}&length=${length}`
  );
};

export const searchFeedbackApi = (payload) => {
  return axiosClient.get(
    `/admin/feedback_manager/get_list?search=${payload}&start=0&length=20`
  );
};

export const deleteFeedbackApi = (id) => {
  return axiosClient.post(`/admin/feedback_manager/delete_feedback/${id}`);
};
