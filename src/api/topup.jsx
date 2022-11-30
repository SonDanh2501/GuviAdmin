import axiosClient from "../axios";

export const getTopupCollaboratorApi = (start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_transitions?start=${start}&length=${length}`
  );
};

export const searchTopupCollaboratorApi = (search, start, length) => {
  return axiosClient.get(
    `/admin/collaborator_manager/get_list_transitions?search=${search}&start=${start}&length=${length}`
  );
};

export const TopupMoneyCollaboratorApi = (id, data) => {
  return axiosClient.post(
    `/admin/collaborator_manager/top_up/${id}?lang=vi`,
    data
  );
};
