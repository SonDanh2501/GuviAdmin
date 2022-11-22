import axiosClient from "../axios";

export const getFeedbackApi = () => {
  return axiosClient.get("/admin/feedback_manager/get_list");
};
