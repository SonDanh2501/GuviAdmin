import axiosClient from "../axios";
export const createNew= (payload) =>{return  axiosClient.post("/admin/news_manager/create_item", payload)};
export const fetchNews = () =>{ return axiosClient.get("/admin/news_manager/get_list?type=guvilover")}; 
export const fetchNewById = () =>{ return axiosClient.get("//admin/news_manager/get_detail/:id")};
export const updateNew = (payload) =>{
  return axiosClient.post("/admin/news_manager/edit_item/:id", payload)};
export const activeNew = (payload) =>{
  return axiosClient.post("/admin/news_manager/active/:id", payload)};
export const deleteNew = (payload) =>{
  return axiosClient.post("/admin/news_manager/delete/:id", payload)};
