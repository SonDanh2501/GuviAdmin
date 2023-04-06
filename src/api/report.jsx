import axiosClient from "../axios";

export const getReportCollaborator = (start, length, start_date, end_date) => {
  return axiosClient.get(
    `/admin/report_mananger/report_collaborator?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
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

export const getTotalCustomerDay = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/customer_manager/total_customer_dayly?lang=vi&&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getTotalDetailCustomerDay = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/customer_manager/detail_total_customer_daily?lang=vi&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportCustomerInviteDay = (
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_inviter?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportDetailsCustomerInvite = (id, start, length) => {
  return axiosClient.get(
    `/admin/report_mananger/report_detail_customer_inviter/${id}?lang=vi&start=${start}&length=${length}`
  );
};

export const getTopCustomerInvite = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/report_mananger/top_customer_inviter?lang=vi&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportOrder = (start, length, start_date, end_date) => {
  return axiosClient.get(
    `/admin/group-order-manager/report_group_order?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getTopCustomerInviteTime = (start_date, end_date, type) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_inviter_for_time?lang=vi&start_date=${start_date}&end_date=${end_date}&type=${type}`
  );
};

export const getReportCustomer = (start, length, start_date, end_date) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportCustomerNewOld = (
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_group_order?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportReviewCollaborator = (
  start,
  length,
  start_date,
  end_date,
  star,
  search
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_review?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&star=${star}&search=${search}`
  );
};

export const getReportTypeService = (start_date, end_date, city, district) => {
  return axiosClient.get(
    `/admin/report_mananger/report_type_service?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}&district=${district}`
  );
};

export const getReportCancelReport = (start_date, end_date, city, district) => {
  return axiosClient.get(
    `/admin/report_mananger/report_cancel_order?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}&district=${district}`
  );
};

export const getReportOverviewCancelReport = (
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_overview_cancel_order?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};
