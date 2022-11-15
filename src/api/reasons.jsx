import axiosClient from "../axios";
export const createReason= (payload) =>{return  axiosClient.post("/admin/reason_cancel_manager/create_item", payload)};
export const fetchReasons = () =>{ return axiosClient.get("/admin/reason_cancel_manager/get_list")}; 
export const fetchReasonById = () =>{ return axiosClient.get("/admin/reason_cancel_manager/detail_item/:id")};
export const updateReason = (payload) =>{
  return axiosClient.post("/admin/reason_cancel_manager/edit_item/:id", payload)};
export const activeReason = (payload) =>{
  return axiosClient.post("/admin/reason_cancel_manager/active_item/:id", payload)};
export const deleteReason = (payload) =>{
  return axiosClient.post("/admin/reason_cancel_manager/delete_item/:id", payload)};
