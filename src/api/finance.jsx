import axiosClient from "../axios";

export const getBalanceCollaborator = () => {
  return axiosClient.get(
    `/admin/report_mananger/report_total_collaborator_balance?lang=vi`
  );
};
