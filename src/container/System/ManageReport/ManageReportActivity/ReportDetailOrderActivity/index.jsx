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
  getReportDetailOrderActivityApi,
  getReportOrderActivityApi,
} from "../../../../../api/report";
import { useLocation } from "react-router-dom";
import { exportToExcel } from "../../../../../utils/contant";
import ButtonCustom from "../../../../../components/button";

const ReportDetailOrderActivity = () => {
  const { state } = useLocation();
  const date = state?.date;
  const headerDefault = {
    total: 0,
    arrow: "up",
    percent: 0,
  };
  const [isDuplicate, setIsDuplicate] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [headerChartsOrder, setHeaderChartsOrder] = useState(headerDefault);

  /* ~~~ Value ~~~ */
  const [startPage, setStartPage] = useState(0); // Giá trị trang bắt đầu
  const [totalItem, setTotalItem] = useState(0); // Giá trị tổng số lượng item
  const [startDate, setStartDate] = useState(""); // Giá trị ngày bắt đầu
  const [endDate, setEndDate] = useState(""); // Giá trị ngày kết thúc
  const [previousStartDate, setPreviousStartDate] = useState(""); // Giá trị ngày bắt đầu của kì trước
  const [previousEndDate, setPreviousEndDate] = useState(""); // Giá trị ngày kết thúc của kì trước
  const [valueSelectStatus, setValueSelectStatus] = useState(""); // Giá trị lọc theo trạng thái
  /* ~~~ List ~~~ */
  const [listData, setListData] = useState([]);
  const [listTotalStatistic, setListTotalStatistic] = useState([]);
  const [dataChartsOrder, setDataChartsOrder] = useState([]);
  const configLineOrder = [
    {
      dataKey: "total_item",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: "",
    },
    {
      dataKey: "total_item_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2",
    },
  ];
  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="STT" />,
      dataIndex: "",
      key: "ordinal",
      width: 50,
    },
    {
      customTitle: <CustomHeaderDatatable title="Mã đơn" />,
      dataIndex: "id_view",
      key: "text_link",
      width: 150,
      position: "center",
    },
    {
      customTitle: <CustomHeaderDatatable title="Ngày làm" />,
      dataIndex: "date_work",
      key: "case_date-create-time",
      width: 100,
    },

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng giá trị giao dịch dự kiến"
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume"
          subValue={listTotalStatistic?.total_gmv}
        />
      ),
      dataIndex: "total_gmv",
      key: "money",
      width: 210,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thu hộ dịch vụ dự kiến"
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả đối tác: tiền tip từ khách,..."
          subValue={
            listTotalStatistic?.total_projected_service_collection_amount
          }
        />
      ),
      dataIndex: "total_projected_service_collection_amount",
      key: "money",
      width: 200,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu dự kiến"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          subValue={listTotalStatistic?.total_projected_revenue}
        />
      ),
      dataIndex: "total_projected_revenue",
      key: "money",
      width: 150,
    },

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giảm giá dự kiến"
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ: giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
          subValue={listTotalStatistic?.total_projected_discount || null}
        />
      ),
      dataIndex: "total_projected_discount",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thanh toán bằng ngân hàng"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          subValue={listTotalStatistic?.total_money_payment_method_from_bank}
        />
      ),
      dataIndex: "total_money_payment_method_from_bank",
      key: "money",
      width: 200,
      childArray: 0,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thanh toán bằng VNPAY-QR"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          subValue={listTotalStatistic?.total_money_payment_method_from_vnpay}
        />
      ),
      dataIndex: "total_money_payment_method_from_vnpay",
      key: "money",
      width: 200,
      childArray: 1,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thanh toán bằng VNPAY-ATM"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          position="right"
          subValue={listTotalStatistic?.total_money_payment_method_from_vnbank}
        />
      ),
      dataIndex: "total_money_payment_method_from_vnbank",
      key: "money",
      width: 210,
      childArray: 2,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thanh toán bằng thẻ quốc tế"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          position="right"
          subValue={listTotalStatistic?.total_money_payment_method_from_intcard}
        />
      ),
      dataIndex: "total_money_payment_method_from_intcard",
      key: "money",
      width: 210,
      childArray: 2,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thanh toán bằng momo"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          position="right"
          subValue={listTotalStatistic?.total_money_payment_method_from_momo}
        />
      ),
      dataIndex: "total_money_payment_method_from_momo",
      key: "money",
      width: 200,
      childArray: 3,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thanh toán bằng tiền mặt"
          typeSubValue="money"
          textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
          position="right"
          subValue={listTotalStatistic?.total_money_payment_method_from_cash}
        />
      ),
      dataIndex: "total_money_payment_method_from_cash",
      key: "money",
      width: 200,
      childArray: 4,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu thuần dự kiến"
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
          position="right"
          subValue={listTotalStatistic?.total_projected_net_revenue}
        />
      ),
      dataIndex: "total_projected_net_revenue",
      key: "money",
      width: 200,
      childArray: 5,
      childArrayIndex: "money",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng hóa đơn dự kiến"
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
          position="right"
          subValue={listTotalStatistic?.total_projected_invoice}
        />
      ),
      dataIndex: "total_projected_invoice",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giá vốn"
          // subValue={0}
          position="right"
          typeSubValue="number"
        />
      ),
      dataIndex: "punishss",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Phí áp dụng dự kiến"
          typeSubValue="money"
          position="right"
          subValue={listTotalStatistic?.total_projected_applied_fees}
        />
      ),
      dataIndex: "total_projected_applied_fees",
      key: "money",
      width: 150,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thuế dự kiến"
          typeSubValue="money"
          position="right"
          subValue={listTotalStatistic?.total_projected_value_added_tax}
        />
      ),
      dataIndex: "total_projected_value_added_tax",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng lợi nhuận dự kiến"
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần (+) thu nhập khác"
          position="right"
          subValue={listTotalStatistic?.total_projected_profit}
        />
      ),
      dataIndex: "total_projected_profit",
      key: "money",
      width: 200,
    },

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Lợi nhuận sau thuế dự kiến"
          typeSubValue="money"
          textToolTip="Lợi nhuận sau thuế = Tổng lợi nhuận (-) Thuế"
          position="right"
          subValue={listTotalStatistic?.total_projected_profit_after_tax}
        />
      ),
      dataIndex: "total_projected_profit_after_tax",
      key: "money",
      width: 200,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="% Lợi nhuận"
          typeSubValue="percent"
          textToolTip="% Lợi nhuận = Lời nhuận sau thuế (/) Tổng lời nhuận"
        />
      ),
      dataIndex: "profit_percentage_done",
      key: "percent",
      width: 120,
      position: "center",
    },
    {
      customTitle: <CustomHeaderDatatable title="Trạng thái" />,
      dataIndex: "status",
      key: "case_status",
      width: 130,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tiền hoàn lại"
          typeSubValue="money"
          textToolTip="Chưa có"
          subValue={listTotalStatistic?.total_money_canceled}
        />
      ),
      dataIndex: "total_money_canceled",
      key: "money",
      width: 150,
    },
  ];
  const listStatus = [
    { code: "all", label: "Tất cả" },
    { code: "processing", label: "Chờ thanh toán" },
    { code: "pending", label: "Đang Chờ làm" },
    { code: "confirm", label: "Đã nhận" },
    { code: "doing", label: "Đang làm" },
    { code: "done", label: "Hoàn thành" },
    { code: "cancel", label: "Đã hủy" },
  ];

  /* ~~~ Handle function ~~~ */
  // 1. Hàm fetch dữ liệu của bảng
  const fetchReportOrderDaily = async (payload) => {
    try {
      setIsLoading(true);
      const res = await getReportDetailOrderActivityApi(
        payload.startPage,
        payload.lengthPage,
        payload.startDate,
        payload.endDate,
        payload.status
      );
      setListData(res?.data);
      setListTotalStatistic(res.totalItem[0]);
      setTotalItem(res?.total);
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setIsLoading(false);
    }
  };

  /* ~~~ Use effect ~~~ */
  // Fetch dữ liệu của bảng
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchReportOrderDaily({ startPage, lengthPage, startDate, endDate, status: valueSelectStatus });
    }
  }, [startDate, endDate, startPage, lengthPage, valueSelectStatus]);

  useEffect(() => {
    if (date) {
      const timer = setTimeout(() => {
        setStartDate(moment(date, "DD-MM-YYYY").startOf("date").toISOString());
        setEndDate(moment(date, "DD-MM-YYYY").endOf("date").toISOString());
      }, 300);
      return () => clearTimeout(timer);
    }
  }, []);
  // Tính toán thời gian của kỳ trước dựa trên kỳ hiện tại
  useEffect(() => {
    if (startDate !== "") {
      const timeStartDate = new Date(startDate).getTime();
      const timeEndDate = new Date(endDate).getTime();
      const rangeDate = timeEndDate - timeStartDate;
      const tempSameEndDate = timeStartDate - 1;
      const tempSameStartDate = tempSameEndDate - rangeDate;
      setPreviousStartDate(new Date(tempSameStartDate).toISOString());
      setPreviousEndDate(new Date(tempSameEndDate).toISOString());
    }
  }, [startDate, endDate]);
  // Lấy giá trị startdate và enddate từ params
  useEffect(() => {
    // Lấy query string từ URL hiện tại
    const queryString = window.location.search;

    // Chuyển thành đối tượng URLSearchParams
    const params = new URLSearchParams(queryString);
    if (params.get("start_date")) {
      setStartDate(params.get("start_date"));
    }
    if (params.get("end_date")) {
      setEndDate(params.get("end_date"));
    }
    if (params.get("is_duplicate")) {
      setIsDuplicate(params.get("is_duplicate"));
    }
  }, []);
  /* ~~~ Other ~~~ */
  const rightContent = (
    startDate,
    endDate,
    previousStartDate,
    previousEndDate
  ) => {
    return (
      <div className="report-order-daily-revenue__previous-period">
        <div className="report-order-daily-revenue__previous-period-child">
          <span>Kỳ này&nbsp;</span>
          <div className="line"></div>
          <span className="report-order-daily-revenue__previous-period-child-value">
            {startDate}&nbsp;-&nbsp;{endDate}
          </span>
        </div>
        <div className="report-order-daily-revenue__previous-period-child">
          <span>Kỳ trước&nbsp;</span>
          <div className="line"></div>
          <span className="report-order-daily-revenue__previous-period-child-value">
            {previousStartDate}&nbsp;-&nbsp;{previousEndDate}
          </span>
        </div>
        <div>
        <ButtonCustom
            label="Trạng thái"
            options={listStatus}
            value={valueSelectStatus}
            setValueSelectedProps={setValueSelectStatus}
          />
        </div>
      </div>
    );
  };

  const leftContent = () => {
    return (
      <div>
        <ButtonCustom
          label="Xuất Excel"
          customColor="green"
          onClick={() => exportToExcel(listData, "Bao_cao_hoat_dong_don_hang")}
        />
      </div>
    );
  };

  /* ~~~ Main ~~~ */
  return (
    <div className="report-order-daily-revenue">
      <div className="report-order-daily-revenue__header">
        <span className="report-order-daily-revenue__header--title">
          Báo cáo chi tiết hoạt động đơn hàng
        </span>
        <div>
          <FilterData
            isTimeFilter={true}
            startDate={startDate}
            endDate={endDate}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            rightContent={rightContent(
              moment(startDate).format("DD/MM/YYYY"),
              moment(endDate).format("DD/MM/YYYY"),
              moment(previousStartDate).format("DD/MM/YYYY"),
              moment(previousEndDate).format("DD/MM/YYYY")
            )}
            leftContent={leftContent()}
          />
        </div>
      </div>
      <div>
        <DataTable
          columns={columns}
          data={listData}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={totalItem}
          onCurrentPageChange={setStartPage}
          loading={isLoading}
        />
      </div>
    </div>
  );
};

export default ReportDetailOrderActivity;
