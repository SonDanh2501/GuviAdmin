import axiosClient from "../axios";
//group-service
export const getTotalReportApi = () => {
  return axiosClient.get("/admin/report_mananger/get_general_total_report");
};

export const getDayReportApi = (start, end) => {
  return axiosClient.get(
    `/admin/report_mananger/total_finance_job_system?lang=vi&start_date=${start}&end_date=${end}`
  );
};
