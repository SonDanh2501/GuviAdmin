import React, { useCallback, useEffect, useState } from "react";
import { Pagination, Popover, Table } from "antd";
import moment from "moment";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
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
import {
  getReportOrderDailyApi,
  getTotalReportOrderDaily,
} from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";
import { formatMoney } from "../../../../helper/formatMoney";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import DataTable from "../../../../components/tables/dataTable";
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
import { number_processing } from "../../../../helper/numberProcessing";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./styles.scss";
import { IoHelpCircleOutline } from "react-icons/io5";
import CustomHeaderDatatable from "../../../../components/tables/tableHeader";

const ReportOrderDaily = () => {
  const headerDefault = {
    total: 0,
    arrow: "up",
    percent: 0,
  };
  const [currentPage, setCurrentPage] = useState(1);
  // const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTotal, setDataTotal] = useState({});
  const typeDate =
    window.location.pathname.slice(-5) === "-work"
      ? "date_work"
      : "date_create";
  const [startDate, setStartDate] = useState("");
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [endDate, setEndDate] = useState("");
  const [sameStartDate, setSameStartDate] = useState("");
  const [sameEndDate, setSameEndDate] = useState("");
  const [start, setStart] = useState(0);
  const [startPage, setStartPage] = useState(0);
  const [dataChartsOrder, setDataChartsOrder] = useState([]);
  const [headerChartsOrder, setHeaderChartsOrder] = useState(headerDefault);

  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);
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

  // const [totalInfo, setTotalOrder] = useState({
  //   total_gross_income: 0,
  //   total_item: 0,
  //   total_discount: 0
  // });
  // const [todayInfo, setTodayInfo] = useState({
  //   total_gross_income: 0,
  //   total_item: 0,
  //   total_income: 0,
  //   total_net_income_business: 0
  // });

  useEffect(() => {
    if (startDate !== "") {
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(
        Math.abs(
          (new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDay
        )
      );
      getDataReportDaily();
      getTotalReportDaily();
      //  getDataReportToday()
    }
  }, [sameStartDate, sameEndDate, lengthPage]);

  useEffect(() => {
    if (startDate !== "") {
      getDataReportDaily();
    }
  }, [start]);

  useEffect(() => {
    if (startDate !== "") {
      const timeStartDate = new Date(startDate).getTime();
      const timeEndDate = new Date(endDate).getTime();
      const rangeDate = timeEndDate - timeStartDate;
      const tempSameEndDate = timeStartDate - 1;
      const tempSameStartDate = tempSameEndDate - rangeDate;
      setSameStartDate(new Date(tempSameStartDate).toISOString());
      setSameEndDate(new Date(tempSameEndDate).toISOString());
    }
  }, [startDate, endDate]);

  const getTotalReportDaily = async () => {
    const arrGetResult = await Promise.all([
      getTotalReportOrderDaily(startDate, endDate, typeDate, "done"),
      getTotalReportOrderDaily(sameStartDate, sameEndDate, typeDate, "done"),
    ]);
    visualizationDataOrder(arrGetResult[0], arrGetResult[1]);
  };

  const getDataReportDaily = async () => {
    const res = await getReportOrderDailyApi(
      start,
      lengthPage,
      startDate,
      endDate,
      typeDate,
      -1,
      typeDate,
      "done"
    );
    setData(res.data);
    setTotal(res?.totalItem);
    // console.log(res?.total[0], "res?.total[0]");
    setDataTotal(res?.total[0]);
  };

  const getDataReportToday = async () => {
    const startToday = moment()
      .subtract(0, "days")
      .startOf("days")
      .toISOString();
    const endToday = moment().subtract(0, "days").endOf("days").toISOString();
    const res = await getReportOrderDailyApi(
      start,
      lengthPage,
      startToday,
      endToday,
      "date_work"
    );
    // setTodayInfo(res.total[0])
  };

  const visualizationDataOrder = (data, dataInsame) => {
    const tempOrder = [];
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_item: data.data[i].total_item,
        date_report: data.data[i]._id.slice(0, 5),
        total_item_same: dataInsame.data[i]?.total_item,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5),
      };
      tempOrder.push(payload);
    }
    setDataChartsOrder(tempOrder);
    // const percentOrder = (data.totalOrder[0]?.total_item / (data.totalOrder[0]?.total_item + dataInsame.totalOrder[0]?.total_item)) * 100;
    // const percentSameOrder = (dataInsame.totalOrder[0]?.total_item / (data.totalOrder[0]?.total_item + dataInsame.totalOrder[0]?.total_item)) * 100

    const percentOrder =
      data.totalOrder[0]?.total_item / dataInsame.totalOrder[0]?.total_item - 1;
    const headerTempOrder = {
      total: data.totalOrder[0]?.total_item + " Đơn hàng",
      arrow: percentOrder > 0 ? "up" : "down",
      percent: Math.abs((percentOrder * 100).toFixed(2)),
    };
    setHeaderChartsOrder(headerTempOrder);
  };

  const renderTooltipContent = (data) => {
    const { payload } = data;
    return (
      <>
        {payload && payload.length > 0 ? (
          <>
            <div className="tool-tip">
              <div style={{ color: payload[0].color }}>
                <span>{payload[0].payload?.date_report}: </span>
                <span>
                  {payload[0].payload?.total_item
                    ? `${payload[0].value} Đơn`
                    : formatMoney(payload[0].value)}
                </span>
              </div>
              <div style={{ color: payload[1].color }}>
                <span>{payload[1].payload?.date_report_same}: </span>
                <span>
                  {payload[1].payload?.total_item
                    ? `${payload[1].value} Đơn`
                    : formatMoney(payload[1].value)}
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
      <React.Fragment>
        <div className="total-info">
          <div className="text-value">
            <p>{total}&nbsp;</p>
          </div>
          <div className="text-percent">
            {arrow === "up" ? (
              <CaretUpOutlined style={{ marginRight: 5 }} />
            ) : (
              <CaretDownOutlined style={{ marginRight: 5 }} />
            )}
            <p>{percentSame}%</p>
            <span>&nbsp; so với cùng kỳ</span>
          </div>
        </div>
      </React.Fragment>
    );
  };

  // const CustomHeaderDatatable = ({
  //   title,
  //   subValue,
  //   typeSubValue,
  //   textToolTip,
  // }) => {
  //   const content = <p>{textToolTip ? textToolTip : ""}</p>;
  //   if (subValue)
  //     subValue =
  //       typeSubValue === "money"
  //         ? formatMoney(subValue)
  //         : typeSubValue === "percent"
  //         ? subValue + " %"
  //         : subValue;
  //   if (title == "Giá vốn") subValue = "0 đ";
  //   // console.log(subValue, "subValue");
  //   return (
  //     <React.Fragment>
  //       <div className="header-table-custom">
  //         <div className="title-report">
  //           <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
  //             {title}
  //           </p>
  //           {textToolTip ? (
  //             <Popover
  //               content={content}
  //               placement="bottom"
  //               overlayInnerStyle={{
  //                 backgroundColor: "white",
  //               }}
  //             >
  //               <div>
  //                 <IoHelpCircleOutline
  //                   color={`${title === "Doanh thu" ? "#2463eb" : "white"}`}
  //                 />
  //                 {/* <i
  //                   style={{
  //                     color: title === "Doanh thu" ? "#2463eb" : "none",
  //                   }}
  //                   class="uil uil-question-circle icon-question"
  //                 ></i> */}
  //               </div>
  //             </Popover>
  //           ) : (
  //             <></>
  //           )}
  //         </div>
  //         <div className="sub-value">
  //           {subValue ? (
  //             <p style={{ color: title === "Doanh thu" ? "#2463eb" : "none" }}>
  //               {subValue}
  //             </p>
  //           ) : (
  //             <div style={{ marginTop: "35px" }}></div>
  //           )}
  //         </div>
  //       </div>
  //     </React.Fragment>
  //   );
  // };

  const columns = [
    {
      customTitle: (
        <CustomHeaderDatatable title="Ngày tạo" textToolTip="Ngày tạo" />
      ),
      dataIndex: "_id",
      key: "id_date_work",
      navigate:
        typeDate === "date_create"
          ? "/report/manage-report/report-detail-order-date-create"
          : "/report/manage-report/report-detail-order-date-work",
      width: 80,
      fontSize: "text-size-M text-weight-500",

    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Số đơn hàng"
          subValue={dataTotal?.total_item}
          textToolTip="Tổng số lượng đơn hàng"
        />
      ),
      dataIndex: "total_item",
      key: "number",
      width: 95,
      fontSize: "text-size-M text-weight-500 text-center",

    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng giá trị giao dịch"
          subValue={dataTotal?.total_gross_income}
          typeSubValue="money"
          textToolTip="GMV - Gross Merchandise Volume"
        />
      ),
      dataIndex: "total_gross_income",
      key: "money",
      width: 135,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thu hộ dịch vụ"
          subValue={dataTotal?.total_collabotator_fee}
          typeSubValue="money"
          textToolTip="Bao gồm phí dịch vụ trả cho CTV, tiền tip từ khách,…"
        />
      ),
      dataIndex: "total_collabotator_fee",
      key: "money",
      width: 110,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu"
          subValue={dataTotal?.total_income}
          typeSubValue="money"
          textToolTip=""
        />
      ),
      dataIndex: "total_income",
      key: "money",
      width: 110,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giảm giá"
          subValue={dataTotal?.total_discount}
          typeSubValue="money"
          textToolTip="Tổng số tiền giảm giá từ giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…"
        />
      ),
      dataIndex: "total_discount",
      key: "money",
      width: 110,
    },

    {
      customTitle: (
        <CustomHeaderDatatable
          title="Doanh thu thuần"
          subValue={dataTotal?.total_net_income}
          typeSubValue="money"
          textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá."
        />
      ),
      dataIndex: "total_net_income",
      key: "money",
      width: 120,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng hoá đơn"
          subValue={dataTotal?.total_order_fee}
          typeSubValue="money"
          textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền (-) giảm giá."
        />
      ),
      dataIndex: "total_order_fee",
      key: "money",
      width: 110,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Giá vốn"
          subValue={dataTotal?.cost_price}
          typeSubValue="money"
        />
      ),
      dataIndex: "cost_price",
      key: "money",
      width: 80,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Thu nhập khác"
          subValue={dataTotal?.punish}
          typeSubValue="money"
          textToolTip="Bao gồm phí phạt trễ và huỷ ca"
        />
      ),
      dataIndex: "punish",
      key: "money",
      width: 110,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Tổng lợi nhuận"
          subValue={dataTotal?.total_net_income_business}
          typeSubValue="money"
          textToolTip="Tổng lợi nhuận = Doanh thu thuần (+) thu nhập khác"
        />
      ),
      dataIndex: "total_net_income_business",
      key: "money",
      width: 110,
    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="% Lợi nhuận"
          subValue={dataTotal?.percent_income}
          typeSubValue="percent"
          textToolTip="% Lợi nhuận = Tổng lợi nhuận (/) Doanh thu."
        />
      ),
      dataIndex: "percent_income",
      key: "percent",
      width: 90,
      fontSize: "text-size-M text-weight-500",

    },
    {
      customTitle: (
        <CustomHeaderDatatable
          title="Phí áp dụng"
          subValue={dataTotal?.total_service_fee}
          typeSubValue="money"
        />
      ),
      title: "Phí áp dụng",
      dataIndex: "total_service_fee",
      key: "money",
      width: 100,
    },
  ];

  // let items = [
  //   {
  //     key: "1",
  //     label: checkElement?.includes("detail_guvi_job") && (
  //       <Link to={`/details-order/${item?.id_group_order}`}>
  //         <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
  //           lng: lang,
  //         })}`}</p>
  //       </Link>
  //     ),
  //   }
  // ]

  // items = items.filter(x => x.label !== false);

  // const addActionColumn = {
  //   i18n_title: '',
  //   dataIndex: 'action',
  //   key: "action",
  //   fixed: 'right',
  //   width: 40,
  //   render: () => (
  //     <Space size="middle">
  //       <Dropdown menu={{ items }} trigger={["click"]}>
  //         <a>
  //           <UilEllipsisV />
  //         </a>
  //       </Dropdown>
  //     </Space>
  //   )
  // };

  return (
    <React.Fragment>
      <div className="g">
        <div className="div-flex-row">
          <div className="div-header-container">
            <h4 className="title-cv">
              {typeDate === "date_work"
                ? "Báo cáo đơn hàng hoàn thành theo ngày làm"
                : "Báo cáo đơn hàng hoàn thành theo ngày tạo"}
            </h4>
          </div>
        </div>

        {/* <div className="div-flex-row-flex-start">
      <div>
        <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
              defaults={"thirty_last"}
            />
        </div>

      </div> */}

        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => {}}
              defaults={"thirty_last"}
            />
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ này: {moment(startDate).format("DD/MM/YYYY")}-
              {moment(endDate).format("DD/MM/YYYY")}
            </p>
          </div>
          <div className="div-same">
            <p className="m-0 text-date-same">
              Kỳ trước: {moment(sameStartDate).format("DD/MM/YYYY")}-
              {moment(sameEndDate).format("DD/MM/YYYY")}
            </p>
          </div>
        </div>

        <div className="div-flex-row">
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img" />
            <div class="div-details">
              <a class="text-title">Tổng giá trị giao dịch</a>
              <a class="text-detail">
                {formatMoney(dataTotal?.total_gross_income)}
              </a>
            </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img" />
            <div class="div-details">
              <a class="text-title">Tổng số đơn hàng</a>
              <a class="text-detail">{dataTotal?.total_item} ca</a>
            </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img" />
            <div class="div-details">
              <a class="text-title">Tổng doanh thu</a>
              <a class="text-detail">{formatMoney(dataTotal?.total_income)}</a>
            </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img" />
            <div class="div-details">
              <a class="text-title">Tổng lợi nhuận</a>
              <a class="text-detail">
                {formatMoney(dataTotal?.total_net_income_business)}
              </a>
            </div>
          </div>
        </div>

        <div className="div-flex-row-flex-start">
          <div className="block-content-100">
            <div className="header">
              <div className="text-header">
                <p>Lượng đơn hàng</p>
              </div>
              <HeaderInfoCharts
                total={headerChartsOrder.total}
                arrow={headerChartsOrder.arrow}
                percentSame={headerChartsOrder.percent}
              />
            </div>
            <div className="content">
              {dataChartsOrder?.length > 0 ? (
                <ResponsiveContainer height={350} width="99%">
                  <LineChart
                    data={dataChartsOrder}
                    margin={{ left: -10, top: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date_report"
                      angle={-20}
                      textAnchor="end"
                      tick={{ fontSize: 10 }}
                    />
                    <YAxis
                      tickFormatter={(tickItem) => number_processing(tickItem)}
                    />
                    <Tooltip content={renderTooltipContent} />
                    <Legend />
                    {configLineOrder.map((item, index) => (
                      <Line
                        type="monotone"
                        dataKey={item.dataKey}
                        stroke={item.stroke}
                        name={item.name}
                        strokeDasharray={item.strokeDasharray}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p>Không có dữ liệu</p>
              )}
            </div>
          </div>
        </div>

        <div className="div-flex-row-start">
          <DataTable
            columns={columns}
            data={data}
            // actionColumn={addActionColumn}
            start={startPage}
            pageSize={lengthPage}
            setLengthPage={setLengthPage}
            totalItem={total}
            // detectLoading={detectLoading}
            // getItemRow={setItem}
            onCurrentPageChange={setStart}
            scrollX = {1800}
          />
        </div>
      </div>
    </React.Fragment>
  );
};

export default ReportOrderDaily;
