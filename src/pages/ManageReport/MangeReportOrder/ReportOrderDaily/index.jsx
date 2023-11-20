// import { Pagination, Popover, Table } from "antd";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   Bar,
//   BarChart,
//   CartesianGrid,
//   Legend,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import {
//   getReportOrderDaily,
//   getReportPercentOrderDaily,
// } from "../../../../api/report";
// import CustomDatePicker from "../../../../components/customDatePicker";
// import { formatMoney } from "../../../../helper/formatMoney";
// import useWindowDimensions from "../../../../helper/useWindowDimensions";
// import i18n from "../../../../i18n";
// import { getLanguageState } from "../../../../redux/selectors/auth";
// import "./styles.scss";

// const ReportOrderDaily = () => {
//   const [data, setData] = useState([]);
//   const [dataChart, setDataChart] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [dataTotal, setDataTotal] = useState([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [startPage, setStartPage] = useState(0);
//   const [startDate, setStartDate] = useState(
//     moment().subtract(30, "d").startOf("date").toISOString()
//   );
//   const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
//   const { width } = useWindowDimensions();
//   const navigate = useNavigate();
//   const lang = useSelector(getLanguageState);

//   useEffect(() => {
//     getReportOrderDaily(
//       0,
//       40,
//       moment().subtract(30, "d").startOf("date").toISOString(),
//       moment().endOf("date").toISOString(),
//       "date_work"
//     )
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setDataTotal(res?.total[0]);
//       })
//       .catch((err) => {});

//     getReportPercentOrderDaily(
//       moment().subtract(30, "d").startOf("date").toISOString(),
//       moment().endOf("date").toISOString()
//     )
//       .then((res) => {
//         setDataChart(res?.data);
//       })
//       .catch((err) => {});
//   }, []);

//   const onChange = (page) => {
//     setCurrentPage(page);
//     const dataLength = data.length < 20 ? 20 : data.length;
//     const start = page * dataLength - dataLength;
//     setStartPage(start);
//     getReportOrderDaily(start, 40, startDate, endDate, "date_work")
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setDataTotal(res?.total[0]);
//       })
//       .catch((err) => {});
//   };

//   const onChangeDay = () => {
//     getReportOrderDaily(startPage, 40, startDate, endDate, "date_work")
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setDataTotal(res?.total[0]);
//       })
//       .catch((err) => {});

//     getReportPercentOrderDaily(startDate, endDate)
//       .then((res) => {
//         setDataChart(res?.data);
//       })
//       .catch((err) => {});
//   };

//   const columns = [
//     {
//       title: () => {
//         return (
//           <div className="div-title-collaborator-id">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("time", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <div className="div-top"></div>
//           </div>
//         );
//       },
//       render: (data) => (
//         <div
//           className="div-date-report-order"
//           onClick={() =>
//             navigate("/report/manage-report/report-order-daily/details", {
//               state: { date: data?._id },
//             })
//           }
//         >
//           <p className="text-date-report-order">{data?._id}</p>
//         </div>
//       ),
//     },
//     {
//       title: () => {
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("shift", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_item > 0 ? dataTotal?.total_item : 0}
//             </p>
//           </div>
//         );
//       },
//       render: (data) => {
//         return <p className="text-money">{data?.total_item}</p>;
//       },
//       align: "center",
//       sorter: (a, b) => a.total_item - b.total_item,
//     },
//     {
//       title: () => {
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("sales", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_gross_income > 0
//                 ? formatMoney(dataTotal?.total_gross_income)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">{formatMoney(data?.total_gross_income)}</p>
//         );
//       },

//       sorter: (a, b) => a.total_gross_income - b.total_gross_income,
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">{`${i18n.t(
//               "service_fee_pay_collaborator",
//               {
//                 lng: lang,
//               }
//             )}`}</p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("service_fee", {
//                 lng: lang,
//               })}`}</p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 200,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_collabotator_fee > 0
//                 ? formatMoney(dataTotal?.total_collabotator_fee)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">
//             {formatMoney(data?.total_collabotator_fee)}
//           </p>
//         );
//       },

//       sorter: (a, b) => a.total_collabotator_fee - b.total_collabotator_fee,
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">
//               {`${i18n.t("revenue_sales", { lng: lang })}`}
//             </p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column-blue">{`${i18n.t("revenue", {
//                 lng: lang,
//               })}`}</p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 300,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <p className="text-money-title-blue">
//               {dataTotal?.total_income > 0
//                 ? formatMoney(dataTotal?.total_income)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money-blue">{formatMoney(data?.total_income)}</p>
//         );
//       },

//       sorter: (a, b) => a.total_income - b.total_income,
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">{`${i18n.t("total_discount", {
//               lng: lang,
//             })}`}</p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("discount", {
//                 lng: lang,
//               })}`}</p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 200,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_discount > 0
//                 ? formatMoney(dataTotal?.total_discount)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">{formatMoney(data?.total_discount)}</p>
//         );
//       },

//       sorter: (p, b) => p.total_discount - b.total_discount,
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">
//               {`${i18n.t("note_net_revenue", { lng: lang })}`}
//             </p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("net_revenue", {
//                 lng: lang,
//               })}`}</p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 300,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_net_income > 0
//                 ? formatMoney(dataTotal?.total_net_income)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">{formatMoney(data?.total_net_income)}</p>
//         );
//       },

//       sorter: (a, b) => a.total_net_income - b.total_net_income,
//     },
//     {
//       title: () => {
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("fees_apply", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_service_fee > 0
//                 ? formatMoney(dataTotal?.total_service_fee)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       render: (data) => {
//         return (
//           <p className="text-money">{formatMoney(data?.total_service_fee)}</p>
//         );
//       },
//       align: "center",
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">
//               {`${i18n.t("note_total_bill", {
//                 lng: lang,
//               })}`}
//             </p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("total_bill", {
//                 lng: lang,
//               })}`}</p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 300,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_order_fee > 0
//                 ? formatMoney(dataTotal?.total_order_fee)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">{formatMoney(data?.total_order_fee)}</p>
//         );
//       },

//       sorter: (a, b) => a.total_order_fee - b.total_order_fee,
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">
//               {`${i18n.t("note_profit", { lng: lang })}`}
//             </p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("profit", {
//                 lng: lang,
//               })}`}</p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 300,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <p className="text-money-title">
//               {dataTotal?.total_net_income_business > 0
//                 ? formatMoney(dataTotal?.total_net_income_business)
//                 : formatMoney(0)}
//             </p>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">
//             {formatMoney(data?.total_net_income_business)}
//           </p>
//         );
//       },

//       sorter: (a, b) =>
//         a.total_net_income_business - b.total_net_income_business,
//     },
//     {
//       title: () => {
//         const content = (
//           <div className="div-content">
//             <p className="text-content">
//               %{" "}
//               {`${i18n.t("percent_profit", {
//                 lng: lang,
//               })}`}
//             </p>
//           </div>
//         );
//         return (
//           <div className="div-title-order-report">
//             <div className="div-title-report">
//               <p className="text-title-column">
//                 %{" "}
//                 {`${i18n.t("profit", {
//                   lng: lang,
//                 })}`}
//               </p>
//               <Popover
//                 content={content}
//                 placement="bottom"
//                 overlayInnerStyle={{
//                   backgroundColor: "white",
//                   width: 300,
//                 }}
//               >
//                 <div>
//                   <i class="uil uil-question-circle icon-question"></i>
//                 </div>
//               </Popover>
//             </div>
//             <div className="div-top"></div>
//           </div>
//         );
//       },
//       align: "center",
//       render: (data) => {
//         return (
//           <p className="text-money">
//             {data?.percent_income ? data?.percent_income + "%" : ""}
//           </p>
//         );
//       },
//     },
//   ];

//   return (
//     <div className="div-container-report-daily">
//       <h3>{`${i18n.t("completed_order_report_day", { lng: lang })}`}</h3>
//       <div className="div-date">
//         <CustomDatePicker
//           setStartDate={setStartDate}
//           setEndDate={setEndDate}
//           onClick={onChangeDay}
//           onCancel={() => {}}
//           setSameStart={() => {}}
//           setSameEnd={() => {}}
//         />
//         {startDate && (
//           <p className="text-date m-0">
//             {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
//             {moment(endDate).utc().format("DD/MM/YYYY")}
//           </p>
//         )}
//       </div>
//       <div className="div-chart-order-daily">
//         <ResponsiveContainer width={"100%"} height={350} min-width={350}>
//           <BarChart
//             width={500}
//             height={400}
//             data={dataChart}
//             margin={{
//               top: 5,
//               right: 0,
//               left: 0,
//               bottom: 5,
//             }}
//           >
//             <CartesianGrid strokeDasharray="3 3" />

//             <XAxis
//               dataKey="_id"
//               tick={{ fontSize: 8 }}
//               angle={-30}
//               textAnchor="end"
//             />

//             <YAxis />
//             <Tooltip />
//             <Legend />
//             <Bar
//               dataKey="total_item"
//               fill="#4376CC"
//               barSize={20}
//               minPointSize={10}
//               label={{ position: "centerTop", fill: "white", fontSize: 10 }}
//               name={`${i18n.t("number_shift", { lng: lang })}`}
//             />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>
//       <div className="mt-3">
//         <Table
//           dataSource={data.reverse()}
//           columns={columns}
//           pagination={false}
//           scroll={{
//             x: width <= 490 ? 1600 : 0,
//           }}
//         />
//       </div>

//       <div className="mt-2 div-pagination p-2">
//         <p>
//           {`${i18n.t("total", { lng: lang })}`}: {total}
//         </p>
//         <div>
//           <Pagination
//             current={currentPage}
//             onChange={onChange}
//             total={total}
//             showSizeChanger={false}
//             pageSize={40}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ReportOrderDaily;



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
  LineChart
} from "recharts";
import {
  getReportOrderDaily,
  getTotalReportOrderDaily,
} from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";
import { formatMoney } from "../../../../helper/formatMoney";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import DataTable from "../../../../components/tables/dataTable"
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
import { number_processing } from "../../../../helper/numberProcessing";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import "./styles.scss";

const ReportOrderDaily = () => {
  const headerDefault = {
    total: 0,
    arrow: "up",
    percent: 0,
  }
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState([]);
  const [dataTotal, setDataTotal] = useState({});

  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sameStartDate, setSameStartDate] = useState("")
  const [sameEndDate, setSameEndDate] = useState("")
  const [start, setStart] = useState(0)

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
      strokeDasharray: ""
    },
    {
      dataKey: "total_item_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]

  useEffect(() => {
    if (startDate !== "") {
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDay));
       getDataReportDaily(diffDays);
       getTotalReportDaily()
    }
  }, [sameStartDate])

  useEffect(() => {
    getDataReportDaily();
  }, [start])


  useEffect(() => {
    if (startDate !== "") {
    const timeStartDate = new Date(startDate).getTime();
    const timeEndDate = new Date(endDate).getTime();
    const rangeDate = timeEndDate - timeStartDate;
    const tempSameEndDate = timeStartDate - 1;
    const tempSameStartDate = tempSameEndDate - rangeDate;
    setSameStartDate(new Date(tempSameStartDate).toISOString())
    setSameEndDate(new Date(tempSameEndDate).toISOString())
    }
  }, [startDate])




  const getTotalReportDaily = async () => {
    const arrGetResult = await Promise.all([
      getTotalReportOrderDaily(startDate, endDate),
      getTotalReportOrderDaily(sameStartDate, sameEndDate)
    ])
    visualizationDataOrder(arrGetResult[0], arrGetResult[1])
  }



  const getDataReportDaily = async () => {
    const res = await getReportOrderDaily(start, 20, startDate, endDate, "date_work");
    setData(res.data);
    setTotal(res?.totalItem);
    setDataTotal(res?.total[0]);
    // const arrGetResult = await Promise.all([
      
    //   getReportOrderDaily(0, diffDays, sameStartDate, sameEndDate, "date_work")
    // ])
    // visualizationDataOrder(arrGetResult[0], arrGetResult[1])

    // const res = await getReportOrderDaily(start, 20, startDate, endDate, "date_work");
    // setData(res?.data);
    // setTotal(res?.totalItem);
    // setDataTotal(res?.total[0]);
  }

  const visualizationDataOrder = (data, dataInsame) => {
    const tempOrder = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_item: data.data[i].total_item,
        date_report: data.data[i]._id.slice(0, 5),
        total_item_same: dataInsame.data[i]?.total_item,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      tempOrder.push(payload)
    }
    setDataChartsOrder(tempOrder);
    const percentOrder = (data.totalOrder[0]?.total_item / (data.totalOrder[0]?.total_item + dataInsame.totalOrder[0]?.total_item)) * 100;
    const percentSameOrder = (dataInsame.totalOrder[0]?.total_item / (data.totalOrder[0]?.total_item + dataInsame.totalOrder[0]?.total_item)) * 100
    const headerTempOrder = {
      total: data.totalOrder[0]?.total_item + " Đơn hàng",
      arrow: (percentOrder - percentSameOrder > 0) ? "up" : "down",
      percent: Math.abs((percentOrder - percentSameOrder).toFixed(2))
    }
    setHeaderChartsOrder(headerTempOrder)
  }

  const renderTooltipContent = (data) => {
    const { payload } = data;
    return (
      <>
        {payload && payload.length > 0 ? (<>
          <div className="tool-tip">
            <div style={{ color: payload[0].color }}>
              <span>{payload[0].payload?.date_report}: </span>
              <span>{ payload[0].payload?.total_item ?`${payload[0].value} Đơn`  : formatMoney(payload[0].value)}</span>
            </div>
            <div style={{ color: payload[1].color }}>
              <span>{payload[1].payload?.date_report_same}: </span>
              <span>{ payload[1].payload?.total_item ?`${payload[1].value} Đơn`  : formatMoney(payload[1].value)}</span>
            </div>
          </div>
        </>) :
          (<></>)}
      </>
    )
  }


  const HeaderInfoCharts = ({ total, arrow, percentSame }) => {
    return (
      <React.Fragment>
        <div className="total-info">
          <div className="text-value">
          <p>{total}&nbsp;</p>
          </div>
          <div className="text-percent">
          {
            arrow === "up" ?
              (<CaretUpOutlined style={{ marginRight: 5 }} />) :
              (<CaretDownOutlined style={{ marginRight: 5 }} />)
          }
          <p>{percentSame}%</p>
          <span>&nbsp; so với cùng kỳ</span>
          </div>
        </div>
      </React.Fragment>
    )
  }


  const CustomHeaderDatatable = ({title, subValue, typeSubValue, textToolTip}) => {
    const content = (
        <p>
          {textToolTip ? textToolTip : ""}
        </p>
    );
    if(subValue) subValue = (typeSubValue === "money") ? formatMoney(subValue) : (typeSubValue === "percent") ? subValue + " %" : subValue;
    return (
      <React.Fragment>
        <div className="header-table-custom">
        <div className="title-report">
        <p style={{color: title === "Doanh thu" ? "#2463eb" : "none"}} >{title}</p>
        {textToolTip ? (
        <Popover
        content={content}
        placement="bottom"
        overlayInnerStyle={{
        backgroundColor: "white"
        }}
      >
        <div>
          <i style={{color: title === "Doanh thu" ? "#2463eb" : "none"}} class="uil uil-question-circle icon-question"></i>
        </div>
      </Popover>
        ) : (<></>)}
        </div>
        <div className="sub-value">
          {subValue ? (
           <p style={{color: title === "Doanh thu" ? "#2463eb" : "none"}} >{subValue}</p> 
          ) : (<div style={{marginTop: "35px"}}></div>)}
        </div>
        </div>

      </React.Fragment>
    )
  }

  const columns = [
    {
      customTitle: <CustomHeaderDatatable title="Ngày làm" />,
      dataIndex: '_id',
      key: "id_date_work",
      width: 100,
      fontSize: "text-size-M text-weight-500"
    },
    {
      customTitle: <CustomHeaderDatatable title="Số đơn hàng"
        subValue={dataTotal.total_item} />,
      dataIndex: 'total_item',
      key: "number",
      width: 50,
      fontSize: "text-size-M text-weight-500"

    },
    {
      customTitle: <CustomHeaderDatatable title="Tổng giá trị giao dịch"
        subValue={dataTotal.total_gross_income}
        typeSubValue="money"
        textToolTip="GMV - Gross Merchandise Volume" />,
      dataIndex: 'total_gross_income',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"

    },
    {
      customTitle: <CustomHeaderDatatable title="Thu hộ dịch vụ"
        subValue={dataTotal.total_collabotator_fee}
        typeSubValue="money"
        textToolTip="Bao gồm phí dịch vụ trả cho CTV, tiền tip từ khách,…" />,
      dataIndex: 'total_collabotator_fee',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"

    },
    {
      customTitle: <CustomHeaderDatatable title="Doanh thu"
        subValue={dataTotal.total_income}
        typeSubValue="money"
        textToolTip="" />,
      dataIndex: 'total_income',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-color-1 text-weight-500"

    },
    {
      customTitle: <CustomHeaderDatatable title="Giảm giá"
        subValue={dataTotal.total_discount}
        typeSubValue="money"
        textToolTip="Tổng số tiền giảm giá từ giảm giá dịch vụ, giảm giá đơn hàng, đồng giá, ctkm,…" />,
      dataIndex: 'total_discount',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"

    },

    {
      customTitle: <CustomHeaderDatatable title="Doanh thu thuần"
        subValue={dataTotal.total_net_income}
        typeSubValue="money"
        textToolTip="Số tiền thu được sau khi trừ toàn bộ các giảm giá. Doanh thu thuần = Doanh thu (-) Giảm giá." />,
      dataIndex: 'total_net_income',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"

    },
    {
      customTitle: <CustomHeaderDatatable title="Tổng hoá đơn"
        subValue={dataTotal.total_order_fee}
        typeSubValue="money"
        textToolTip="Tổng số tiền ghi nhận trên hoá đơn dịch vụ. Tổng hoá đơn = Tổng tiền - giảm giá." />,
      dataIndex: 'total_order_fee',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"
    },
    {
      customTitle: <CustomHeaderDatatable title="Giá vốn"
        subValue={dataTotal.punishss}
        typeSubValue="money" />,
      dataIndex: 'punishss',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"
    },
    {
      customTitle: <CustomHeaderDatatable title="Thu nhập khác"
        subValue={dataTotal.punish}
        typeSubValue="money"
        textToolTip="Bao gồm phí phạt trễ và huỷ ca" />,
      dataIndex: 'punish',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"
    },
    {
      customTitle: <CustomHeaderDatatable title="Tổng lợi nhuận"
        subValue={dataTotal.total_net_income_business}
        typeSubValue="money"
        textToolTip="Tổng lợi nhuận = Doanh thu thuần + thu nhập khác" />,
      dataIndex: 'total_net_income_business',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"
    },
    {
      customTitle: <CustomHeaderDatatable title="% Lợi nhuận"
        subValue={dataTotal.percent_income}
        typeSubValue="percent"
        textToolTip="% Lợi nhuận = Tổng lợi nhuận (/) Doanh thu." />,
      dataIndex: 'percent_income',
      key: "percent",
      width: 90,
      fontSize: "text-size-M text-weight-500"

    },
  ]




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
    <div className="div-container-content">
      <div className="div-flex-row">
        <div className="div-header-container">
          <h4 className="title-cv">Báo cáo đơn hàng hoàn thành theo ngày</h4>
        </div>

      </div>

      <div className="div-flex-row-flex-start">
      <div>
        <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
              defaults={"thirty_last"}
            />
        </div>

      </div>

      <div className="div-flex-row-flex-start">
          <div className="block-content-100">
            <div className="header">
              <div className="text-header">
                <p>Lượng đơn hàng</p>
              </div>
              <HeaderInfoCharts total={headerChartsOrder.total} arrow={headerChartsOrder.arrow} percentSame={headerChartsOrder.percent} />
            </div>
            <div className="content">
              {
                dataChartsOrder?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataChartsOrder}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineOrder.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
        </div>



      <div className="div-flex-row">


      </div>

      <div className="div-flex-row-start">

        <DataTable
          columns={columns}
          data={data}
          // actionColumn={addActionColumn}
          start={startPage}
          pageSize={20}
          totalItem={total}
          // detectLoading={detectLoading}
          // getItemRow={setItem}
          onCurrentPageChange={setStart}
        />
      </div>
    </div>

    </React.Fragment>


  )
}

export default ReportOrderDaily;