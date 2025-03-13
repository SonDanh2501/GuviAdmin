import { Pagination, Popover, Table, Select, message } from "antd";
// import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link, useLocation } from "react-router-dom";
// import { getReportOrder } from "../../../../api/report";
// import CustomDatePicker from "../../../../components/customDatePicker";
// import LoadingPagination from "../../../../components/paginationLoading";
// import { formatMoney } from "../../../../helper/formatMoney";
// import useWindowDimensions from "../../../../helper/useWindowDimensions";
// import i18n from "../../../../i18n";
// import { getLanguageState } from "../../../../redux/selectors/auth";
// import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
// import DataTable from "../../../../components/tables/dataTable";
// import CardMultiInfo from "../../../../components/card/cardMultiInfo";
import "./index.scss";
import { formatMoney } from "../../../../../helper/formatMoney";
import DataTable from "../../../../../components/tables/dataTable";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import { getReportOrder } from "../../../../../api/report";
import RangeDatePicker from "../../../../../components/datePicker/RangeDatePicker";
import moment from "moment";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import { errorNotify } from "../../../../../helper/toast";
import FilterData from "../../../../../components/filterData";
import { useLocation } from "react-router-dom";

const ReportOrderDone = () => {
  const lang = useSelector(getLanguageState);
  const { state } = useLocation();
  const date = state?.date;
  /* ~~~ Value ~~~ */
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState([]);
  const [totalValue, setTotalValue] = useState([]);
  const [start, setStart] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  /* ~~~ List ~~~ */
  const [listData, setListData] = useState([]);
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      dataIndex: "",
      key: "ordinal",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày làm" />,
      dataIndex: "date_work",
      key: "date_hour",
      width: 100,
      position: "center",
    },
    {
      customTitle: <CustomHeaderDatatable title="Mã đơn" />,
      dataIndex: "id_view",
      key: "text_link",
      width: 130,
    },
    {
      customTitle: <CustomHeaderDatatable title="Trạng thái" />,
      dataIndex: "status",
      key: "case_status",
      width: 120,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng giá trị giao dịch"
          subValue={totalValue?.total_fee}
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume"
        />
      ),
      dataIndex: "total_fee",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thu hộ dịch vụ"
          subValue={totalValue?.total_net_income_new}
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả đối tác: tiền tip từ khách,..."
        />
      ),
      dataIndex: "total_net_income_new",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu"
          subValue={
            totalValue?.total_fee - totalValue?.total_net_income_new || null
          }
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
        />
      ),
      dataIndex: "revenue",
      key: "money",
      width: 120,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giảm giá"
          subValue={totalValue?.total_discount_new || null}
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ: giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
        />
      ),
      dataIndex: "total_discount_new",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu thuần"
          subValue={
            totalValue?.total_fee -
              totalValue?.total_net_income_new -
              totalValue?.total_discount_new || null
          }
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
        />
      ),
      dataIndex: "net_revenue",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng hóa đơn"
          subValue={
            totalValue?.total_fee - totalValue?.total_discount_new || null
          }
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
        />
      ),
      dataIndex: "invoice",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giá vốn"
          subValue={totalValue?.punishss}
          typeSubValue="money"
        />
      ),
      dataIndex: "punishss",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Phí áp dụng"
          subValue={totalValue?.total_service_fee}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_service_fee",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thuế"
          subValue={totalValue?.total_tax}
          typeSubValue="money"
        />
      ),
      dataIndex: "total_tax",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng lợi nhuận"
          subValue={
            totalValue?.total_fee -
              totalValue?.total_net_income_new -
              totalValue?.total_discount_new || null
          }
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần (+) thu nhập khác"
        />
      ),
      dataIndex: "net_revenue",
      key: "money",
      width: 150,
    },

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Lợi nhuận sau thuế"
          subValue={
            totalValue?.total_fee -
              totalValue?.total_net_income_new -
              totalValue?.total_discount_new -
              totalValue?.total_tax || null
          }
          typeSubValue="money"
          textToolTip="Lợi nhuận sau thuế = Tổng lợi nhuận (-) Thuế"
        />
      ),
      dataIndex: "profit_after_tax",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="% Lợi nhuận"
          typeSubValue="percent"
          textToolTip="% Lợi nhuận = Lời nhuận sau thuế (/) Tổng lời nhuận"
        />
      ),
      dataIndex: "percent_income_envenue",
      key: "percent",
      width: 120,
      position: "center",
    },
  ];
  /* ~~~ Handle function ~~~ */
  const fetchDataReportOrder = async () => {
    try {
      setIsLoading(true);
      const res = await getReportOrder(
        start,
        lengthPage,
        startDate,
        endDate,
        "date_work",
        ["done"]
      );
      setListData(res?.data);
      setTotal(res?.totalItem);
      setTotalValue(res?.total[0]);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setIsLoading(false);
    }
  };
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    if (date) {
      setStartDate(moment(date, "DD-MM-YYYY").startOf("date").toISOString());
      setEndDate(moment(date, "DD-MM-YYYY").endOf("date").toISOString());
    }
  }, []);
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchDataReportOrder();
    }
  }, [startDate, endDate, start, lengthPage]);
  /* ~~~ Other ~~~ */
  /* ~~~ Main ~~~ */
  return (
    <div className="report-order-revenue">
      <div className="report-order-revenue__header">
        <span className="report-order-revenue__header--title">
          Báo cáo doanh thu chi tiết từng đơn
        </span>
        <div>
          <FilterData
            startDate={startDate}
            endDate={endDate}
            isTimeFilter={true}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            // rangeDateDefaults={"all"}
          />
        </div>
        {/* <div className="div-range-date">
          <RangeDatePicker
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            onCancel={() => {}}
            // defaults={defaultRangeTime}
          />
          <p className="date">
            {moment(startDate).format("DD/MM/YYYY")} -{" "}
            {moment(endDate).format("DD/MM/YYYY")}
          </p>
        </div> */}
      </div>
      <div>
        <DataTable
          columns={columns}
          data={listData}
          // actionColumn={addActionColumn}
          start={start}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          // detectLoading={detectLoading}
          // getItemRow={setItem}
          onCurrentPageChange={setStart}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReportOrderDone;
