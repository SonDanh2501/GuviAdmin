import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Pagination, Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import { getOrderByCustomers } from "../../../../../api/customer";
import { formatMoney } from "../../../../../helper/formatMoney";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./index.scss";
import useWindowDimensions from "../../../../../helper/useWindowDimensions";
import { useCookies } from "../../../../../helper/useCookies";
import DataTable from "../../../../../components/tables/dataTable";

const OrderCustomer = ({ id }) => {
  const { width } = useWindowDimensions();
  const [lengthPage, setLengthPage] = useState(
    JSON.parse(localStorage.getItem("linePerPage"))
      ? JSON.parse(localStorage.getItem("linePerPage")).value
      : 20
  );
  const [startPage, setStartPage] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(100);
  const lang = useSelector(getLanguageState);
  const { saveToCookie } = useCookies();

  useEffect(() => {
    getOrderByCustomers(id, startPage, lengthPage)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id, startPage, lengthPage]);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd = moment(new Date(data?.date_work_schedule[0]?.date))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

  //   const items = [
  //     {
  //       key: "1",
  //       label:
  //         item?.status === "cancel" ? <></> : <EditOrder idOrder={item?._id} />,
  //     },
  //     {
  //       key: "2",
  //       label: (
  //         <a
  //           onClick={() =>
  //             navigate("/details-order", {
  //               state: { id: item?._id },
  //             })
  //           }
  //         >
  //           Xem chi tiết
  //         </a>
  //       ),
  //     },
  //   ];

  // const columns1 = [
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("code_order", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => {
  //       return (
  //         <Link to={`/details-order/${data?._id}`}>
  //           <p className="text-id">{data?.id_view}</p>
  //         </Link>
  //       );
  //     },
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("date_create", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => {
  //       return (
  //         <div className="div-create">
  //           <p className="text-create">
  //             {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
  //           </p>
  //           <p className="text-create">
  //             {moment(new Date(data?.date_create)).format("HH:mm")}
  //           </p>
  //         </div>
  //       );
  //     },
  //     responsive: ["xl"],
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("service", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => {
  //       return (
  //         <div className="div-service">
  //           <p className="text-service">
  //             {data?.type === "loop" && data?.is_auto_order
  //               ? `${i18n.t("repeat", { lng: lang })}`
  //               : data?.service?._id?.kind === "giup_viec_theo_gio"
  //               ? `${i18n.t("cleaning", { lng: lang })}`
  //               : data?.service?._id?.kind === "giup_viec_co_dinh"
  //               ? `${i18n.t("cleaning_subscription", { lng: lang })}`
  //               : data?.service?._id?.kind === "phuc_vu_nha_hang"
  //               ? `${i18n.t("serve", { lng: lang })}`
  //               : data?.service?._id?.kind === "ve_sinh_may_lanh"
  //               ? `${i18n.t("Máy lạnh", { lng: lang })}`
  //               : ""}
  //           </p>
  //           <p className="text-service">{timeWork(data)}</p>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("date_work", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => {
  //       return (
  //         <div className="div-worktime">
  //           <p className="text-worktime">
  //             {" "}
  //             {moment(new Date(data?.date_work_schedule[0].date)).format(
  //               "DD/MM/YYYY"
  //             )}
  //           </p>
  //           <p className="text-worktime">
  //             {moment(new Date(data?.date_work_schedule[0].date))
  //               .locale(lang)
  //               .format("dddd")}
  //           </p>
  //         </div>
  //       );
  //     },
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("address", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => <p className="text-address">{data?.address}</p>,
  //     responsive: ["xl"],
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("collaborator", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => (
  //       <>
  //         {!data?.id_collaborator ? (
  //           <p className="text-searching">{`${i18n.t("searching", {
  //             lng: lang,
  //           })}`}</p>
  //         ) : (
  //           <Link
  //             onClick={() => saveToCookie("tab-detail-ctv", "1")}
  //             to={`/details-collaborator/${data?.id_collaborator}`}
  //           >
  //             <p className="text-collaborator">{data?.name_collaborator}</p>
  //           </Link>
  //         )}
  //       </>
  //     ),
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("status", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => (
  //       <p
  //         className={
  //           data?.status === "pending"
  //             ? "text-pending"
  //             : data?.status === "confirm"
  //             ? "text-confirm"
  //             : data?.status === "doing"
  //             ? "text-doing"
  //             : data?.status === "done"
  //             ? "text-done"
  //             : "text-cancel"
  //         }
  //       >
  //         {data?.status === "pending"
  //           ? `${i18n.t("pending", { lng: lang })}`
  //           : data?.status === "confirm"
  //           ? `${i18n.t("confirm", { lng: lang })}`
  //           : data?.status === "doing"
  //           ? `${i18n.t("doing", { lng: lang })}`
  //           : data?.status === "done"
  //           ? `${i18n.t("complete", { lng: lang })}`
  //           : `${i18n.t("cancel", { lng: lang })}`}
  //       </p>
  //     ),
  //   },
  //   {
  //     title: () => {
  //       return (
  //         <p className="title-column">{`${i18n.t("total_money", {
  //           lng: lang,
  //         })}`}</p>
  //       );
  //     },
  //     render: (data) => (
  //       <p className="text-money-order-customer">
  //         {formatMoney(data?.final_fee)}
  //       </p>
  //     ),
  //   },
  // ];

  const columns = [
    // {
    //   title: "STT",
    //   dataIndex: "",
    //   key: "ordinal",
    //   width: 60,
    //   fontSize: "text-size-M",
    // },
    {
      i18n_title: "code_order",
      dataIndex: "id_view",
      key: "code_order",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "date_create",
      dataIndex: "date_create",
      key: "date_create",
      width: 100,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "customer",
      title: "Dịch vụ",
      dataIndex: "service",
      key: "service",
      width: 140,
      fontSize: "text-size-M",
    },
    {
      // i18n_title: "service",
      title: "Ngày làm",
      dataIndex: "date_work",
      key: "date_work",
      width: 130,
      fontSize: "text-size-M",
    },
    {
      title: "Địa chỉ",
      // i18n_title: "address",
      dataIndex: "address",
      key: "text",
      width: 220,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "collaborator",
      dataIndex: "collaborator",
      key: "collaborator",
      width: 160,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "status",
      dataIndex: "status",
      key: "status",
      width: 120,
      fontSize: "text-size-M",
    },
    {
      i18n_title: "pay",
      dataIndex: "pay",
      key: "pay",
      width: 90,
      fontSize: "text-size-M",
    },
  ]; 
  const onChangePage = (value) => {
    setStartPage(value);
  };
  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    getOrderByCustomers(id, start, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <React.Fragment>
      <div>
        {/* <Table
          columns={columns1}
          dataSource={data}
          pagination={false}
          rowKey={(record) => record._id}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          expandable={
            width <= 1200
              ? {
                  expandedRowRender: (record) => {
                    return (
                      <div className="div-plus">
                        <p>
                          {`${i18n.t("address", { lng: lang })}`}:{" "}
                          {record?.address}
                        </p>
                        <p>
                          {`${i18n.t("date_create", { lng: lang })}`}:{" "}
                          {moment(new Date(record?.date_create)).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </p>
                      </div>
                    );
                  },
                }
              : ""
          }
          scroll={{ x: width < 900 ? 900 : 0 }}
        /> */}
        <DataTable
          columns={columns}
          data={data}
          // actionColumn={addActionColumn}
          start={startPage}
          pageSize={lengthPage}
          setLengthPage={setLengthPage}
          totalItem={total}
          // getItemRow={setItem}
          onCurrentPageChange={onChangePage}
          // detectLoading={detectLoading}
        ></DataTable>
        {/* <div className="mt-2 div-pagination p-2">
          <p>Tổng: {total}</p>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={total}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
};

export default OrderCustomer;
