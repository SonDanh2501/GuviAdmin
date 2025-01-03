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

export const getReportCollaboratorDetails = (
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

//customer
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
    `/admin/customer_manager/total_customer_dayly?lang=vi&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getTotalDetailCustomerDay = (
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/customer_manager/detail_total_customer_daily?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
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

export const getReportCustomerOrderByAreaApi = () => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_by_order_from_area?lang=vi`
  );
};

//order

// export const getReportOrder = (start, length, start_date, end_date, type) => {
//   return axiosClient.get(
//     `/admin/group-order-manager/report_group_order?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&type=${type}`
//   );
// };

export const getReportOrder = (start, length, start_date, end_date, type_date, status) => {
  return axiosClient.get(
    `/admin/report_mananger/report_group_order?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&type_date=${type_date}&status=${status}`
  );
};

export const getTopCustomerInviteTime = (start_date, end_date, type) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_inviter_for_time?lang=vi&start_date=${start_date}&end_date=${end_date}&type=${type}`
  );
};

export const getReportCustomer = (
  start,
  length,
  start_date,
  end_date,
  type
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_old_new?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&type=${type}`
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

export const getReportConnectionCustomer = (
  start,
  length,
  start_date,
  end_date
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_connection_rate_customer?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}`
  );
};

export const getReportReviewCollaborator = (
  start,
  length,
  start_date,
  end_date,
  star,
  search,
  type,
  city,
  district
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_review?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&star=${star}&search=${search}&type=${type}&city=${city}&district=${district}`
  );
};

export const getReportTypeService = (start_date, end_date, city, district) => {
  return axiosClient.get(
    `/admin/report_mananger/report_type_service?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}&district=${district}`
  );
};

export const getReportServiceByArea = (start_date, end_date, city) => {
  if(city) {
    return axiosClient.get(
      `/admin/report_mananger/report_service_by_area?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}&district=`
    );
  } else {
    return axiosClient.get(
      `/admin/report_mananger/report_service_by_area?lang=vi&start_date=${start_date}&end_date=${end_date}`
    );
  }
};

export const getReportServiceDetails = (start_date, end_date, city) => {
  return axiosClient.get(
    `/admin/report_mananger/report_detail_service_by_area?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}&district=`
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
  end_date,
  type,
  city
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_overview_cancel_order?lang=vi&start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&type=${type}&city=${city}`
  );
};

export const getCancelReportCustomer = (
  start_date,
  end_date,
  city,
  district
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_cancel_order?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}&district=${district}`
  );
};

export const getCancelReportUserSystem = (start_date, end_date, city) => {
  return axiosClient.get(
    `/admin/report_mananger/report_user_system_cancel_order?lang=vi&start_date=${start_date}&end_date=${end_date}&city=${city}`
  );
};

export const getReportCustomerByCity = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_by_city?lang=vi&start_date=${start_date}&end_date=${end_date}`
  );
};

export const checkReviewCollaborator = (id, data) => {
  return axiosClient.post(
    `/admin/order_manager/admin_check_review/${id}?lang=vi`,
    data
  );
};

export const getReportOrderDaily = (
  start,
  length,
  start_date,
  end_date,
  type,
  valueSort,
  typeSort = "date_work"
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_order_dayly?start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&type=${type}&valueSort=${valueSort}&typeSort=${typeSort}`
  );
};

export const getReportPercentOrderDaily = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/report_mananger/total_order_daily?start_date=${start_date}&end_date=${end_date}`
  );
};

export const getTotalReportOrderDaily = (start_date, end_date, typeDate) => {
  return axiosClient.get(
    `/admin/report_mananger/total_order_daily?start_date=${start_date}&end_date=${end_date}&type_date=${typeDate}`
  );
};

export const getReportOrderByCity = (
  start,
  length,
  start_date,
  end_date,
  city
) => {
  return axiosClient.get(
    `/admin/report_mananger/report_order_city?start=${start}&length=${length}&start_date=${start_date}&end_date=${end_date}&city=${city}`
  );
};

export const getReportPercentOrderByCity = (start_date, end_date, city) => {
  return axiosClient.get(
    `/admin/report_mananger/report_percent_order_city?start_date=${start_date}&end_date=${end_date}&city=${city}`
  );
};

export const getReportOrderDay = (start_date, end_date, type) => {
  return axiosClient.get(
    `/admin/report_mananger/report_order_day_in_week?start_date=${start_date}&end_date=${end_date}&type=${type}`
  );
};

export const getReportCustomerRatio = (start_date, end_date) => {
  return axiosClient.get(
    `/admin/report_mananger/report_customer_rate?start_date=${start_date}&end_date=${end_date}`
  );
};


export const getReportOrderByCustomer = (
  start_date,
  end_date,
  type_customer,
  type_date,
  typeStatus,
  start,
  length
) => {
  return axiosClient.get(
    `api/admin/report_mananger/report_order_by_customer?start_date=${start_date}&end_date=${end_date}&type_customer=${type_customer}&type_date=${type_date}&type_status=${typeStatus}&start=${start}&length=${length}`
  );
};

export const getReportFirstOrderByCustomer = (
  start_date,
  end_date,
  type_customer,
  type_date,
  type_status,
  start,
  length
) => {
  return axiosClient.get(
    `api/admin/report_mananger/report_first_order_by_customer?start_date=${start_date}&end_date=${end_date}&type_customer=${type_customer}&type_date=${type_date}&type_status=${type_status}&start=${start}&length=${length}`
  );
};

export const getReportTotalOrderByCustomer = (
  start_date,
  end_date,
  type_customer,
  type_date,
  typeStatus
) => {
  return axiosClient.get(
    `api/admin/report_mananger/report_total_order_by_customer?start_date=${start_date}&end_date=${end_date}&type_customer=${type_customer}&type_date=${type_date}&type_status=${typeStatus}`
  );
};

export const getReportTotalFirstOrderByCustomer = (start_date, end_date, type_customer, type_date) => {
  return axiosClient.get(
    `api/admin/report_mananger/report_total_first_order_by_customer?start_date=${start_date}&end_date=${end_date}&type_customer=${type_customer}&type_date=${type_date}`
  );
};

export const getReportCustomerStatisfaction = (start_date, end_date) => {
  return axiosClient.get(
    `api/admin/report_mananger/generate_customer_satisfaction_report?start_date=${start_date}&end_date=${end_date}`
  )
}

export const getReportOrderByCollaborator = (start, length, start_date, end_date, status) => {
  return axiosClient.get(
    `/admin/report_mananger/report_order_by_collaborator?start_date=${start_date}&end_date=${end_date}&type_date=date_work&start=${start}&length=${length}&status=${status}`
  );
};

export const getReportDetailOrderByCollaborator = (idCollaborator, start, length, start_date, end_date, status) => {
  return axiosClient.get(
    `/admin/report_mananger/report_order_by_collaborator/get_detail/${idCollaborator}?start_date=${start_date}&end_date=${end_date}&type_date=date_work&start=${start}&length=${length}&status=${status}`
  );
};