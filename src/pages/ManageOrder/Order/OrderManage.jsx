// import { StarFilled } from "@ant-design/icons";
// import { UilEllipsisV } from "@iconscout/react-unicons";
// import { Dropdown, Pagination, Space, Table } from "antd";
// import moment from "moment";
// import React, { memo, useState } from "react";
// import { useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { deleteOrderApi, getOrderApi } from "../../../../api/order";
// import ModalCustom from "../../../../components/modalCustom";
// import LoadingPagination from "../../../../components/paginationLoading";
// import { formatMoney } from "../../../../helper/formatMoney";
// import { errorNotify } from "../../../../helper/toast";
// import { useCookies } from "../../../../helper/useCookies";
// import useWindowDimensions from "../../../../helper/useWindowDimensions";
// import { useWindowScrollPositions } from "../../../../helper/useWindowPosition";
// import i18n from "../../../../i18n";
// import {
//   getElementState,
//   getLanguageState,
// } from "../../../../redux/selectors/auth";
// import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder";
// import EditTimeOrder from "../EditTimeGroupOrder";
// import "./OrderManage.scss";
// import DataTable from "../../../../components/tables/dataTable"


// const OrderManage = (props) => {
//   const {
//     data,
//     total,
//     status,
//     kind,
//     setData,
//     setTotal,
//     currentPage,
//     setCurrentPage,
//     setStartPage,
//     startPage,
//     type,
//     startDate,
//     endDate,
//     valueSearch,
//     city,
//   } = props;
//   const [selectedRowKeys, setSelectedRowKeys] = useState([]);
//   const [item, setItem] = useState([]);
//   const [modal, setModal] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const toggle = () => setModal(!modal);
//   const { width } = useWindowDimensions();
//   const checkElement = useSelector(getElementState);
//   const lang = useSelector(getLanguageState);
//   const { scrollY } = useWindowScrollPositions();
//   const [saveToCookie] = useCookies();
//   const timeWork = (data) => {
//     const start = moment(new Date(data.date_work)).format("HH:mm");

//     const timeEnd = moment(new Date(data.date_work))
//       .add(data?.total_estimate, "hours")
//       .format("HH:mm");

//     return start + " - " + timeEnd;
//   };

//   const deleteOrder = (id) => {
//     setIsLoading(true);
//     deleteOrderApi(id)
//       .then((res) => {
//         getOrderApi(
//           valueSearch,
//           startPage,
//           20,
//           status,
//           kind,
//           type,
//           startDate,
//           endDate,
//           "",
//           ""
//         )
//           .then((res) => {
//             setData(res?.data);
//             setTotal(res?.totalItem);
//           })
//           .catch((err) => {});
//         setModal(false);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         errorNotify({
//           message: err,
//         });
//         setIsLoading(false);
//       });
//   };

//   // const items =
//   //   item?.status === "pending"
//   //     ? [
//   //         {
//   //           key: "1",
//   //           label: checkElement?.includes("add_collaborator_guvi_job") &&
//   //             item?.status === "pending" && (
//   //               <AddCollaboratorOrder
//   //                 idOrder={item?._id}
//   //                 idCustomer={item?.id_customer?._id}
//   //                 status={item?.status}
//   //                 type={status}
//   //                 kind={kind}
//   //                 startPage={startPage}
//   //                 setData={setData}
//   //                 setTotal={setTotal}
//   //                 setIsLoading={setIsLoading}
//   //               />
//   //             ),
//   //         },
//   //         {
//   //           key: "2",
//   //           label: checkElement?.includes("detail_guvi_job") && (
//   //             <Link to={`/details-order/${item?.id_group_order}`}>
//   //               <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
//   //                 lng: lang,
//   //               })}`}</p>
//   //             </Link>
//   //           ),
//   //         },
//   //         {
//   //           key: "3",
//   //           label: checkElement?.includes("edit_guvi_job") ? (
//   //             <EditTimeOrder
//   //               idOrder={item?._id}
//   //               dateWork={item?.date_work}
//   //               code={item?.code_promotion ? item?.code_promotion?.code : ""}
//   //               status={status}
//   //               kind={kind}
//   //               startPage={startPage}
//   //               setData={setData}
//   //               setTotal={setTotal}
//   //               setIsLoading={setIsLoading}
//   //               details={false}
//   //               estimate={item?.total_estimate}
//   //               valueSearch={valueSearch}
//   //               type={type}
//   //               startDate={startDate}
//   //               endDate={endDate}
//   //             />
//   //           ) : (
//   //             ""
//   //           ),
//   //         },
//   //       ]
//   //     : [
//   //         {
//   //           key: "1",
//   //           label: checkElement?.includes("detail_guvi_job") && (
//   //             <Link to={`/details-order/${item?.id_group_order}`}>
//   //               <p className="m-0">{`${i18n.t("see_more", { lng: lang })}`}</p>
//   //             </Link>
//   //           ),
//   //         },
//   //         {
//   //           key: "2",
//   //           label: checkElement?.includes("add_collaborator_guvi_job") &&
//   //             item?.status === "confirm" && (
//   //               <AddCollaboratorOrder
//   //                 idOrder={item?._id}
//   //                 idCustomer={item?.id_customer?._id}
//   //                 status={item?.status}
//   //                 type={status}
//   //                 kind={kind}
//   //                 startPage={startPage}
//   //                 setData={setData}
//   //                 setTotal={setTotal}
//   //                 setIsLoading={setIsLoading}
//   //               />
//   //             ),
//   //         },
//   //         {
//   //           key: "3",
//   //           label:
//   //             checkElement?.includes("delete_order_guvi_job") &&
//   //             (item?.status === "cancel" || item?.status === "done" ? (
//   //               <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
//   //                 lng: lang,
//   //               })}`}</p>
//   //             ) : (
//   //               ""
//   //             )),
//   //         },
//   //       ];




//   // const columns = [
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("code_order", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => {
//   //       return (
//   //         <Link
//   //           onClick={() => saveToCookie("order_scrolly", scrollY)}
//   //           to={
//   //             checkElement?.includes("detail_guvi_job")
//   //               ? `/details-order/${data?.id_group_order}`
//   //               : ""
//   //           }
//   //         >
//   //           <p className="text-id-view-order">{data?.id_view}</p>
//   //         </Link>
//   //       );
//   //     },
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("date_create", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => {
//   //       return (
//   //         <div className="div-create-order">
//   //           <p className="text-create">
//   //             {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
//   //           </p>
//   //           <p className="text-create">
//   //             {moment(new Date(data?.date_create)).format("HH:mm")}
//   //           </p>
//   //         </div>
//   //       );
//   //     },
//   //     responsive: ["xl"],
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("customer", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => {
//   //       return (
//   //         <Link to={`/profile-customer/${data?.id_customer?._id}`}>
//   //           <div className="div-name-order-cutomer">
//   //             <p className="text-name-customer">
//   //               {data?.id_customer?.full_name}
//   //             </p>
//   //             <p className="text-phone-order-customer">
//   //               {data?.id_customer?.phone}
//   //             </p>
//   //           </div>
//   //         </Link>
//   //       );
//   //     },
//   //     align: "left",

//   //     // sorter: (a, b) =>
//   //     //   a.id_customer.full_name.localeCompare(b.id_customer.full_name),
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("service", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => {
//   //       return (
//   //         <div className="div-service-order">
//   //           <p className="text-service">
//   //             {data?.type === "loop" && data?.is_auto_order
//   //               ? `${i18n.t("repeat", { lng: lang })}`
//   //               : data?.service?._id?.kind === "giup_viec_theo_gio"
//   //               ? `${i18n.t("cleaning", { lng: lang })}`
//   //               : data?.service?._id?.kind === "giup_viec_co_dinh"
//   //               ? `${i18n.t("cleaning_subscription", { lng: lang })}`
//   //               : data?.service?._id?.kind === "phuc_vu_nha_hang"
//   //               ? `${i18n.t("serve", { lng: lang })}`
//   //               : data?.service?._id?.kind === "ve_sinh_may_lanh"
//   //               ? `${i18n.t("Máy lạnh", { lng: lang })}`
//   //               : ""}
//   //           </p>
//   //           <p className="text-service">{timeWork(data)}</p>
//   //         </div>
//   //       );
//   //     },
//   //     align: "center",
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("date_work", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => {
//   //       return (
//   //         <div className="div-worktime-order">
//   //           <p className="text-worktime">
//   //             {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
//   //           </p>
//   //           <p className="text-worktime">
//   //             {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
//   //           </p>
//   //         </div>
//   //       );
//   //     },
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("address", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => {
//   //       return <p className="text-address-order">{data?.address}</p>;
//   //     },
//   //     responsive: ["xl"],
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("collaborator", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     render: (data) => (
//   //       <>
//   //         {!data?.id_collaborator ? (
//   //           <p className="text-pending-search">{`${i18n.t("searching", {
//   //             lng: lang,
//   //           })}`}</p>
//   //         ) : (
//   //           <Link
//   //             to={`/details-collaborator/${data?.id_collaborator?._id}`}
//   //             className="div-name-order"
//   //           >
//   //             <div className="div-name-star">
//   //               <p className="text-collaborator">
//   //                 {data?.id_collaborator?.full_name}
//   //               </p>
//   //               {data?.id_collaborator?.star && (
//   //                 <div className="div-star">
//   //                   <p className="text-star">{data?.id_collaborator?.star}</p>
//   //                   <StarFilled className="icon-star" />
//   //                 </div>
//   //               )}
//   //             </div>
//   //             <p className="text-phone">{data?.id_collaborator?.phone}</p>
//   //           </Link>
//   //         )}
//   //       </>
//   //     ),
//   //   },

//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("status", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     align: "center",
//   //     render: (data) => (
//   //       <p
//   //         className={
//   //           data?.status === "pending"
//   //             ? "text-pen-order"
//   //             : data?.status === "confirm"
//   //             ? "text-confirm-order"
//   //             : data?.status === "doing"
//   //             ? "text-doing-order"
//   //             : data?.status === "done"
//   //             ? "text-done-order"
//   //             : "text-cancel-order"
//   //         }
//   //       >
//   //         {data?.status === "pending"
//   //           ? `${i18n.t("pending", { lng: lang })}`
//   //           : data?.status === "confirm"
//   //           ? `${i18n.t("confirm", { lng: lang })}`
//   //           : data?.status === "doing"
//   //           ? `${i18n.t("doing", { lng: lang })}`
//   //           : data?.status === "done"
//   //           ? `${i18n.t("complete", { lng: lang })}`
//   //           : `${i18n.t("cancel", { lng: lang })}`}
//   //       </p>
//   //     ),
//   //   },
//   //   {
//   //     title: () => {
//   //       return (
//   //         <p className="title-column">{`${i18n.t("pay", {
//   //           lng: lang,
//   //         })}`}</p>
//   //       );
//   //     },
//   //     align: "center",
//   //     render: (data) => {
//   //       return (
//   //         <div className="div-payment">
//   //           <p className="text-payment-method">
//   //             {data?.payment_method === "cash"
//   //               ? `${i18n.t("cash", { lng: lang })}`
//   //               : data?.payment_method === "point"
//   //               ? `${i18n.t("wallet_gpay", { lng: lang })}`
//   //               : ""}
//   //           </p>
//   //           <p className="text-payment-method">
//   //             {formatMoney(data?.final_fee)}
//   //           </p>
//   //         </div>
//   //       );
//   //     },
//   //     responsive: ["xl"],
//   //   },
//   //   {
//   //     key: "action",
//   //     align: "center",
//   //     render: (data) => (
//   //       <Space size="middle">
//   //         <Dropdown
//   //           menu={{
//   //             items,
//   //           }}
//   //           placement="bottomLeft"
//   //           trigger={["click"]}
//   //         >
//   //           <div>
//   //             <UilEllipsisV />
//   //           </div>
//   //         </Dropdown>
//   //       </Space>
//   //     ),
//   //   },
//   // ];

//   const onChange = (page) => {
//     setCurrentPage(page);
//     saveToCookie("page_order", page);
//     const dataLength = data.length < 20 ? 20 : data.length;
//     const start = page * dataLength - dataLength;
//     setStartPage(start);
//     saveToCookie("start_order", start);
//     getOrderApi(
//       valueSearch,
//       start,
//       20,
//       status,
//       kind,
//       type,
//       startDate,
//       endDate,
//       city,
//       ""
//     )
//       .then((res) => {
//         setData(res?.data);
//         setTotal(res?.totalItem);
//       })
//       .catch((err) => {});
//   };

//   const columns = [
//     {
//       i18n_title: 'code_order',
//       dataIndex: 'id_view',
//       key: "id_view"
//     },
//     {
//       i18n_title: 'date_create',
//       dataIndex: 'date_create',
//       key: "date_create"
//     },
//     {
//       i18n_title: 'customer',
//       dataIndex: 'customer',
//       key: "customer-phone"
//     },
//     {
//       i18n_title: 'service',
//       dataIndex: 'service._id.title.vi',
//       key: "service"
//     },
//     {
//       i18n_title: 'date_work',
//       dataIndex: 'date_work',
//       key: "date_work"
//     },
//     {
//       i18n_title: 'collaborator',
//       dataIndex: 'collaborator',
//       key: "collaborator"
//     },
//     {
//       i18n_title: 'status',
//       dataIndex: 'status',
//       key: "status"
//     },
//     {
//       i18n_title: 'pay',
//       dataIndex: 'pay',
//       key: "pay"
//     },
//   ]

//   let items =  [
//     {
//       key: "1",
//       label: checkElement?.includes("detail_guvi_job") && (
//         <Link to={`/details-order/${item?.id_group_order}`}>
//           <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
//             lng: lang,
//           })}`}</p>
//         </Link>
//       ),
//     },
//     {
//       key: "2",
//       label: checkElement?.includes("add_collaborator_guvi_job") &&
//         item?.status === "pending" && (
//           <AddCollaboratorOrder
//             idOrder={item?._id}
//             idCustomer={item?.id_customer?._id}
//             status={item?.status}
//             type={status}
//             kind={kind}
//             startPage={startPage}
//             setData={setData}
//             setTotal={setTotal}
//             setIsLoading={setIsLoading}
//           />
//         ),
//     },
//     {
//       key: "3",
//       label: checkElement?.includes("edit_guvi_job") && item?.status !== "done" && item?.status !== "cancel" && item?.status !== "doing" && (
//         <EditTimeOrder
//           idOrder={item?._id}
//           dateWork={item?.date_work}
//           code={item?.code_promotion ? item?.code_promotion?.code : ""}
//           status={status}
//           kind={kind}
//           startPage={startPage}
//           setData={setData}
//           setTotal={setTotal}
//           setIsLoading={setIsLoading}
//           details={false}
//           estimate={item?.total_estimate}
//           valueSearch={valueSearch}
//           type={type}
//           startDate={startDate}
//           endDate={endDate}
//         />
//       )
//     },
//     {
//       key: "4",
//       label: checkElement?.includes("delete_order_guvi_job") &&
//       (<p className="m-0" onClick={toggle}>{`${i18n.t("delete", {lng: lang})}`}</p>)
//     }
//   ]

//   items = items.filter(x => x.label !== false);

//   const addActionColumn = {
//     i18n_title: '',
//     dataIndex: 'action',
//     key: "action",
//     render: () =>  (
//     <Space size="middle">
//       <Dropdown menu={{items}} trigger={["click"]}>
//         <a>
//           <UilEllipsisV />
//         </a>
//       </Dropdown>
//     </Space>  
//   )
//   };

//   return (
//     <React.Fragment>
//       <div className="mt-3">
//         <DataTable
//           columns={columns}
//           data={data}
//           actionColumn={addActionColumn}
//           onValueChange={setItem}
//         />

//         <div className="mt-2 div-pagination-order p-2">
//           <p>
//             {`${i18n.t("total", { lng: lang })}`}: {total}
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
//         <div>
//           <ModalCustom
//             isOpen={modal}
//             title={`${i18n.t("delete_order", { lng: lang })}`}
//             handleOk={() => deleteOrder(item?._id)}
//             handleCancel={toggle}
//             textOk={`${i18n.t("delete", { lng: lang })}`}
//             body={
//               <>
//                 <p>{`${i18n.t("confirm_delete", { lng: lang })}`}</p>
//                 <p className="text-name-modal">{item?.id_view}</p>
//               </>
//             }
//           />
//         </div>
//       </div>

//       {isLoading && <LoadingPagination />}
//     </React.Fragment>
//   );
// };

// export default memo(OrderManage);
