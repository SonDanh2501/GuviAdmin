import axiosClient from "../axios";
export const getReportCollaborator = () => {
  return axiosClient.post(`/admin/report_mananger/report_collaborator?lang=vi`);
};
