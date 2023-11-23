// import { Image, Pagination, Popover, Table } from "antd";
// import moment from "moment";
// import { useEffect, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { getReportCustomer } from "../../../../../api/report";
// import add from "../../../../../assets/images/add.png";
// import collaborator from "../../../../../assets/images/collaborator.png";
// import CustomDatePicker from "../../../../../components/customDatePicker";
// import LoadingPagination from "../../../../../components/paginationLoading";
// import { formatMoney } from "../../../../../helper/formatMoney";
// import useWindowDimensions from "../../../../../helper/useWindowDimensions";
// import i18n from "../../../../../i18n";
// import { getLanguageState } from "../../../../../redux/selectors/auth";
// import RangeDatePicker from "../../../../../components/datePicker/RangeDatePicker";
// import "./index.scss";

// const ReportCustomer = () => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [data, setData] = useState([]);
//   const [total, setTotal] = useState([]);
//   const [totalColumn, setTotalColumn] = useState([]);
//   const [customerNew, setCustomerNew] = useState(0);
//   const [customerOld, setCustomerOld] = useState(0);
//   const [moneyNew, setMoneyNew] = useState(0);
//   const [moneyOld, setMoneyOld] = useState(0);
//   const [totalOrderNew, setTotalOrderNew] = useState([]);
//   const [totalOrderOld, setTotalOrderOld] = useState([]);
//   const [type, setType] = useState("all");
//   const [isLoading, setIsLoading] = useState(false);

//   const [startDate, setStartDate] = useState("")
//   const [endDate, setEndDate] = useState("")

//   // const [startDate, setStartDate] = useState(
//   //   moment().subtract(30, "d").startOf("date").toISOString()
//   // );
//   // const [endDate, setEndDate] = useState(moment().endOf("date").toISOString());
//   const { width } = useWindowDimensions();
//   const lang = useSelector(getLanguageState);

//   // useEffect(() => {
//   //   getReportCustomer(
//   //     0,
//   //     20,
//   //     moment().subtract(30, "d").startOf("date").toISOString(),
//   //     moment().endOf("date").toISOString(),
//   //     "all"
//   //   )
//   //     .then((res) => {
//   //       setData(res?.data);
//   //       setTotal(res?.totalItem);
//   //       setTotalColumn(res?.total[0]);
//   //     })
//   //     .catch((err) => {});

//   //   getReportCustomer(
//   //     0,
//   //     20,
//   //     moment().subtract(30, "d").startOf("date").toISOString(),
//   //     moment().endOf("date").toISOString(),
//   //     "new"
//   //   )
//   //     .then((res) => {
//   //       setCustomerNew(res?.totalItem);
//   //       setTotalOrderNew(res?.total[0]?.total_item);
//   //       setMoneyNew(res?.total[0]?.total_net_income_business);
//   //     })
//   //     .catch((err) => {});

//   //   getReportCustomer(
//   //     0,
//   //     20,
//   //     moment().subtract(30, "d").startOf("date").toISOString(),
//   //     moment().endOf("date").toISOString(),
//   //     "old"
//   //   )
//   //     .then((res) => {
//   //       setCustomerOld(res?.totalItem);
//   //       setTotalOrderOld(res?.total[0]?.total_item);
//   //       setMoneyOld(res?.total[0]?.total_net_income_business);
//   //     })
//   //     .catch((err) => {});
//   // }, []);

//   useEffect(() => {
//     if (startDate !== "") {
//       onChangeDay();
//     }
//   }, [startDate])



//   const onChangeDay = () => {
//     setIsLoading(true);
//     setCurrentPage(1);
//     getReportCustomer(0, 20, startDate, endDate, type)
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setTotalColumn(res?.total[0]);
//         setIsLoading(false);
//       })

//       .catch((err) => {
//         setIsLoading(false);
//       });

//     getReportCustomer(0, 20, startDate, endDate, "new")
//       .then((res) => {
//         setCustomerNew(res?.totalItem);
//         setTotalOrderNew(res?.total[0]?.total_item);
//         setMoneyNew(res?.total[0]?.total_net_income_business);
//       })
//       .catch((err) => {});

//     getReportCustomer(0, 20, startDate, endDate, "old")
//       .then((res) => {
//         setCustomerOld(res?.totalItem);
//         setTotalOrderOld(res?.total[0]?.total_item);
//         setMoneyOld(res?.total[0]?.total_net_income_business);
//       })
//       .catch((err) => {});
//   };

//   const onChange = (page) => {
//     setCurrentPage(page);
//     const lengthData = data.length < 20 ? 20 : data.length;
//     const start = page * lengthData - lengthData;
//     getReportCustomer(start, 20, startDate, endDate, type)
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setTotalColumn(res?.total[0]);
//       })
//       .catch((err) => {});
//   };

//   const onChangeTab = (value) => {
//     setType(value);
//     setCurrentPage(1);
//     getReportCustomer(0, 20, startDate, endDate, value)
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//         setTotalColumn(res?.total[0]);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         setIsLoading(false);
//       });
//   };

//   const columns = [
//     {
//       title: () => {
//         return (
//           <div className="div-title-customer-id">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("customer", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <div className="div-top"></div>
//           </div>
//         );
//       },
//       align: "left",
//       render: (data) => {
//         return (
//           <Link
//             to={`/profile-customer/${data?.id_customer?._id}`}
//             className="div-name-kh-report"
//           >
//             <p className="text-name-report"> {data?.id_customer?.full_name}</p>
//           </Link>
//         );
//       },
//     },
//     {
//       title: () => {
//         return (
//           <div className="div-title-customer">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("shift", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <p className="text-money-title">
//               {totalColumn?.total_item > 0 ? totalColumn?.total_item : 0}
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
//           <div className="div-title-customer">
//             <div className="div-title-report">
//               <p className="text-title-column">{`${i18n.t("sales", {
//                 lng: lang,
//               })}`}</p>
//             </div>
//             <p className="text-money-title">
//               {totalColumn?.total_gross_income > 0
//                 ? formatMoney(totalColumn?.total_gross_income)
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
//           <div className="div-title-customer">
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
//               {totalColumn?.total_collabotator_fee > 0
//                 ? formatMoney(totalColumn?.total_collabotator_fee)
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
//           <div className="div-title-customer">
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
//               {totalColumn?.total_income > 0
//                 ? formatMoney(totalColumn?.total_income)
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
//           <div className="div-title-customer">
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
//               {totalColumn?.total_discount > 0
//                 ? formatMoney(totalColumn?.total_discount)
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
//       sorter: (a, b) => a.total_discount - b.total_discount,
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
//           <div className="div-title-customer">
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
//               {totalColumn?.total_net_income > 0
//                 ? formatMoney(totalColumn?.total_net_income)
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
//           <div className="div-title-customer">
//             <p className="text-title-column m-0">{`${i18n.t("fees_apply", {
//               lng: lang,
//             })}`}</p>
//             <p className="text-money-title">
//               {totalColumn?.total_service_fee > 0
//                 ? formatMoney(totalColumn?.total_service_fee)
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
//       sorter: (a, b) => a.total_net_income - b.total_net_income,
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
//           <div className="div-title-customer">
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
//               {totalColumn?.total_order_fee > 0
//                 ? formatMoney(totalColumn?.total_order_fee)
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
//           <div className="div-title-customer">
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
//               {totalColumn?.total_net_income_business > 0
//                 ? formatMoney(totalColumn?.total_net_income_business)
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
//           <div className="div-title-customer">
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
//     <div className="div-container-report-customer">
//       <h3>{`${i18n.t("order_report_customer", { lng: lang })}`}</h3>
//       <div className="div-date">

//       <RangeDatePicker
//               setStartDate={setStartDate}
//               setEndDate={setEndDate}
//               onCancel={() => { }}
//               defaults={"last_thirty"}
//             />

//         {/* <CustomDatePicker
//           setStartDate={setStartDate}
//           setEndDate={setEndDate}
//           onClick={onChangeDay}
//           onCancel={() => {}}
//           setSameStart={() => {}}
//           setSameEnd={() => {}}
//         /> */}
//         {startDate && (
//           <div className="ml-2">
//             <p className="text-date m-0">
//               {moment(new Date(startDate)).format("DD/MM/YYYY")} -{" "}
//               {moment(endDate).utc().format("DD/MM/YYYY")}
//             </p>
//           </div>
//         )}
//       </div>
//       <div className="header-report-customer">
//         <div className="div-tab-header-service">
//           <div className="div-img">
//             <Image preview={false} src={collaborator} className="img" />
//           </div>
//           <div className="div-text-tab">
//             <div className="div-t">
//               <p className="text-tab-header">{`${i18n.t("customer_order_new", {
//                 lng: lang,
//               })}`}</p>
//               <p className="text-tab-header">{customerNew}</p>
//             </div>
//           </div>
//         </div>

//         <div className="div-tab-header-service">
//           <div className="div-img">
//             <Image preview={false} src={add} className="img" />
//           </div>
//           <div className="div-text-tab">
//             <div className="div-t">
//               <p className="text-tab-header">{`${i18n.t("total_shift", {
//                 lng: lang,
//               })}`}</p>
//               <p className="text-tab-header">
//                 {totalOrderNew ? totalOrderNew : 0}
//               </p>
//             </div>
//           </div>
//           <div className="div-text-tab">
//             <div className="div-t">
//               <p className="text-tab-header">{`${i18n.t("total_money", {
//                 lng: lang,
//               })}`}</p>
//               <p className="text-tab-header">
//                 {formatMoney(moneyNew ? moneyNew : 0)}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="div-tab-header-service">
//           <div className="div-img">
//             <Image preview={false} src={collaborator} className="img" />
//           </div>
//           <div className="div-text-tab">
//             <div className="div-t">
//               <p className="text-tab-header">{`${i18n.t("customer_order_old", {
//                 lng: lang,
//               })}`}</p>
//               <p className="text-tab-header">{customerOld}</p>
//             </div>
//           </div>
//         </div>

//         <div className="div-tab-header-service">
//           <div className="div-img">
//             <Image preview={false} src={add} className="img" />
//           </div>
//           <div className="div-text-tab">
//             <div className="div-t">
//               <p className="text-tab-header">{`${i18n.t("total_shift", {
//                 lng: lang,
//               })}`}</p>
//               <p className="text-tab-header">
//                 {totalOrderOld ? totalOrderOld : 0}
//               </p>
//             </div>
//           </div>
//           <div className="div-text-tab">
//             <div className="div-t">
//               <p className="text-tab-header">{`${i18n.t("total_money", {
//                 lng: lang,
//               })}`}</p>
//               <p className="text-tab-header">{formatMoney(moneyOld)}</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="mt-5 div-table">
//         <div className="div-tab-customer-report">
//           {TAB?.map((item, index) => {
//             return (
//               <div
//                 key={index}
//                 className={item?.value === type ? "div-tab-select" : "div-tab"}
//                 onClick={() => onChangeTab(item?.value)}
//               >
//                 <p className="title-tab">{`${i18n.t(item?.title, {
//                   lng: lang,
//                 })}`}</p>
//               </div>
//             );
//           })}
//         </div>
//         <div className="mt-4">
//           <Table
//             columns={columns}
//             pagination={false}
//             rowKey={(record) => record._id}
//             dataSource={data}
//             rowSelection={{
//               selectedRowKeys,
//               onChange: (selectedRowKeys, selectedRows) => {
//                 setSelectedRowKeys(selectedRowKeys);
//               },
//             }}
//             scroll={{
//               x: width <= 490 ? 1200 : 0,
//             }}
//           />
//         </div>
//         <div className="mt-2 div-pagination p-2">
//           <p>
//             {`${i18n.t("total", {
//               lng: lang,
//             })}`}
//             : {total}
//           </p>
//           <div>
//             <Pagination
//               current={currentPage}
//               onChange={onChange}
//               total={total}
//               showSizeChanger={false}
//               pageSize={20}
//             />
//           </div>
//         </div>
//       </div>

//       {isLoading && <LoadingPagination />}
//     </div>
//   );
// };
// export default ReportCustomer;

// const TAB = [
//   {
//     title: "all",
//     value: "all",
//   },
//   {
//     title: "new_customer",
//     value: "new",
//   },
//   {
//     title: "old_customer",
//     value: "old",
//   },
// ];





import { formatMoney } from "../../../../helper/formatMoney";
import {getReportOrderByCustomer} from "../../../../api/report"
import { Pagination, Popover, Table } from "antd";
import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getReportOrder } from "../../../../api/report";
import DataTable from "../../../../components/tables/dataTable"
import RangeDatePicker from "../../../../components/datePicker/RangeDatePicker";
import i18n from "../../../../i18n";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import { getLanguageState } from "../../../../redux/selectors/auth";
import "./index.scss";



const ReportOrderByCustomer = () => {
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

  const [typeCustomer, setTypeCustomer] = useState("all")
  const [typeDate, setTypeDate] = useState("date_work")



  const [isLoading, setIsLoading] = useState(false);
  const { width } = useWindowDimensions();
  const lang = useSelector(getLanguageState);



  useEffect(() => {
    if (startDate !== "") {
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((new Date(startDate).getTime() - new Date(endDate).getTime()) / oneDay));
      getDataReportOrderByCustomer();
      //  getDataReportToday()
    }
  }, [sameStartDate])

  useEffect(() => {
    getDataReportOrderByCustomer();
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


  const getDataReportOrderByCustomer = async () => {
    const res = await getReportOrderByCustomer(startDate, endDate, typeCustomer, typeDate,  start, 20);
    setData(res.data);
    setTotal(res?.totalItem);
    console.log(res?.total[0], 'res?.total[0]');
    setDataTotal(res?.total[0]);
  }

  // const getDataReportTotalOrderByCustomer = async () => {
  //   const res = await getReportOrderDaily(start, 20, startDate, endDate, typeDate);
  //   setData(res.data);
  //   setTotal(res?.totalItem);
  //   console.log(res?.total[0], 'res?.total[0]');
  //   setDataTotal(res?.total[0]);
  // }





  const CustomHeaderDatatable = ({title, subValue, typeSubValue, textToolTip}) => {
    const content = (
        <p>
          {textToolTip ? textToolTip : ""}
        </p>
    );
    if(subValue) subValue = (typeSubValue === "money") ? formatMoney(subValue) : (typeSubValue === "percent") ? subValue + " %" : subValue;
    if(title == "Giá vốn") subValue = "0 đ";
    console.log(subValue, 'subValue');
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
      customTitle: <CustomHeaderDatatable title= "Khách hàng" />,
      dataIndex: 'id_customer.full_name',
      key: "id_customer_report",
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
        subValue={dataTotal.cost_price}
        typeSubValue="money" />,
      dataIndex: 'cost_price',
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
    {
      customTitle: <CustomHeaderDatatable title="Phí áp dụng"
        subValue={dataTotal.total_service_fee}
        typeSubValue="money" />,
      title: 'Phí áp dụng',
      dataIndex: 'total_service_fee',
      key: "money",
      width: 120,
      fontSize: "text-size-M text-weight-500"
    },
  ]




  return (
    <React.Fragment>
    <div className="div-container-content">
      <div className="div-flex-row">
        <div className="div-header-container">
          <h4 className="title-cv">Báo cáo số lượng đơn hàng theo khách hàng</h4>
        </div>

      </div>


        <div className="div-flex-row-flex-start">
          <div className="date-picker">
            <RangeDatePicker
              setStartDate={setStartDate}
              setEndDate={setEndDate}
              onCancel={() => { }}
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




      {/* <div className="div-flex-row">

          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
                <a class="text-title">Tổng giá trị giao dịch</a>
                <a class="text-detail">{formatMoney(dataTotal.total_gross_income)}</a>
              </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
                <a class="text-title">Tổng số đơn hàng</a>
                <a class="text-detail">{dataTotal.total_item} ca</a>
              </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
                <a class="text-title">Tổng doanh thu</a>
                <a class="text-detail">{formatMoney(dataTotal.total_income)}</a>
              </div>
          </div>
          <div class="card">
            <img src="/static/media/customer.08e2f54c.png" class="img"/>
              <div class="div-details">
                <a class="text-title">Tổng lợi nhuận</a>
                <a class="text-detail">{formatMoney(dataTotal.total_net_income_business)}</a>
              </div>
          </div>
      </div> */}


      {/* <div className="div-flex-row-flex-start">
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
        </div> */}





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


export default ReportOrderByCustomer;