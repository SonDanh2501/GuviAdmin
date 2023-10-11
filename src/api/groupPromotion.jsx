import axiosClient from "../axios";

export const getGroupPromotion = (search, start, length) => {
  return axiosClient.get(
    `/admin/group_promotion_manager/get_list?search=${search}&start=${start}&length=${length}`
  );
};

export const getDetailGroupPromotion = (idGroupPromotion) => {
    return axiosClient.get(`/admin/group_promotion_manager/get_detail/${idGroupPromotion}`);
};

export const createGroupPromotion = (data) => {
    return axiosClient.post("/admin/group_promotion_manager/create_item?lang=vi", data);
};

export const editGroupPromotion = (data) => {
    return axiosClient.post("/admin/group_promotion_manager/edit_item?lang=vi", data);
};

export const changeActiveGroupPromotion = (idGroupPromotion, data) => {
    return axiosClient.post(`/admin/group_promotion_manager/acti_item/${idGroupPromotion}`, data);
};

export const deleteGroupPromotion = (idGroupPromotion) => {
    return axiosClient.post(`/admin/group_promotion_manager/delete_item/${idGroupPromotion}`);
};