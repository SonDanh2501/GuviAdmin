import { SearchOutlined, StarFilled } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Checkbox, Dropdown, Input, Pagination, Space, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  checkOrderApi,
  deleteOrderApi,
  getOrderApi,
} from "../../../../api/order";
import ModalCustom from "../../../../components/modalCustom";
import LoadingPagination from "../../../../components/paginationLoading";
import { errorNotify } from "../../../../helper/toast";
import i18n from "../../../../i18n";
import {
  getElementState,
  getLanguageState,
  getUser,
} from "../../../../redux/selectors/auth";
import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder";
import EditTimeOrder from "../EditTimeGroupOrder";
import "./OrderManage.scss";
const width = window.innerWidth;
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
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [item, setItem] = useState([]);
  const [modal, setModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
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
          endDate
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
                <a>{`${i18n.t("see_more", { lng: lang })}`}</a>
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
                <a>{`${i18n.t("see_more", { lng: lang })}`}</a>
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
                <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
              ) : (
                ""
              )),
          },
        ];

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
          <Link
            to={
              checkElement?.includes("detail_guvi_job")
                ? `/details-order/${data?.id_group_order}`
                : ""
            }
          >
            <a className="text-id-view-order">{data?.id_view}</a>
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
          <div className="div-create-order">
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
          <a className="title-column">{`${i18n.t("customer", {
            lng: lang,
          })}`}</a>
        );
      },
      render: (data) => {
        return (
          <Link
            to={`/profile-customer/${data?.id_customer?._id}`}
            className="div-name-order-cutomer"
          >
            <a className="text-name-customer">{data?.id_customer?.full_name}</a>
            <a className="text-phone-order-customer">
              {data?.id_customer?.phone}
            </a>
          </Link>
        );
      },
      // sorter: (a, b) =>
      //   a.id_customer.full_name.localeCompare(b.id_customer.full_name),
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
          <div className="div-service-order">
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
          <div className="div-worktime-order">
            <a className="text-worktime">
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work)).locale(lang).format("dddd")}
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
      render: (data) => {
        return <a className="text-address-order">{data?.address}</a>;
      },
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
            <a className="text-pending-search">{`${i18n.t("searching", {
              lng: lang,
            })}`}</a>
          ) : (
            <Link
              to={`/details-collaborator/${data?.id_collaborator?._id}`}
              className="div-name-order"
            >
              <div className="div-name-star">
                <a className="text-collaborator">
                  {data?.id_collaborator?.full_name}
                </a>
                {data?.id_collaborator?.star && (
                  <div className="div-star">
                    <a className="text-star">{data?.id_collaborator?.star}</a>
                    <StarFilled className="icon-star" />
                  </div>
                )}
              </div>
              <a className="text-phone">{data?.id_collaborator?.phone}</a>
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
      align: "center",
      render: (data) => (
        <a
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
        </a>
      ),
    },
    {
      title: () => {
        return (
          <a className="title-column">{`${i18n.t("pay", {
            lng: lang,
          })}`}</a>
        );
      },
      align: "center",
      render: (data) => {
        return (
          <a className="text-payment-method">
            {data?.payment_method === "cash"
              ? `${i18n.t("cash", { lng: lang })}`
              : data?.payment_method === "point"
              ? `${i18n.t("wallet_gpay", { lng: lang })}`
              : ""}
          </a>
        );
      },
    },
    {
      key: "action",
      width: "5%",
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
    const dataLength = data.length < 20 ? 20 : data.length;

    const start = page * dataLength - dataLength;

    setStartPage(start);

    getOrderApi(start, 20, status, kind, type, startDate, endDate)
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
          scroll={
            width <= 490
              ? {
                  x: 1600,
                }
              : null
          }
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
