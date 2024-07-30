import axiosClient from "../axios";

export const unAssignCollaborator = (id) => {
  return axiosClient.post(
    `/api/admin/group_order_manager/unassign_collaborator/${id}?lang=en`
  );
};