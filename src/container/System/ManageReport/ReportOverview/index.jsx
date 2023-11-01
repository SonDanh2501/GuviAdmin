// import moment from "moment";
// import { useEffect, useState } from "react";
// import {
//   CartesianGrid,
//   Legend,
//   Line,
//   LineChart,
//   ResponsiveContainer,
//   Tooltip,
//   XAxis,
//   YAxis,
// } from "recharts";
// import {
//   getReportOrderByCity,
//   getReportOrderDaily,
//   getReportServiceByArea,
// } from "../../../../api/report";
// import CustomDatePicker from "../../../../components/customDatePicker";

// import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import LoadingPagination from "../../../../components/paginationLoading";
// import { formatMoney } from "../../../../helper/formatMoney";
// import { number_processing } from "../../../../helper/numberProcessing";
// import { getLanguageState } from "../../../../redux/selectors/auth";
// import "./styles.scss";
// import { Image, Select } from "antd";

// const ReportOverview = () => {
//   const lang = useSelector(getLanguageState);
//   const [startDate, setStartDate] = useState(
//     moment().subtract(30, "days").startOf("days").toISOString()
//   );

//   const [endDate, setEndDate] = useState(
//     moment().subtract(1, "days").endOf("days").toISOString()
//   );
//   const [sameStartDate, setSameStartDate] = useState(
//     moment()
//     .subtract(60, "days")
//     .startOf("days")
//     .toISOString()
//   );
//   const [sameEndDate, setSameEndDate] = useState(
//     moment(
//     )
//       .subtract(31, "days")
//       .endOf("days")
//       .toISOString()
//   );

//   console.log(startDate, 'startDate');
//   console.log(endDate, 'endDate');
//   console.log(sameStartDate, 'sameStartDate');
//   console.log(sameEndDate, 'sameEndDate');
//   const totalDate = (new Date(endDate).getTime()  - new Date(startDate).getTime() + 1)/(24 * 60 * 60 * 1000)
//   const totalSameDate = (new Date(sameEndDate).getTime()  - new Date(sameStartDate).getTime() + 1)/(24 * 60 * 60 * 1000)

//   console.log(totalDate, 'totalDate');
//   console.log(totalSameDate, 'totalSameDate');


//   const [data, setData] = useState([]);
//   const [dataSame, setDataSame] = useState([]);
//   const [dataArea, setDataArea] = useState([]);
//   const [dataAreaSame, setDataAreSame] = useState([]);
//   const [dataService, setDataService] = useState([]);
//   const [dataServiceSame, setDataServiceSame] = useState([]);
//   const [typePriceService, setTypePriceService] = useState("income");
//   const [totalNetIncome, setTotalNetIncome] = useState(0);
//   const [totalNetIncomeSame, setTotalNetIncomeSame] = useState(0);
//   const [totalGrossIncome, setTotalGrossIncome] = useState(0);
//   const [totalGrossIncomeSame, setTotalGrossIncomeSame] = useState(0);
//   const [totalOrder, setTotalOrder] = useState(0);
//   const [totalOrderSame, setTotalOrderSame] = useState(0);
//   const [isLoading, setIsLoading] = useState(false);
//   const dataChartNetIncomeOrder = [];
//   const dataChartGrossIncomeOrder = [];
//   const dataChartTotalOrder = [];
//   const dataChartAreaOrder = [];
//   const dataChartSerive = [];
//   const navigate = useNavigate();


//   useEffect(() => {
//     getReportOrderDaily(0, 90, startDate, endDate, "date_work")
//       .then((res) => {
//         setData(res?.data);
//         setTotalNetIncome(res?.total[0]?.total_net_income);
//         setTotalOrder(res?.total[0]?.total_item);
//         setTotalGrossIncome(res?.total[0]?.total_gross_income);
//       })
//       .catch((err) => {});

//     getReportOrderDaily(0, 90, sameStartDate, sameEndDate, "date_work")
//       .then((res) => {
//         setDataSame(res?.data);
//         setTotalNetIncomeSame(res?.total[0]?.total_net_income);
//         setTotalOrderSame(res?.total[0]?.total_item);
//         setTotalGrossIncomeSame(res?.total[0]?.total_gross_income);
//       })
//       .catch((err) => {});

//     getReportOrderByCity(0, 90, startDate, endDate, 0)
//       .then((res) => {
//         setDataArea(res?.data);
//       })
//       .catch((err) => {});

//     getReportOrderByCity(0, 90, sameStartDate, sameEndDate, 0)
//       .then((res) => {
//         setDataAreSame(res?.data);
//       })
//       .catch((err) => {});

//     getReportServiceByArea(startDate, endDate, "")
//       .then((res) => {
//         setDataService(res?.data);
//       })
//       .catch((err) => {});
//     getReportServiceByArea(sameStartDate, sameEndDate, "")
//       .then((res) => {
//         setDataServiceSame(res?.data);
//       })
//       .catch((err) => {});
//   }, []);

//   const onChangeDay = () => {
//     setIsLoading(true);
//     getReportOrderDaily(0, 90, startDate, endDate, "date_work")
//       .then((res) => {
//         setData(res?.data);
//         setIsLoading(false);
//         setTotalNetIncome(res?.total[0]?.total_net_income);
//         setTotalOrder(res?.total[0]?.total_item);
//         setTotalGrossIncome(res?.total[0]?.total_gross_income);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//       });

//     getReportOrderDaily(0, 90, sameStartDate, sameEndDate, "date_work")
//       .then((res) => {
//         setDataSame(res?.data);
//         setIsLoading(false);
//         setTotalNetIncomeSame(res?.total[0]?.total_net_income);
//         setTotalOrderSame(res?.total[0]?.total_item);
//         setTotalGrossIncomeSame(res?.total[0]?.total_gross_income);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//       });
//     getReportOrderByCity(0, 90, startDate, endDate, 0)
//       .then((res) => {
//         setDataArea(res?.data);
//       })
//       .catch((err) => {});

//     getReportOrderByCity(0, 90, sameStartDate, sameEndDate, 0)
//       .then((res) => {
//         setDataAreSame(res?.data);
//       })
//       .catch((err) => {});

//     getReportServiceByArea(startDate, endDate, "")
//       .then((res) => {
//         setDataService(res?.data);
//       })
//       .catch((err) => {});
//     getReportServiceByArea(sameStartDate, sameEndDate, "")
//       .then((res) => {
//         setDataServiceSame(res?.data);
//       })
//       .catch((err) => {});
//   };

//   const percentSame = (a, b) => {
//     return ((a - b) / b) * 100;
//   };

//   for (let i = 0; i < data.length; i++) {
//     dataChartNetIncomeOrder.push({
//       date: data[i]?._id?.slice(0, 5),
//       date_same: dataSame[i]?._id?.slice(0, 5),
//       net_income: data[i]?.total_net_income,
//       net_income_same: dataSame[i]?.total_net_income,
//     });

//     dataChartGrossIncomeOrder.push({
//       date: data[i]?._id?.slice(0, 5),
//       date_same: dataSame[i]?._id?.slice(0, 5),
//       gross_income: data[i]?.total_gross_income,
//       gross_income_same: dataSame[i]?.total_gross_income,
//     });

//     dataChartTotalOrder.push({
//       date: data[i]?._id?.slice(0, 5),
//       date_same: dataSame[i]?._id?.slice(0, 5),
//       total: data[i]?.total_item,
//       total_same: dataSame[i]?.total_item,
//     });
//   }

//   if (dataArea.length === dataAreaSame.length) {
//     for (const element of dataArea) {
//       for (const element2 of dataAreaSame) {
//         if (element2?._id === element?._id) {
//           dataChartAreaOrder.push({
//             city: element?.city,
//             total_item: element?.total_item,
//             net_income: element?.total_net_income,
//             percent_net_income: percentSame(
//               element?.total_net_income,
//               element2?.total_net_income
//             ),
//           });
//         }
//       }
//     }
//   } else {
//     const objectsAreEqual = (obj1, obj2) => {
//       return obj1?._id === obj2?._id;
//     };

//     const filteredArray = dataArea.filter((obj1) => {
//       const objInArray2 = dataAreaSame.some((obj2) =>
//         objectsAreEqual(obj1, obj2)
//       );
//       return !objInArray2;
//     });

//     filteredArray?.map((item) => {
//       return dataChartAreaOrder.push({
//         city: item?.city,
//         total_item: item?.total_item,
//         net_income: item?.total_net_income,
//         percent_net_income: 100,
//       });
//     });

//     for (const element of dataArea) {
//       for (const element2 of dataAreaSame) {
//         if (element2?._id === element?._id) {
//           dataChartAreaOrder.push({
//             city: element?.city,
//             total_item: element?.total_item,
//             net_income: element?.total_net_income,
//             percent_net_income: percentSame(
//               element?.total_net_income,
//               element2?.total_net_income
//             ),
//           });
//         }
//       }
//     }
//   }

//   if (dataService.length === dataServiceSame.length) {
//     for (const element of dataService) {
//       for (const element2 of dataServiceSame) {
//         if (element2?._id === element?._id) {
//           dataChartSerive.push({
//             name: element?.title,
//             income: element?.total_income,
//             percent_income:
//               ((element?.total_income - element2?.total_income) /
//                 element2?.total_income) *
//               100,
//             net_income: element?.total_net_income,
//             percent_net_income:
//               ((element?.total_net_income - element2?.total_net_income) /
//                 element2?.total_net_income) *
//               100,
//             thumbnail: element?.thumbnail,
//           });
//         }
//       }
//     }
//   } else {
//     const objectsAreEqual = (obj1, obj2) => {
//       return obj1?._id === obj2?._id;
//     };

//     const filteredArray = dataService.filter((obj1) => {
//       const objInArray2 = dataServiceSame.filter((obj2) =>
//         objectsAreEqual(obj1, obj2)
//       );
//       return !objInArray2;
//     });
//     filteredArray?.map((item) => {
//       return dataChartSerive.push({
//         name: item?.title,
//         income: item?.total_income,
//         percent_income: 100,
//         net_income: item?.total_net_income,
//         percent_net_income: 100,
//         thumbnail: item?.thumbnail,
//       });
//     });

//     for (const element of dataService) {
//       for (const element2 of dataServiceSame) {
//         if (element2?._id === element?._id) {
//           dataChartSerive.push({
//             name: element?.title,
//             income: element?.total_income,
//             percent_income:
//               ((element?.total_income - element2?.total_income) /
//                 element2?.total_income) *
//               100,
//             net_income: element?.total_net_income,
//             percent_net_income:
//               ((element?.total_net_income - element2?.total_net_income) /
//                 element2?.total_net_income) *
//               100,
//             thumbnail: element?.thumbnail,
//           });
//         }
//       }
//     }
//   }

//   const renderTooltipContent = (o) => {
//     const { payload } = o;
//     return (
//       <div className="div-content-chart-net-income">
//         {payload[0]?.payload?.date && (
//           <p className="text-content">
//             {payload[0]?.payload?.date}:{" "}
//             {formatMoney(payload[0]?.payload?.gross_income)}
//           </p>
//         )}

//         {payload[0]?.payload?.date_same && (
//           <p className="text-content-same">
//             {payload[0]?.payload?.date_same}:{" "}
//             {formatMoney(payload[0]?.payload?.gross_income_same)}
//           </p>
//         )}
//       </div>
//     );
//   };
//   const renderTooltipContentTotal = (o) => {
//     const { payload } = o;
//     return (
//       <div className="div-content-chart-net-income">
//         {payload[0]?.payload?.date && (
//           <p className="text-content">
//             {payload[0]?.payload?.date}: {payload[0]?.payload?.total} đơn
//           </p>
//         )}

//         {payload[0]?.payload?.date_same && (
//           <p className="text-content-same">
//             {payload[0]?.payload?.date_same}: {payload[0]?.payload?.total_same}{" "}
//             đơn
//           </p>
//         )}
//       </div>
//     );
//   };
//   const renderTooltipContentNetIncome = (o) => {
//     const { payload } = o;







//     return (
//       <div className="div-content-chart-net-income">
//         {payload[0]?.payload?.date && (
//           <p className="text-content">
//             {payload[0]?.payload?.date}:{" "}
//             {formatMoney(payload[0]?.payload?.net_income)}
//           </p>
//         )}

//         {payload[0]?.payload?.date_same && (
//           <p className="text-content-same">
//             {payload[0]?.payload?.date_same}:{" "}
//             {formatMoney(payload[0]?.payload?.net_income_same)}
//           </p>
//         )}
//       </div>
//     );
//   };

//   const netIncomePercent =
//     ((totalNetIncome - totalNetIncomeSame) / totalNetIncomeSame) * 100;
//   const totalOrderPercent =
//     ((totalOrder - totalOrderSame) / totalOrderSame) * 100;
//   const grossIncomePercent =
//     ((totalGrossIncome - totalGrossIncomeSame) / totalGrossIncomeSame) * 100;

//   return (
//     <div className="mt-2">
//       <div className="div-date-report-overview">
//         <CustomDatePicker
//           setStartDate={setStartDate}
//           setEndDate={setEndDate}
//           setSameStart={setSameStartDate}
//           setSameEnd={setSameEndDate}
//           onClick={onChangeDay}
//           onCancel={() => {}}
//           defaults={true}
//         />
//         <div className="div-same">
//           <p className="m-0 text-date-same">
//             Kỳ này: {moment(startDate).format("DD/MM/YYYY")}-
//             {moment(endDate).utc().format("DD/MM/YYYY")}
//           </p>
//         </div>
//         <div className="div-same">
//           <p className="m-0 text-date-same">
//             Kỳ trước: {moment(sameStartDate).format("DD/MM/YYYY")}-
//             {moment(sameEndDate).utc().format("DD/MM/YYYY")}
//           </p>
//         </div>
//       </div>

//       <div className="div-chart-firt-overview">
//         {dataChartGrossIncomeOrder.length > 0 && (
//           <div className="div-chart-gross-income">
//             <p className="title-gross">Doanh số</p>

//             <div className="div-total-gross">
//               <p className="text-total-gross">
//                 {formatMoney(!totalGrossIncome ? 0 : totalGrossIncome)}
//               </p>
//               {grossIncomePercent < 0 ? (
//                 <p className="text-number-persent-down">
//                   <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                   {Math.abs(
//                     isNaN(grossIncomePercent) ? 0 : grossIncomePercent
//                   ).toFixed(2)}
//                   %
//                 </p>
//               ) : (
//                 <p className="text-number-persent-up">
//                   <CaretUpOutlined style={{ marginRight: 5 }} />
//                   {Number(
//                     isNaN(grossIncomePercent) ? 0 : grossIncomePercent
//                   ).toFixed(2)}
//                   %
//                 </p>
//               )}
//               <p className="text-same">so với cùng kỳ</p>
//             </div>
//             <ResponsiveContainer height={350} width="100%">
//               <LineChart
//                 width={500}
//                 height={300}
//                 data={dataChartGrossIncomeOrder}
//                 margin={{
//                   top: 5,
//                   right: 5,
//                   left: 5,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="date"
//                   angle={-20}
//                   textAnchor="end"
//                   tick={{ fontSize: 10 }}
//                 />
//                 <YAxis
//                   tickFormatter={(tickItem) => number_processing(tickItem)}
//                 />
//                 <Tooltip
//                   content={
//                     dataChartGrossIncomeOrder?.length > 0
//                       ? renderTooltipContent
//                       : ""
//                   }
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="gross_income"
//                   stroke="#2962ff"
//                   name="Hiện tại"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="gross_income_same"
//                   stroke="#82ca9d"
//                   strokeDasharray="3 4 5 2"
//                   name="Cùng kỳ"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//         {dataChartTotalOrder.length > 0 && (
//           <div className="div-chart-gross-income">
//             <p className="title-gross">Lượng đơn hàng</p>
//             <div className="div-total-gross">
//               <p className="text-total-gross">{!totalOrder ? 0 : totalOrder}</p>
//               {totalOrderPercent < 0 ? (
//                 <p className="text-number-persent-down">
//                   <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                   {Math.abs(
//                     isNaN(totalOrderPercent) ? 0 : totalOrderPercent
//                   ).toFixed(2)}
//                   %
//                 </p>
//               ) : (
//                 <p className="text-number-persent-up">
//                   <CaretUpOutlined style={{ marginRight: 5 }} />
//                   {Number(
//                     isNaN(totalOrderPercent) ? 0 : totalOrderPercent
//                   ).toFixed(2)}
//                   %
//                 </p>
//               )}
//               <p className="text-same">so với cùng kỳ</p>
//             </div>
//             <ResponsiveContainer height={350} width="100%">
//               <LineChart
//                 width={500}
//                 height={300}
//                 data={dataChartTotalOrder}
//                 margin={{
//                   top: 5,
//                   right: 5,
//                   left: 5,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="date"
//                   angle={-20}
//                   textAnchor="end"
//                   tick={{ fontSize: 10 }}
//                 />
//                 <YAxis
//                   tickFormatter={(tickItem) => number_processing(tickItem)}
//                 />
//                 <Tooltip
//                   content={
//                     dataChartTotalOrder?.length > 0
//                       ? renderTooltipContentTotal
//                       : ""
//                   }
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="total"
//                   stroke="#2962ff"
//                   name="Hiện tại"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="total_same"
//                   stroke="#82ca9d"
//                   strokeDasharray="3 4 5 2"
//                   name="Cùng kỳ"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//       </div>
//       <div className="div-chart-firt-overview mt-3">
//         {dataChartNetIncomeOrder.length > 0 && (
//           <div className="div-chart-gross-income">
//             <p className="title-gross">Doanh thu thuần</p>
//             <div className="div-total-gross">
//               <p className="text-total-gross">
//                 {formatMoney(!totalNetIncome ? 0 : totalNetIncome)}
//               </p>
//               {netIncomePercent < 0 ? (
//                 <p className="text-number-persent-down">
//                   <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                   {Math.abs(
//                     isNaN(netIncomePercent) ? 0 : netIncomePercent
//                   ).toFixed(2)}
//                   %
//                 </p>
//               ) : (
//                 <p className="text-number-persent-up">
//                   <CaretUpOutlined style={{ marginRight: 5 }} />
//                   {Number(
//                     isNaN(netIncomePercent) ? 0 : netIncomePercent
//                   ).toFixed(2)}
//                   %
//                 </p>
//               )}
//               <p className="text-same">so với cùng kỳ</p>
//             </div>
//             <ResponsiveContainer height={350} width="100%">
//               <LineChart
//                 width={500}
//                 height={300}
//                 data={dataChartNetIncomeOrder}
//                 margin={{
//                   top: 5,
//                   right: 5,
//                   left: 5,
//                   bottom: 5,
//                 }}
//               >
//                 <CartesianGrid strokeDasharray="3 3" />
//                 <XAxis
//                   dataKey="date"
//                   angle={-20}
//                   textAnchor="end"
//                   tick={{ fontSize: 10 }}
//                 />
//                 <YAxis
//                   tickFormatter={(tickItem) => number_processing(tickItem)}
//                 />
//                 <Tooltip
//                   content={
//                     dataChartNetIncomeOrder?.length > 0
//                       ? renderTooltipContentNetIncome
//                       : ""
//                   }
//                 />
//                 <Legend />
//                 <Line
//                   type="monotone"
//                   dataKey="net_income"
//                   stroke="#2962ff"
//                   name="Hiện tại"
//                 />
//                 <Line
//                   type="monotone"
//                   dataKey="net_income_same"
//                   stroke="#82ca9d"
//                   strokeDasharray="3 4 5 2"
//                   name="Cùng kỳ"
//                 />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         )}
//         {dataChartAreaOrder.length > 0 && (
//           <div className="div-chart-gross-income-area">
//             <div className="div-head-chart">
//               <p className="title-gross">Doanh thu thuần - Theo khu vực</p>
//               <div
//                 className="div-see-all"
//                 onClick={() =>
//                   navigate("/report/manage-report/report-order-area")
//                 }
//               >
//                 <p className="text-all">Tất cả</p>
//                 <i className="uil uil-create-dashboard ml-2"></i>
//               </div>
//             </div>
//             <div className="div-list-chart">
//               {dataChartAreaOrder?.slice(0, 5)?.map((item, index) => {
//                 return (
//                   <div key={index} className="div-item-chart">
//                     <div className="div-name-area">
//                       <p className="name-area">{item?.city}</p>
//                       <p className="m-0">{item?.total_item} đơn</p>
//                     </div>
//                     <div className="div-number-area">
//                       <p className="money-area">
//                         {formatMoney(item?.net_income)}
//                       </p>

//                       {item?.percent_net_income < 0 ? (
//                         <p className="text-number-persent-down">
//                           <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                           {Math.abs(
//                             isNaN(item?.percent_net_income)
//                               ? 0
//                               : item?.percent_net_income
//                           ).toFixed(2)}
//                           %
//                         </p>
//                       ) : (
//                         <p className="text-number-persent-up">
//                           <CaretUpOutlined style={{ marginRight: 5 }} />
//                           {Number(
//                             isNaN(item?.percent_net_income)
//                               ? 0
//                               : item?.percent_net_income
//                           ).toFixed(2)}
//                           %
//                         </p>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//       <div className="div-chart-firt-overview mt-3">
//         {dataChartSerive.length > 0 && (
//           <div className="div-chart-gross-income-area">
//             <div className="div-head-chart">
//               <p className="title-gross">Top dịch vụ</p>
//               <div>
//                 <Select
//                   value={typePriceService}
//                   style={{ width: 150 }}
//                   bordered={false}
//                   onChange={(e) => setTypePriceService(e)}
//                   options={[
//                     { value: "income", label: "Doanh thu" },
//                     { value: "net_income", label: "Doanh thu thuần" },
//                   ]}
//                 />
//               </div>
//             </div>
//             <div className="div-list-chart">
//               {dataChartSerive.slice(0, 5)?.map((item, index) => {
//                 return (
//                   <div key={index} className="div-item-chart">
//                     <div className="div-name-service">
//                       <Image
//                         preview={false}
//                         className="image-service"
//                         src={item?.thumbnail}
//                       />
//                       <p className="name-service">{item?.name[lang]}</p>
//                     </div>
//                     <div className="div-number-area">
//                       <p className="money-area">
//                         {typePriceService === "income"
//                           ? formatMoney(item?.income)
//                           : formatMoney(item?.net_income)}
//                       </p>
//                       {typePriceService === "income" ? (
//                         <>
//                           {item?.percent_income < 0 ? (
//                             <p className="text-number-persent-down">
//                               <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                               {Math.abs(
//                                 isNaN(item?.percent_income)
//                                   ? 0
//                                   : item?.percent_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           ) : (
//                             <p className="text-number-persent-up">
//                               <CaretUpOutlined style={{ marginRight: 5 }} />
//                               {Number(
//                                 isNaN(item?.percent_income)
//                                   ? 0
//                                   : item?.percent_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           )}
//                         </>
//                       ) : (
//                         <>
//                           {item?.percent_net_income < 0 ? (
//                             <p className="text-number-persent-down">
//                               <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                               {Math.abs(
//                                 isNaN(item?.percent_net_income)
//                                   ? 0
//                                   : item?.percent_net_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           ) : (
//                             <p className="text-number-persent-up">
//                               <CaretUpOutlined style={{ marginRight: 5 }} />
//                               {Number(
//                                 isNaN(item?.percent_net_income)
//                                   ? 0
//                                   : item?.percent_net_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}
//       </div>

//       {isLoading && <LoadingPagination />}
//     </div>
//   );
// };

// export default ReportOverview;

//Today 31/08/2023 Le Minh Dang!!!!!!




import moment from "moment";
import React, { useEffect, useState, memo } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  getReportOrderByCity,
  getReportOrderDaily,
  getReportServiceByArea,
} from "../../../../api/report";
import CustomDatePicker from "../../../../components/customDatePicker";
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";


import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingPagination from "../../../../components/paginationLoading";
import { formatMoney } from "../../../../helper/formatMoney";
import { number_processing } from "../../../../helper/numberProcessing";
import { getLanguageState } from "../../../../redux/selectors/auth";
import "./styles.scss";
import { Image, Select } from "antd";


const ReportOverview = () => {
  const lang = useSelector(getLanguageState);
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [sameStartDate, setSameStartDate] = useState("")
  const [sameEndDate, setSameEndDate] = useState("")
  const headerDefault = {
    total: 0,
    arrow: "up",
    percent: 0,
  }
  const configSelectTopService = [
    { value: "total_income", label: "Doanh thu" },
    { value: "total_net_income", label: "Doanh thu thuần" },
  ]
  const [dataIncome, setDataIncome] = useState([]);
  const [headerIncome, setHeaderIncome] = useState(headerDefault);
  const [dataOrder, setDataOrder] = useState([]);
  const [headerOrder, setHeaderOrder] = useState(headerDefault);
  const [dataNetIncome, setDataNetIncome] = useState([]);
  const [headerNetIncome, setHeaderNetIncome] = useState(headerDefault);
  const [dataProfit, setDataProfit] = useState([]);
  const [headerProfit, setHeaderProfit] = useState(headerDefault);
  const [dataNetIncomeByArea, setDataNetIncomeByArea] = useState([]);
  const [dataChartAreaOrder, setDataChartAreaOrder] = useState([]);
  const [dataTopService, setDataTopService] = useState([]);
  const [typePriceService, setTypePriceService] = useState(configSelectTopService[0].value);

  const configLineIncome = [
    {
      dataKey: "total_income",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_income_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]
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
  const configLineNetIncome = [
    {
      dataKey: "total_net_income",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_net_income_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]
  const configLineProfit = [
    {
      dataKey: "total_profit",
      stroke: "#2962ff",
      name: "Hiện tại",
      strokeDasharray: ""
    },
    {
      dataKey: "total_profit_same",
      stroke: "#82ca9d",
      name: "Cùng kỳ",
      strokeDasharray: "3 4 5 2"
    }
  ]



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


  useEffect(() => {
    if (sameStartDate !== "") {
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDay));
      getDataReportDaily(diffDays);
      getDataReportOrderByCity();
      getDataReportServiceByArea();
    }
  }, [sameStartDate]);

  useEffect(() => {
    const payload = []
    for(const item of dataTopService) {
      item.percent_view = item[`percent_${typePriceService}`]
      item.value_view = item[typePriceService]
      payload.push(item)
    }
    setDataTopService(payload);
  }, [typePriceService]);


  const getDataReportDaily = async (diffDays) => {
    const arrGetResult = await Promise.all([
      getReportOrderDaily(0, diffDays, startDate, endDate, "date_work"),
      getReportOrderDaily(0, diffDays, sameStartDate, sameEndDate, "date_work")
    ])
    visualizationDataIncome(arrGetResult[0], arrGetResult[1])
    visualizationDataOrder(arrGetResult[0], arrGetResult[1])
    visualizationDataNetIncome(arrGetResult[0], arrGetResult[1])
    visualizationDataProfit(arrGetResult[0], arrGetResult[1])
  }


  const visualizationDataIncome = (data, dataInsame) => {
    const tempIncome = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_income: data.data[i].total_income,
        date_report: data.data[i]._id.slice(0, 5),
        total_income_same: dataInsame.data[i]?.total_income,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      tempIncome.push(payload)
    }

    console.log(tempIncome, 'tempIncome');
    setDataIncome(tempIncome);

    const percent = (data.total[0]?.percent_income - dataInsame.total[0]?.percent_income).toFixed(2)
    const headerTempIncome = {
      total: formatMoney(data.total[0]?.total_gross_income),
      arrow: (percent > 0) ? "up" : "down",
      percent: Math.abs(percent)
    }
    setHeaderIncome(headerTempIncome)
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
    setDataOrder(tempOrder);
    const percentOrder = (data.total[0]?.total_item / (data.total[0]?.total_item + dataInsame.total[0]?.total_item)) * 100;
    const percentSameOrder = (dataInsame.total[0]?.total_item / (data.total[0]?.total_item + dataInsame.total[0]?.total_item)) * 100
    const headerTempOrder = {
      total: data.total[0]?.total_item + " Đơn hàng",
      arrow: (percentOrder - percentSameOrder > 0) ? "up" : "down",
      percent: Math.abs((percentOrder - percentSameOrder).toFixed(2))
    }
    setHeaderOrder(headerTempOrder)
  }

  const visualizationDataNetIncome = (data, dataInsame) => {
    const temp = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_net_income: data.data[i].total_net_income,
        date_report: data.data[i]._id.slice(0, 5),
        total_net_income_same: dataInsame.data[i]?.total_net_income,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      temp.push(payload)
    }
    setDataNetIncome(temp);
    const percent = (data.total[0]?.total_net_income / (data.total[0]?.total_net_income + dataInsame.total[0]?.total_net_income)) * 100;
    const percentSame = (dataInsame.total[0]?.total_net_income / (data.total[0]?.total_net_income + dataInsame.total[0]?.total_net_income)) * 100
    const headerTemp = {
      total: formatMoney(data.total[0]?.total_net_income),
      arrow: (percent - percentSame > 0) ? "up" : "down",
      percent: Math.abs((percent - percentSame).toFixed(2))
    }
    setHeaderNetIncome(headerTemp)
  }

  const visualizationDataProfit = (data, dataInsame) => {
    const temp = []
    for (let i = 0; i < data.data.length; i++) {
      const payload = {
        total_profit: data.data[i].total_net_income_business,
        date_report: data.data[i]._id.slice(0, 5),
        total_profit_same: dataInsame.data[i]?.total_net_income_business,
        date_report_same: dataInsame.data[i]?._id.slice(0, 5)
      }
      temp.push(payload)
    }
    setDataProfit(temp);
    const percent = (data.total[0]?.total_net_income_business / (data.total[0]?.total_net_income_business + dataInsame.total[0]?.total_net_income_business)) * 100;
    const percentSame = (dataInsame.total[0]?.total_net_income_business / (data.total[0]?.total_net_income_business + dataInsame.total[0]?.total_net_income_business)) * 100
    const headerTemp = {
      total: formatMoney(data.total[0]?.total_net_income_business),
      arrow: (percent - percentSame > 0) ? "up" : "down",
      percent: Math.abs((percent - percentSame).toFixed(2))
    }
    setHeaderProfit(headerTemp)
  }

  
  const getDataReportOrderByCity = async () => {
    const arrGetResult = await Promise.all([
      getReportOrderByCity(0, 90, startDate, endDate, 0),
      getReportOrderByCity(0, 90, sameStartDate, sameEndDate, 0)
    ])
    const payload = [];
    for(let i = 0 ; i < arrGetResult[0].totalItem ; i ++) {
      const percentNetIncome = (arrGetResult[0].data[i]?.total_net_income / (arrGetResult[0].data[i]?.total_net_income + arrGetResult[1].data[i]?.total_net_income)) * 100
      const percentNetIncomeSame = (arrGetResult[1].data[i]?.total_net_income / (arrGetResult[0].data[i]?.total_net_income + arrGetResult[1].data[i]?.total_net_income)) * 100
      const percent = (percentNetIncome - percentNetIncomeSame).toFixed(2)

      payload.push({
        city: arrGetResult[0].data[i]?.city,
        total_item: arrGetResult[0].data[i]?.total_item,
        total_net_income: arrGetResult[0].data[i]?.total_net_income,
        percent_net_income: percent
      })
    }
    setDataChartAreaOrder(payload);
  }

  const getDataReportServiceByArea = async () => {
    const arrGetResult = await Promise.all([
      getReportServiceByArea(startDate, endDate, ""),
      getReportServiceByArea(sameStartDate, sameEndDate, "")
    ])

    const payload = [];
    for(let i = 0 ; i < arrGetResult[0].data.length ; i ++) {

      const percentIncome = arrGetResult[0].data[i].total_income / (arrGetResult[0].data[i].total_income + arrGetResult[1].data[i].total_income) * 100
      const percentIncomeSame = arrGetResult[1].data[i].total_income / (arrGetResult[0].data[i].total_income + arrGetResult[1].data[i].total_income) * 100
      const levelPercentIncome = (percentIncome - percentIncomeSame).toFixed(2)

      const percentNetIncome = arrGetResult[0].data[i].total_net_income / (arrGetResult[0].data[i].total_net_income + arrGetResult[1].data[i].total_net_income) * 100
      const percentNetIncomeSame = arrGetResult[1].data[i].total_net_income / (arrGetResult[0].data[i].total_net_income + arrGetResult[1].data[i].total_net_income) * 100
      const levelPercentNetIncome = (percentNetIncome - percentNetIncomeSame).toFixed(2) 

      const percentView = (typePriceService === configSelectTopService[0].value) ? levelPercentIncome : levelPercentNetIncome;
      payload.push({
        title: arrGetResult[0].data[i].title,
        thumbnail: arrGetResult[0].data[i].thumbnail,
        total_net_income: arrGetResult[0].data[i].total_net_income,
        total_net_income_same: arrGetResult[1].data[i].total_net_income,
        total_income: arrGetResult[0].data[i].total_income,
        total_income_same: arrGetResult[1].data[i].total_income,
        total_order: arrGetResult[0].data[i].total_order,
        total_order_same: arrGetResult[1].data[i].total_order,
        percent_total_income: isNaN(levelPercentIncome) ? 0 : levelPercentIncome,
        percent_total_net_income: isNaN(levelPercentNetIncome) ? 0 : levelPercentNetIncome,
        percent_view: (isNaN(percentView)) ? 0 : percentView,
        value_view: (typePriceService === configSelectTopService[0].value) ? arrGetResult[0].data[i].total_income : arrGetResult[0].data[i].total_net_income,
      })
    }
    setDataTopService(payload);
  }

  const HeaderInfo = ({ total, arrow, percentSame }) => {
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

  return (
    <React.Fragment>
      <div className="report-overview">
        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
              defaults={"last_thirty"}
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

        <div className="div-flex-row-flex-start">
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Doanh số</p>
              </div>
              <HeaderInfo total={headerIncome.total} arrow={headerIncome.arrow} percentSame={headerIncome.percent} />
            </div>
            <div className="content">
              {
                dataIncome?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataIncome}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}/>
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip
                        content={renderTooltipContent}
                      />
                      <Legend />
                      {configLineIncome.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Lượng đơn hàng</p>
              </div>
              <HeaderInfo total={headerOrder.total} arrow={headerOrder.arrow} percentSame={headerOrder.percent} />
            </div>
            <div className="content">
              {
                dataOrder?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataOrder}
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

        <div className="div-flex-row-flex-start">
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Doanh thu thuần</p>
              </div>
              <HeaderInfo total={headerNetIncome.total} arrow={headerNetIncome.arrow} percentSame={headerNetIncome.percent} />
            </div>
            <div className="content">
              {
                dataNetIncome?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataNetIncome}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineNetIncome.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Lợi nhuận</p>
              </div>
              <HeaderInfo total={headerProfit.total} arrow={headerProfit.arrow} percentSame={headerProfit.percent} />
            </div>
            <div className="content">
              {
                dataProfit?.length > 0 ? (
                  <ResponsiveContainer height={350} width="99%">
                    <LineChart data={dataProfit}
                    margin={{ left: -10, top: 10}}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date_report" angle={-20} textAnchor="end" tick={{ fontSize: 10 }}  />
                      <YAxis tickFormatter={(tickItem) => number_processing(tickItem)} />
                      <Tooltip content={renderTooltipContent}/>
                      <Legend />
                      {configLineProfit.map((item, index) => (
                        <Line type="monotone" dataKey={item.dataKey} stroke={item.stroke} name={item.name} strokeDasharray={item.strokeDasharray} />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                ) : (<p>Không có dữ liệu</p>)
              }
            </div>
          </div>
        </div>


        <div className="div-flex-row-flex-start">
          <div className="block-content">
            <div className="header">
              <div className="text-header">
                <p>Doanh thu thuần - theo khu vực</p>
              </div>
            </div>
            <div className="content">
            {dataChartAreaOrder?.slice(0, 5)?.map((item, index) => {
              return (
                <div key={index} className="div-item-chart">
                  <div className="div-name-area">
                    <p className="name-area">{item?.city}</p>
                    <p className="m-0">{item?.total_item} đơn</p>
                  </div>
                  <div className="div-number-area">
                    <p className="money-area">
                      {formatMoney(item?.total_net_income)}
                    </p>

                    {item?.percent_net_income < 0 ? (
                      <p className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(
                          isNaN(item?.percent_net_income)
                            ? 0
                            : Math.abs(item?.percent_net_income)
                        ).toFixed(2)}
                        %
                      </p>
                    ) : (
                      <p className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />
                        {Number(
                          isNaN(item?.percent_net_income)
                            ? 0
                            : Math.abs(item?.percent_net_income)
                        ).toFixed(2)}
                        %
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
            </div>
          </div>
          <div className="block-content">
            <div className="header">
            <div className="text-header">
                <p>Top dịch vụ</p>
              </div>
              <div className="select-type-view">
                 <Select
                  value={typePriceService}
                  style={{ width: 150 }}
                  bordered={false}
                  onChange={(e) => { console.log(e, 'e'); setTypePriceService(e)} }
                  options={configSelectTopService}
                />
              </div>
            </div>
            <div className="content">

              

                  {dataTopService.map((item, index) => {
                    return (
                      <>
                      <div className="item-service">
                      <div className="div-name-service">
                      <Image
                        preview={false}
                        className="image-service"
                        src={item.thumbnail}
                      />
                      <p className="name-service">{item.title.vi}</p>
                    </div>
                    <div className="div-info-service">
                      <p className="money-area">
                        { formatMoney(item.value_view)}
                      </p>
                      {item.percent_view < 0 ? (<>
                        <p className="text-number-persent-down">
                        <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(item.percent_view)}%
                        </p>
                      </>) : (<>
                        <p className="text-number-persent-up">
                        <CaretUpOutlined style={{ marginRight: 5 }} />{" "}
                        {Math.abs(item.percent_view)}%
                        </p>
                      </>)}
                    </div>
                    </div>
                      </>
                    )
                  })}


              



                  {/* {dataChartSerive.map((item, index) => {

                  })} */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}



export default memo(ReportOverview);



//               {dataChartSerive.slice(0, 5)?.map((item, index) => {
//                 return (
//                   <div key={index} className="div-item-chart">
//                     <div className="div-name-service">
//                       <Image
//                         preview={false}
//                         className="imagte-service"
//                         src={item?.thumbnail}
//                       />
//                       <p className="name-service">{item?.name[lang]}</p>
//                     </div>
//                     <div className="div-number-area">
//                       <p className="money-area">
//                         {typePriceService === "income"
//                           ? formatMoney(item?.income)
//                           : formatMoney(item?.net_income)}
//                       </p>
//                       {typePriceService === "income" ? (
//                         <>
//                           {item?.percent_income < 0 ? (
//                             <p className="text-number-persent-down">
//                               <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                               {Math.abs(
//                                 isNaN(item?.percent_income)
//                                   ? 0
//                                   : item?.percent_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           ) : (
//                             <p className="text-number-persent-up">
//                               <CaretUpOutlined style={{ marginRight: 5 }} />
//                               {Number(
//                                 isNaN(item?.percent_income)
//                                   ? 0
//                                   : item?.percent_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           )}
//                         </>
//                       ) : (
//                         <>
//                           {item?.percent_net_income < 0 ? (
//                             <p className="text-number-persent-down">
//                               <CaretDownOutlined style={{ marginRight: 5 }} />{" "}
//                               {Math.abs(
//                                 isNaN(item?.percent_net_income)
//                                   ? 0
//                                   : item?.percent_net_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           ) : (
//                             <p className="text-number-persent-up">
//                               <CaretUpOutlined style={{ marginRight: 5 }} />
//                               {Number(
//                                 isNaN(item?.percent_net_income)
//                                   ? 0
//                                   : item?.percent_net_income
//                               ).toFixed(2)}
//                               %
//                             </p>
//                           )}
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}