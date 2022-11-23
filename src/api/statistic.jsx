import axiosClient from "../axios";
//group-service
export const getTotalReportApi = () => {
  return axiosClient.get("/admin/report_mananger/get_general_total_report");
};
