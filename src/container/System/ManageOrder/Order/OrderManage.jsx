import { StarFilled } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Pagination, Space, Table } from "antd";
import moment from "moment";
import React, { memo, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteOrderApi, getOrderApi } from "../../../../api/order";
import ModalCustom from "../../../../components/modalCustom";
import LoadingPagination from "../../../../components/paginationLoading";
import { formatMoney } from "../../../../helper/formatMoney";
import { errorNotify } from "../../../../helper/toast";
import { useCookies } from "../../../../helper/useCookies";
import useWindowDimensions from "../../../../helper/useWindowDimensions";
import { useWindowScrollPositions } from "../../../../helper/useWindowPosition";
import i18n from "../../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder";
import EditTimeOrder from "../EditTimeGroupOrder";
import "./OrderManage.scss";

const OrderManage = (props) => {
  const {
    data,
    total,
    status,
    kind,
    setData,
    setTotal,
    currentPage,
    setCurrentPage,
    setStartPage,
    startPage,
    type,
    startDate,
    endDate,
    valueSearch,
    city,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [item, setItem] = useState([]);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const { width } = useWindowDimensions();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const { scrollY } = useWindowScrollPositions();
  const [saveToCookie] = useCookies();
  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd = moment(new Date(data.date_work))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

  const deleteOrder = (id) => {
    setIsLoading(true);
    deleteOrderApi(id)
      .then((res) => {
        getOrderApi(
          valueSearch,
          startPage,
          20,
          status,
          kind,
          type,
          startDate,
          endDate,
          "",
          ""
        )
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
        setModal(false);
        setIsLoading(false);
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setIsLoading(false);
      });
  };

  const items =
    item?.status === "pending"
      ? [
          {
            key: "1",
            label: checkElement?.includes("add_collaborator_guvi_job") &&
              item?.status === "pending" && (
                <AddCollaboratorOrder
                  idOrder={item?._id}
                  idCustomer={item?.id_customer?._id}
                  status={item?.status}
                  type={status}
                  kind={kind}
                  startPage={startPage}
                  setData={setData}
                  setTotal={setTotal}
                  setIsLoading={setIsLoading}
                />
              ),
          },
          {
            key: "2",
            label: checkElement?.includes("detail_guvi_job") && (
              <Link to={`/details-order/${item?.id_group_order}`}>
                <p style={{ margin: 0 }}>{`${i18n.t("see_more", {
                  lng: lang,
                })}`}</p>
              </Link>
            ),
          },
          {
            key: "3",
            label: checkElement?.includes("edit_guvi_job") ? (
              <EditTimeOrder
                idOrder={item?._id}
                dateWork={item?.date_work}
                code={item?.code_promotion ? item?.code_promotion?.code : ""}
                status={status}
                kind={kind}
                startPage={startPage}
                setData={setData}
                setTotal={setTotal}
                setIsLoading={setIsLoading}
                details={false}
                estimate={item?.total_estimate}
                valueSearch={valueSearch}
                type={type}
                startDate={startDate}
                endDate={endDate}
              />
            ) : (
              ""
            ),
          },
        ]
      : [
          {
            key: "1",
            label: checkElement?.includes("detail_guvi_job") && (
              <Link to={`/details-order/${item?.id_group_order}`}>
                <p className="m-0">{`${i18n.t("see_more", { lng: lang })}`}</p>
              </Link>
            ),
          },
          {
            key: "2",
            label: checkElement?.includes("add_collaborator_guvi_job") &&
              item?.status === "confirm" && (
                <AddCollaboratorOrder
                  idOrder={item?._id}
                  idCustomer={item?.id_customer?._id}
                  status={item?.status}
                  type={status}
                  kind={kind}
                  startPage={startPage}
                  setData={setData}
                  setTotal={setTotal}
                  setIsLoading={setIsLoading}
                />
              ),
          },
          {
            key: "3",
            label:
              checkElement?.includes("delete_order_guvi_job") &&
              (item?.status === "cancel" || item?.status === "done" ? (
                <p className="m-0" onClick={toggle}>{`${i18n.t("delete", {
                  lng: lang,
                })}`}</p>
              ) : (
                ""
              )),
          },
        ];

  const columns = [
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("code_order", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <Link
            onClick={() => saveToCookie("order_scrolly", scrollY)}
            to={
              checkElement?.includes("detail_guvi_job")
                ? `/details-order/${data?.id_group_order}`
                : ""
            }
          >
            <p className="text-id-view-order">{data?.id_view}</p>
          </Link>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("date_create", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="div-create-order">
            <p className="text-create">
              {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
            </p>
            <p className="text-create">
              {moment(new Date(data?.date_create)).format("HH:mm")}
            </p>
          </div>
        );
      },
      responsive: ["xl"],
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("customer", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <Link to={`/profile-customer/${data?.id_customer?._id}`}>
            <div className="div-name-order-cutomer">
              <p className="text-name-customer">
                {data?.id_customer?.full_name}
              </p>
              <p className="text-phone-order-customer">
                {data?.id_customer?.phone}
              </p>
            </div>
          </Link>
        );
      },
      align: "left",

      // sorter: (a, b) =>
      //   a.id_customer.full_name.localeCompare(b.id_customer.full_name),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("service", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="div-service-order">
            <p className="text-service">
              {data?.type === "loop" && data?.is_auto_order
                ? `${i18n.t("repeat", { lng: lang })}`
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? `${i18n.t("cleaning", { lng: lang })}`
                : data?.service?._id?.kind === "giup_viec_co_dinh"
                ? `${i18n.t("cleaning_subscription", { lng: lang })}`
                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                ? `${i18n.t("serve", { lng: lang })}`
                : data?.service?._id?.kind === "ve_sinh_may_lanh"
                ? `${i18n.t("Máy lạnh", { lng: lang })}`
                : ""}
            </p>
            <p className="text-service">{timeWork(data)}</p>
          </div>
        );
      },
      align: "center",
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("date_work", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return (
          <div className="div-worktime-order">
            <p className="text-worktime">
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </p>
            <p className="text-worktime">
              {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
            </p>
          </div>
        );
      },
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("address", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => {
        return <p className="text-address-order">{data?.address}</p>;
      },
      responsive: ["xl"],
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("collaborator", {
            lng: lang,
          })}`}</p>
        );
      },
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <p className="text-pending-search">{`${i18n.t("searching", {
              lng: lang,
            })}`}</p>
          ) : (
            <Link
              to={`/details-collaborator/${data?.id_collaborator?._id}`}
              className="div-name-order"
            >
              <div className="div-name-star">
                <p className="text-collaborator">
                  {data?.id_collaborator?.full_name}
                </p>
                {data?.id_collaborator?.star && (
                  <div className="div-star">
                    <p className="text-star">{data?.id_collaborator?.star}</p>
                    <StarFilled className="icon-star" />
                  </div>
                )}
              </div>
              <p className="text-phone">{data?.id_collaborator?.phone}</p>
            </Link>
          )}
        </>
      ),
    },

    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("status", {
            lng: lang,
          })}`}</p>
        );
      },
      align: "center",
      render: (data) => (
        <p
          className={
            data?.status === "pending"
              ? "text-pen-order"
              : data?.status === "confirm"
              ? "text-confirm-order"
              : data?.status === "doing"
              ? "text-doing-order"
              : data?.status === "done"
              ? "text-done-order"
              : "text-cancel-order"
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
        </p>
      ),
    },
    {
      title: () => {
        return (
          <p className="title-column">{`${i18n.t("pay", {
            lng: lang,
          })}`}</p>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <div className="div-payment">
            <p className="text-payment-method">
              {data?.payment_method === "cash"
                ? `${i18n.t("cash", { lng: lang })}`
                : data?.payment_method === "point"
                ? `${i18n.t("wallet_gpay", { lng: lang })}`
                : ""}
            </p>
            <p className="text-payment-method">
              {formatMoney(data?.final_fee)}
            </p>
          </div>
        );
      },
      responsive: ["xl"],
    },
    {
      key: "action",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottomLeft"
            trigger={["click"]}
          >
            <div>
              <UilEllipsisV />
            </div>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    saveToCookie("page_order", page);
    const dataLength = data.length < 20 ? 20 : data.length;
    const start = page * dataLength - dataLength;
    setStartPage(start);
    saveToCookie("start_order", start);
    getOrderApi(
      valueSearch,
      start,
      20,
      status,
      kind,
      type,
      startDate,
      endDate,
      city,
      ""
    )
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  };

  return (
    <React.Fragment>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={data}
          pagination={false}
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
          scroll={{
            x: width <= 900 ? 900 : 0,
          }}
          expandable={
            width <= 1200
              ? {
                  expandedRowRender: (record) => {
                    return (
                      <div className="div-plus">
                        <div className="div-text-plus">
                          <p className="title-plus-order">
                            {`${i18n.t("address", { lng: lang })}`}:
                          </p>
                          <p className="text-plus-order">{record?.address}</p>
                        </div>
                        <div className="div-text-plus">
                          <p className="title-plus-order">
                            {`${i18n.t("date_create", { lng: lang })}`}:
                          </p>
                          <p className="text-plus-order">
                            {" "}
                            {moment(new Date(record?.date_create)).format(
                              "DD/MM/YYYY - HH:mm"
                            )}
                          </p>
                        </div>
                        <div className="div-text-plus">
                          <p className="title-plus-order">Dịch vụ:</p>
                          <p className="text-plus-order">
                            {record?.type === "loop" && record?.is_auto_order
                              ? `${i18n.t("repeat", { lng: lang })}`
                              : record?.service?._id?.kind ===
                                "giup_viec_theo_gio"
                              ? `${i18n.t("cleaning", { lng: lang })}`
                              : record?.service?._id?.kind ===
                                "giup_viec_co_dinh"
                              ? `${i18n.t("cleaning_subscription", {
                                  lng: lang,
                                })}`
                              : record?.service?._id?.kind ===
                                "phuc_vu_nha_hang"
                              ? `${i18n.t("serve", { lng: lang })}`
                              : ""}{" "}
                            / {timeWork(record)}
                          </p>
                        </div>
                        <div className="div-text-plus">
                          <p className="title-plus-order">Ngày làm:</p>
                          <p className="text-plus-order">
                            <p className="text-day">
                              {moment(new Date(record?.date_work))
                                .locale(lang)
                                .format("dddd")}
                            </p>
                            -{" "}
                            {moment(new Date(record?.date_work)).format(
                              "DD/MM/YYYY"
                            )}
                          </p>
                        </div>
                        <div className="div-text-plus">
                          <p className="title-plus-order">Thanh toán:</p>
                          <p className="text-plus-order">
                            {record?.payment_method === "cash"
                              ? `${i18n.t("cash", { lng: lang })}`
                              : record?.payment_method === "point"
                              ? `${i18n.t("wallet_gpay", { lng: lang })}`
                              : ""}
                          </p>
                        </div>
                        <div className="div-text-plus">
                          <p className="title-plus-order">CTV:</p>
                          <>
                            {!record?.id_collaborator ? (
                              <p className="text-plus-order">{`${i18n.t(
                                "searching",
                                {
                                  lng: lang,
                                }
                              )}`}</p>
                            ) : (
                              <Link
                                to={`/details-collaborator/${record?.id_collaborator?._id}`}
                              >
                                <p className="text-plus-order-ctv">
                                  {record?.id_collaborator?.full_name}
                                </p>
                              </Link>
                            )}
                          </>
                        </div>
                        <div className="div-text-plus">
                          <p className="title-plus-order">
                            {`${i18n.t("status", { lng: lang })}`}:
                          </p>
                          <p
                            className={
                              record?.status === "pending"
                                ? "text-pen-order"
                                : record?.status === "confirm"
                                ? "text-confirm-order"
                                : record?.status === "doing"
                                ? "text-doing-order"
                                : record?.status === "done"
                                ? "text-done-order"
                                : "text-cancel-order"
                            }
                          >
                            {record?.status === "pending"
                              ? `${i18n.t("pending", { lng: lang })}`
                              : record?.status === "confirm"
                              ? `${i18n.t("confirm", { lng: lang })}`
                              : record?.status === "doing"
                              ? `${i18n.t("doing", { lng: lang })}`
                              : record?.status === "done"
                              ? `${i18n.t("complete", { lng: lang })}`
                              : `${i18n.t("cancel", { lng: lang })}`}
                          </p>
                        </div>
                      </div>
                    );
                  },
                }
              : ""
          }
        />

        <div className="mt-2 div-pagination-order p-2">
          <a>
            {`${i18n.t("total", { lng: lang })}`}: {total}
          </a>
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

        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("delete_order", { lng: lang })}`}
            handleOk={() => deleteOrder(item?._id)}
            handleCancel={toggle}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            body={
              <>
                <a>{`${i18n.t("confirm_delete", { lng: lang })}`}</a>
                <a className="text-name-modal">{item?.id_view}</a>
              </>
            }
          />
        </div>
      </div>

      {isLoading && <LoadingPagination />}
    </React.Fragment>
  );
};

export default memo(OrderManage);
