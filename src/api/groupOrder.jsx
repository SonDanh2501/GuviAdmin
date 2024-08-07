import axiosClient from "../axios";

export const unAssignCollaborator = (id, data) => {
  return axiosClient.post(
    `/api/admin/group_order_manager/unassign_collaborator/${id}?lang=en`,
    data
  );
};