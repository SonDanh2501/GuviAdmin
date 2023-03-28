import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getOrder, searchOrder } from "../../../../redux/actions/order";

import { UilEllipsisV } from "@iconscout/react-unicons";
import {
  Dropdown,
  Empty,
  Input,
  Pagination,
  Skeleton,
  Space,
  Table,
} from "antd";
import moment from "moment";
import vi from "moment/locale/vi";
import { useNavigate } from "react-router-dom";
import "./OrderManage.scss";
import { deleteOrderApi, searchOrderApi } from "../../../../api/order";
import EditOrder from "../DrawerEditOrder";
import AddCollaboratorOrder from "../DrawerAddCollaboratorToOrder";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { loadingAction } from "../../../../redux/actions/loading";
import { errorNotify } from "../../../../helper/toast";
import { getUser } from "../../../../redux/selectors/auth";
import { SearchOutlined } from "@ant-design/icons";
import _debounce from "lodash/debounce";

export default function OrderManage(props) {
  const {
    data,
    total,
    status,
    // dataSearch,
    // value,
    kind,
    // setDataSearch,
    // setTotalSearch,
  } = props;
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [item, setItem] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(getUser);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const toggle = () => setModal(!modal);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const deleteOrder = (id) => {
    dispatch(loadingAction.loadingRequest(true));
    deleteOrderApi(id)
      .then((res) => {
        dispatch(
          getOrder.getOrderRequest({
            start: 0,
            length: 20,
            status: status,
            kind: kind,
          })
        );
        setModal(false);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        setModal(false);
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const items = [
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
    {
      key: "3",
      label:
        user?.role === "admin" &&
        (item?.status === "cancel" || item?.status === "done" ? (
          <a onClick={toggle}>Xoá</a>
        ) : (
          ""
        )),
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
            {data?.id_view}
          </a>
        );
      },
    },
    {
      title: "Ngày tạo",
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
    },
    {
      title: "Tên khách hàng",
      // dataIndex: ["id_customer", "full_name"],
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/profile-customer", {
                state: { id: data?.id_customer?._id },
              })
            }
            className="div-name-order-cutomer"
          >
            <a className="text-name-customer">{data?.id_customer?.full_name}</a>
            <a className="text-phone-order-customer">
              {data?.id_customer?.phone}
            </a>
          </div>
        );
      },
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service-order">
            <a className="text-service">
              {data?.type === "schedule"
                ? "Giúp việc cố định"
                : data?.type === "loop" && !data?.is_auto_order
                ? "Giúp việc theo giờ"
                : data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại hàng tuần"
                : ""}
            </a>
            <a className="text-service">{timeWork(data)}</a>
          </div>
        );
      },
    },
    {
      title: "Ngày làm",
      render: (data) => {
        return (
          <div className="div-worktime-order">
            <a className="text-worktime">
              {moment(new Date(data?.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-worktime">
              {moment(new Date(data?.date_work_schedule[0].date))
                .locale("vi", vi)
                .format("dddd")}
            </a>
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      render: (data) => {
        return <a className="text-address-order">{data?.address}</a>;
      },
    },
    {
      title: "Cộng tác viên",
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a className="text-name-customer ">Đang tìm kiếm</a>
          ) : (
            <div
              onClick={() => {
                if (user?.role !== "support_customer") {
                  navigate("/group-order/manage-order/details-collaborator", {
                    state: { id: data?.id_collaborator?._id },
                  });
                }
              }}
              className="div-name-order"
            >
              <a className="text-collaborator">
                {data?.id_collaborator?.full_name}
              </a>
              {user?.role !== "support_customer" && (
                <a className="text-phone">{data?.id_collaborator?.phone}</a>
              )}
            </div>
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
      title: "Thanh toán",
      render: (data) => {
        return (
          <a className="text-payment-method">
            {data?.payment_method === "cash"
              ? "Tiền mặt"
              : data?.payment_method === "point"
              ? "Ví G-pay"
              : ""}
          </a>
        );
      },
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
      ? searchOrderApi(0, 20, status, valueSearch, kind).then((res) => {
          setDataSearch(res?.data);
          setTotalSearch(res?.totalItem);
        })
      : dispatch(
          getOrder.getOrderRequest({
            start: start > 0 ? start : 0,
            length: 20,
            status: status,
            kind: kind,
          })
        );
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      searchOrderApi(0, 20, status, value, kind).then((res) => {
        setDataSearch(res?.data);
        setTotalSearch(res?.totalItem);
      });
    }, 1000),
    [status, kind]
  );
  return (
    <React.Fragment>
      <div>
        <Input
          placeholder="Tìm kiếm"
          type="text"
          className="field-search"
          value={valueSearch}
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
            setValueSearch(e.target.value);
          }}
        />
      </div>
      <div className="mt-3">
        <Table
          columns={columns}
          dataSource={dataSearch?.length > 0 ? dataSearch : data}
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
        />

        <div className="mt-2 div-pagination p-2">
          <a>Tổng: {totalSearch > 0 ? totalSearch : total}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={totalSearch > 0 ? totalSearch : total}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>

        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa đơn hàng</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa đơn hàng{" "}
                <a className="text-name-modal">{item?.id_view}</a> này không?
              </a>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => deleteOrder(item?._id)}>
                Có
              </Button>
              <Button color="#ddd" onClick={toggle}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </React.Fragment>
  );
}
