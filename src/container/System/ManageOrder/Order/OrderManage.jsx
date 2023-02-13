import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getOrder, searchOrder } from "../../../../redux/actions/order";

import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Empty, Pagination, Skeleton, Space, Table } from "antd";
import moment from "moment";
import vi from "moment/locale/vi";
import { useNavigate } from "react-router-dom";
import "./OrderManage.scss";
import { searchOrderApi } from "../../../../api/order";
import EditOrder from "../DrawerEditOrder";
import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder";

export default function OrderManage(props) {
  const { data, total, status, dataSearch, value } = props;
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [item, setItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const items = [
    // {
    //   key: "1",
    //   label: <EditOrder id={item?._id} />,
    // },
    {
      key: "1",
      label:
        item?.status === "pending" ? (
          <AddCollaboratorOrder idOrder={item?._id} />
        ) : (
          <></>
        ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={() =>
            navigate("/details-order", {
              state: { id: item?._id },
            })
          }
        >
          Xem chi tiết
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: "Mã",
      render: (data) => {
        return (
          <a
            className="text-id"
            onClick={() =>
              navigate("/details-order", {
                state: { id: data?._id },
              })
            }
          >
            {data?._id}
          </a>
        );
      },
    },
    {
      title: "Ngày tạo",
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
    },
    {
      title: "Tên khách hàng",
      // dataIndex: ["id_customer", "full_name"],
      render: (data) => {
        return (
          <a
            onClick={() =>
              navigate("/group-order/manage-order/details-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
          >
            {data?.id_customer?.full_name}
          </a>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">
              {data?.service?._id?.kind === "giup_viec_co_dinh"
                ? "Giúp việc cố định"
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? "Giúp việc theo giờ"
                : "Tổng vệ sinh"}{" "}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-worktime">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work))
                .locale("vi", vi)
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => <p className="text-address">{data?.address}</p>,
    },
    {
      title: "Cộng tác viên",
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a>Đang tìm kiếm</a>
          ) : (
            <a
              onClick={() =>
                navigate("/group-order/manage-order/details-collaborator", {
                  state: { id: data?.id_collaborator?._id },
                })
              }
              className="text-collaborator"
            >
              {data?.id_collaborator?.full_name}
            </a>
          )}
        </>
      ),
    },

    {
      title: "Trạng thái",
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending-order"
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
            ? "Đang chờ làm"
            : data?.status === "confirm"
            ? "Đã nhận"
            : data?.status === "doing"
            ? "Đang làm"
            : data?.status === "done"
            ? "Hoàn thành"
            : "Đã huỷ"}
        </a>
      ),
    },
    {
      key: "action",
      render: (data) => (
        <Space size="middle">
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
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
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;
    dataSearch.length > 0
      ? dispatch(
          searchOrder.searchOrderRequest({
            start: start,
            length: 20,
            status: status,
            value: value,
          })
        )
      : dispatch(
          getOrder.getOrderRequest({
            start: start > 0 ? start : 0,
            length: 20,
            status: status,
          })
        );
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
