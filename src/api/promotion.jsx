import axiosClient from "../axios";

export const fetchPromotion = () => {
  return axiosClient.get("/admin/promotion_manager/get_list?lang=vi");
};
