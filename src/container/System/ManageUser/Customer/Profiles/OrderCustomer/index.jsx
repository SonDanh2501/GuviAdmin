import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { Pagination, Table } from "antd";
import moment from "moment";
import { Link } from "react-router-dom";
import { getOrderByCustomers } from "../../../../../../api/customer";
import { formatMoney } from "../../../../../../helper/formatMoney";
import i18n from "../../../../../../i18n";
import { getLanguageState } from "../../../../../../redux/selectors/auth";
import "./index.scss";
import useWindowDimensions from "../../../../../../helper/useWindowDimensions";
import { useCookies } from "../../../../../../helper/useCookies";

export default function OrderCustomer({ id }) {
  // const { state } = useLocation();
  // const { id } = state || {};
  const { width } = useWindowDimensions();
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [item, setItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const lang = useSelector(getLanguageState);
  const { saveToCookie } = useCookies();

  useEffect(() => {
    getOrderByCustomers(id, 0, 20)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

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

  const columns = [
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("code_order", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <Link to={`/details-order/${data?._id}`}>
            <a className="text-id">{data?.id_view}</a>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="div-create">
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </a>
            <a className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </a>
          </div>
        );
      },
      responsive: ["xl"],
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("service", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">
              {data?.type === "loop" && data?.is_auto_order
                ? `${i18n.t("repeat", { lng: lang })}`
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? `${i18n.t("cleaning", { lng: lang })}`
                : data?.service?._id?.kind === "giup_viec_co_dinh"
                ? `${i18n.t("cleaning_subscription", { lng: lang })}`
                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                ? `${i18n.t("serve", { lng: lang })}`
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("date_work", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <div className="div-worktime">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work_schedule[0].date))
                .locale(lang)
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("address", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => <p className="text-address">{data?.address}</p>,
      responsive: ["xl"],
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("collaborator", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a className="text-searching">{`${i18n.t("searching", {
              lng: lang,
            })}`}</a>
          ) : (
            <Link
              onClick={() => saveToCookie("tab-detail-ctv", "1")}
              to={`/details-collaborator/${data?.id_collaborator}`}
            >
              <a className="text-collaborator">{data?.name_collaborator}</a>
            </Link>
          )}
        </>
      ),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("status", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending"
              : data?.status === "confirm"
              ? "text-confirm"
              : data?.status === "doing"
              ? "text-doing"
              : data?.status === "done"
              ? "text-done"
              : "text-cancel"
          }
        >
          {data?.status === "pending"
            ? `${i18n.t("pending", { lng: lang })}`
            : data?.status === "confirm"
            ? `${i18n.t("confirm", { lng: lang })}`
            : data?.status === "doing"
            ? `${i18n.t("doing", { lng: lang })}`
            : data?.status === "done"
            ? `${i18n.t("complete", { lng: lang })}`
            : `${i18n.t("cancel", { lng: lang })}`}
        </a>
      ),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("total_money", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => (
        <a className="text-money-order-customer">
          {formatMoney(data?.final_fee)}
        </a>
      ),
    },
  ];

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
        <Table
          columns={columns}
          dataSource={dataFilter.length > 0 ? dataFilter : data}
          pagination={false}
          // locale={{
          //   emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          // }}
          rowKey={(record) => record._id}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setItem(record);
              },
            };
          }}
          expandable={
            width <= 1200
              ? {
                  expandedRowRender: (record) => {
                    return (
                      <div className="div-plus">
                        <a>
                          {`${i18n.t("address", { lng: lang })}`}:{" "}
                          {record?.address}
                        </a>
                        <a>
                          {`${i18n.t("date_create", { lng: lang })}`}:{" "}
                          {moment(new Date(record?.date_create)).format(
                            "DD/MM/YYYY - HH:mm"
                          )}
                        </a>
                      </div>
                    );
                  },
                }
              : ""
          }
          scroll={{ x: width < 900 ? 900 : 0 }}
        />

        <div className="mt-2 div-pagination p-2">
          <a>Tổng: {total}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={total}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
