import axiosClient from "../axios";

export const getTotalReportApi = (startDate, endDate) => {
  return axiosClient.get(
    `/admin/report_mananger/get_general_total_report?start_date=${startDate}&end_date=${endDate}`
  );
};

export const getDayReportApi = (start, end) => {
  return axiosClient.get(
    `/admin/report_mananger/total_finance_job_system?lang=vi&start_date=${start}&end_date=${end}`
  );
};

export const getConnectionServicePercentApi = () => {
  return axiosClient.get(`/admin/statistic/connection_service_percent?lang=vi`);
};

export const getActiveUserApi = () => {
  return axiosClient.get(`/admin/statistic/active_users?lang=vi`);
};

export const getHistoryActivityApi = (lang, start, length) => {
  return axiosClient.get(
    `/admin/statistic/history_activity?lang=${lang}&start=${start}&length=${length}`
  );
};

export const getLastestServiceApi = (start, length) => {
  return axiosClient.get(
    `/admin/statistic/lastest_services?start=${start}&length=${length}`
  );
};

export const getTopServiceApi = () => {
  return axiosClient.get(`/admin/statistic/top_services?lang=vi`);
};

export const getTopCollaboratorApi = (startDate, endDate, start, length) => {
  return axiosClient.get(
    `/admin/statistic/top_collaborators?start_date=${startDate}&end_date=${endDate}&start=${start}&length=${length}`
  );
};
