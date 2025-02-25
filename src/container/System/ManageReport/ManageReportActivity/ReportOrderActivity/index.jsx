import React, { useEffect, useState } from "react";
import "./index.scss";
import CustomHeaderDatatable from "../../../../../components/tables/tableHeader";
import DataTable from "../../../../../components/tables/dataTable";
import FilterData from "../../../../../components/filterData";
import { errorNotify } from "../../../../../helper/toast";
import {
  getReportOrderActivityApi,
  getReportOrderDailyApi,
  getTotalReportOrderDaily,
} from "../../../../../api/report";
import { formatMoney } from "../../../../../helper/formatMoney";
import icons from "../../../../../utils/icons";
import moment from "moment";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";
import { number_processing } from "../../../../../helper/numberProcessing";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import ButtonCustom from "../../../../../components/button";
import { exportToExcel } from "../../../../../utils/contant";

const { IoReceipt, IoCash, IoTrendingUp, IoHappy } = icons;

const renderTooltipContent = (data) => {
  const { payload } = data;
  return (
    <>
      {payload && payload?.length > 0 ? (
        <>
          <div className="tool-tip">
            <div style={{ color: payload[0]?.color }}>
              <span>{payload[0]?.payload?.date_report}: </span>
              <span>
                {payload[0]?.payload?.total_item
                  ? `${payload[0]?.value} Đơn`
                  : formatMoney(payload[0]?.value)}
              </span>
            </div>
            <div style={{ color: payload[1]?.color }}>
              <span>{payload[1]?.payload?.date_report_same}: </span>
              <span>
                {payload[1]?.payload?.total_item
                  ? `${payload[1]?.value} Đơn`
                  : formatMoney(payload[1]?.value)}
              </span>
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

const HeaderInfoCharts = ({ total, arrow, percentSame }) => {
  return (
    <div className="report-order-daily-revenue__chart--header-total">
      <div className="">
        <span>{total}&nbsp;</span>
      </div>
      <div
        className={`report-order-daily-revenue__chart--header-total-compare ${
          arrow === "up" ? "up" : "down"
        }`}
      >
        {arrow === "up" ? (
          <span>
            <CaretUpOutlined style={{ marginRight: 0, color: "green" }} />
          </span>
        ) : (
          <span>
            <CaretDownOutlined style={{ marginRight: 0, color: "red" }} />
          </span>
        )}
        <span className="">{percentSame}%</span>
        <span>&nbsp; so với cùng kỳ</span>
      </div>
    </div>
  );
};

const ReportOrderActivity = () => {
  const headerDefault = {
    total: 0,
    arrow: "up",
    percent: 0,
  };
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
      customTitle: <CustomHeaderDatatable title="Ngày tạo" />,
      dataIndex: "_id",
      key: "id_date_work",
      width: 100,
      position: "center",
      navigate: "/report/manage-report/report-detail-revenue",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số đơn hàng"
          subValue={listTotalStatistic?.total_item}
          typeSubValue="number"
        />
      ),
      dataIndex: "total_orders_created",
      key: "number",
      width: 130,
      position: "center",
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng giá trị giao dịch dự kiến"
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume"
          subValue={listTotalStatistic?.total_fee}
        />
      ),
      dataIndex: "total_gmv_done",
      key: "money",
      width: 210,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thu hộ dịch vụ dự kiến"
          subValue={listTotalStatistic?.total_net_income_new}
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả đối tác: tiền tip từ khách,..."
        />
      ),
      dataIndex: "total_service_collection_amount_done",
      key: "money",
      width: 200,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tiền hoàn lại"
          subValue={listTotalStatistic?.total_net_income_new}
          typeSubValue="money"
          textToolTip="Chưa có"
        />
      ),
      dataIndex: "total_net_income_new",
      key: "money",
      width: 150,
    },
    // {
    //   customTitle: (
    //     <CustomHeaderDatatable
    //       title="Doanh thu dự kiến"
    //       subValue={
    //         listTotalStatistic?.total_fee -
    //           listTotalStatistic?.total_net_income_new || null
    //       }
    //       typeSubValue="money"
    //       textToolTip="Doanh thu = Tổng giá trị giao dịch (-) Thu hộ dịch vụ"
    //     />
    //   ),
    //   dataIndex: "total_revenue_done",
    //   key: "money",
    //   width: 120,
    // },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giảm giá"
          subValue={listTotalStatistic?.total_discount_new || null}
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ: giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
        />
      ),
      dataIndex: "total_discount_done",
      key: "money",
      width: 100,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu thuần dự kiến"
          subValue={
            listTotalStatistic?.total_fee -
              listTotalStatistic?.total_net_income_new -
              listTotalStatistic?.total_discount_new || null
          }
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
        />
      ),
      dataIndex: "net_revenue",
      key: "money",
      width: 200,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng hóa đơn dự kiến"
          subValue={
            listTotalStatistic?.total_fee -
              listTotalStatistic?.total_discount_new || null
          }
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá."
        />
      ),
      dataIndex: "invoice",
      key: "money",
      width: 170,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giá vốn"
          // subValue={0}
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
          title="Phí áp dụng"
          subValue={listTotalStatistic?.total_service_fee}
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
          subValue={listTotalStatistic?.total_tax}
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
            listTotalStatistic?.total_fee -
              listTotalStatistic?.total_net_income_new -
              listTotalStatistic?.total_discount_new || null
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
            listTotalStatistic?.total_fee -
              listTotalStatistic?.total_net_income_new -
              listTotalStatistic?.total_discount_new -
              listTotalStatistic?.total_tax || null
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
  // 1. Hàm fetch dữ liệu của bảng
  const fetchReportOrderDaily = async (payload) => {
    try {
      setIsLoading(true);
      const res = await getReportOrderActivityApi(
        payload.start,
        payload.lengthPage,
        payload.startDate,
        payload.endDate
      );
      setListData(res?.data)
      setIsLoading(false);
    } catch (err) {
      errorNotify({
        message: err?.message || err,
      });
      setIsLoading(false);
    }
  };

  // const visualizationDataOrder = (data, dataInsame) => {
  //   const tempOrder = [];
  //   for (let i = 0; i < data.data.length; i++) {
  //     const payload = {
  //       total_item: data.data[i].total_item,
  //       date_report: data.data[i]._id.slice(0, 5),
  //       total_item_same: dataInsame.data[i]?.total_item,
  //       date_report_same: dataInsame.data[i]?._id.slice(0, 5),
  //     };
  //     tempOrder.push(payload);
  //   }
  //   setDataChartsOrder(tempOrder);
  //   // const percentOrder = (data.totalOrder[0]?.total_item / (data.totalOrder[0]?.total_item + dataInsame.totalOrder[0]?.total_item)) * 100;
  //   // const percentSameOrder = (dataInsame.totalOrder[0]?.total_item / (data.totalOrder[0]?.total_item + dataInsame.totalOrder[0]?.total_item)) * 100

  //   const percentOrder =
  //     data.totalOrder[0]?.total_item / dataInsame.totalOrder[0]?.total_item - 1;
  //   const headerTempOrder = {
  //     total: data.totalOrder[0]?.total_item + " Đơn hàng",
  //     arrow: percentOrder > 0 ? "up" : "down",
  //     percent: Math.abs((percentOrder * 100).toFixed(2)),
  //   };
  //   setHeaderChartsOrder(headerTempOrder);
  // };

  // const fetchTotalReportDaily = async () => {
  //   const arrGetResult = await Promise.all([
  //     getTotalReportOrderDaily(startDate, endDate, "date_create", "done"),
  //     getTotalReportOrderDaily(
  //       previousStartDate,
  //       previousEndDate,
  //       "date_create",
  //       "done"
  //     ),
  //   ]);
  //   visualizationDataOrder(arrGetResult[0], arrGetResult[1]);
  // };
  /* ~~~ Use effect ~~~ */
  // 1. Fetch dữ liệu của bảng
  useEffect(() => {
    if (startDate !== "" && endDate !== "") {
      fetchReportOrderDaily({ startPage, lengthPage, startDate, endDate });
    }
  }, [startDate, endDate, startPage, lengthPage]);
  // 2. Fetch dữ liệu của cột
  // useEffect(() => {
  //   fetchTotalReportDaily();
  // }, [previousStartDate, previousEndDate]);
  // 3. Tính toán thời gian của kỳ trước dựa trên kỳ hiện tại
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
          Báo cáo hoạt động đơn hàng
        </span>
        {/* <div className="report-order-daily-revenue__header--total-statistic">
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow blue">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoReceipt />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng đơn hàng
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {listTotalStatistic?.total_item}&nbsp;đơn
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow green">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoTrendingUp />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng giá trị giao dịch
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(listTotalStatistic?.total_fee)}
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow yellow">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoCash />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng doanh thu
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(
                  listTotalStatistic?.total_fee -
                    listTotalStatistic?.total_net_income_new || null
                )}
              </span>
            </div>
          </div>
          <div className="report-order-daily-revenue__header--total-statistic-child card-shadow red">
            <div className="line"></div>
            <div className="report-order-daily-revenue__header--total-statistic-child-icon">
              <span>
                <IoHappy />
              </span>
            </div>
            <div className="report-order-daily-revenue__header--total-statistic-child-value">
              <span className="report-order-daily-revenue__header--total-statistic-child-value-title">
                Tổng lợi nhuận
              </span>
              <span className="report-order-daily-revenue__header--total-statistic-child-value-numer">
                {formatMoney(
                  listTotalStatistic?.total_fee -
                    listTotalStatistic?.total_net_income_new -
                    listTotalStatistic?.total_discount_new || null
                )}
              </span>
            </div>
          </div>
        </div> */}
        <div>
          <FilterData
            isTimeFilter={true}
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

export default ReportOrderActivity;
