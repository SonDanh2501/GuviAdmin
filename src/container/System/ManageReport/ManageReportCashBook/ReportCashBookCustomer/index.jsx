import React, { useEffect, useState } from "react";
import DataTable from "../../../../../components/tables/dataTable";
import FilterData from "../../../../../components/filterData";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import moment from "moment";
import icons from "../../../../../utils/icons";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import {
  getDetailReportCashBookApi,
  getReportCashBookCollaboratorApi,
  getReportCashBookCustomerApi,
} from "../../../../../api/report";

const { IoReceipt, IoCash, IoTrendingUp, IoHappy } = icons;

const ReportCashBookCustomer = () => {
  return <div>ReportCashBookCustomer</div>;
};

export default ReportCashBookCustomer;
