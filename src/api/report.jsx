import axiosClient from "../axios";

export const getReportCollaborator = (start, length) => {
  return axiosClient.get(
    `/admin/report_mananger/report_collaborator?lang=vi&start=${start}&length=${length}`
  );
};

export const filterReportCollaborator = (
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_collaborator?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportCollaboratorDetails = (id, start, length) => {
  return axiosClient.get(
    `/admin/report_mananger/report_collaborator/get_detail/${id}?start=${start}&length=${length}`
  );
};

export const filterReportCollaboratorDetails = (
  id,
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_collaborator/get_detail/${id}?start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};
