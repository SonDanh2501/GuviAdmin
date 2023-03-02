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

export const searchReportCollaborator = (start, length, search) => {
  return axiosClient.get(
    `/admin/report_mananger/report_collaborator?lang=vi&start=${start}&length=${length}&search=${search}`
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

export const getTotalReportCustomer = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/customer_manager/total_customer?start_date=${start_date}&end_date=${end_date}`
  );
};

export const getTotalCustomerYear = (year) => {
  return axiosClient.get(
    `/admin/customer_manager/total_customer_monthly/${year}?lang=vi`
  );
};
