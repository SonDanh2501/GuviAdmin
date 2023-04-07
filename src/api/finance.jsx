import axiosClient from "../axios";

export const getBalanceCollaborator = () => {
  return axiosClient.get(
    `/admin/report_mananger/report_total_collaborator_balance?lang=vi`
  );
};

export const getReportTransitionCollaborator = (
  start,
  length,
  startDate,
  endDate
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_transition_collaborator_for_time?lang=vi&start=${start}&length=${length}&start_date=${startDate}&end_date=${endDate}`
  );
};

export const getBalanceCustomer = (startDate, endDate) => {
  return axiosClient.get(
    `/admin/report_mananger/report_total_customer_balance?lang=vi&start_date=${startDate}&end_date=${endDate}`
  );
};
