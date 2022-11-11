import axiosClient from "../axios";
export const createCollaborator= (payload) =>{return  axiosClient.post("/admin/collaborator_manager/create_item", payload)};
export const fetchCollaborators = () =>{ return axiosClient.get("/admin/collaborator_manager/get_list_item")}; 
export const fetchCollaboratorById = () =>{ return axiosClient.get("/admin/collaborator_manager/:id")};
export const updateCollaborator = (payload) =>{
  return axiosClient.post("/admin/collaborator_manager/edit_item/:id", payload)};
export const activeCollaborator = (payload) =>{
  return axiosClient.post("/admin/collaborator_manager/acti_item/:id", payload)};
export const deleteCollaborator = (payload) =>{
  return axiosClient.post("/admin/collaborator_manager/delete_item/:id", payload)};

