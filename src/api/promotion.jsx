import axiosClient from "../axios";

export const fetchPromotion = () => {
  return axiosClient.get("/admin/promotion_manager/get_list?lang=vi");
};

export const createPromotion = (data) => {
  return axiosClient.post("/admin/promotion_manager/create_item?lang=vi", data);
};

export const getGroupCustomerPromotion = () => {
  return axiosClient.get("/admin/group_customer_mamager/get_list");
};
