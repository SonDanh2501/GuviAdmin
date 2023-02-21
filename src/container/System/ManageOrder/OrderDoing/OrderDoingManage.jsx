import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardFooter } from "reactstrap";
import { getOrder } from "../../../../redux/actions/order";
import _debounce from "lodash/debounce";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Empty, Pagination, Skeleton, Space, Table } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getOrderApi, searchOrderApi } from "../../../../api/order";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { formatDayVN } from "../../../../helper/formatDayVN";
import "./OrderDoingManage.scss";

export default function OrderDoingManage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [valueSearch, setValueSearch] = useState("");

  useEffect(() => {
    getOrderApi(0, 10, "doing").then((res) => {
      setData(res.data);
      setTotal(res.totalItem);
    });
  }, []);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work)).format("HH:mm");

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

    return start + " - " + timeEnd;
  };

  const items = [
    {
      key: "1",
      label: <a>Chỉnh sửa</a>,
    },
    {
      key: "2",
      label: <a>Xem chi tiết</a>,
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
      dataIndex: ["id_customer", "full_name"],
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service">
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
      title: "Thời gian",
      render: (data) => {
        return (
          <div className="div-worktime">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data?.date_work)).format("DD/MM/YYYY")}
            </a>
            <a className="text-worktime">
              {formatDayVN(
                moment(new Date(data?.date_work)).format("DD/MM/YYYY")
              )}
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
          >
            <div>
              <UilEllipsisV />
            </div>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      searchOrderApi(0, 10, value, "doing")
        .then((res) => {
          setDataSearch(res.data);
          setTotalSearch(res.totalItem);
        })
        .catch((err) => console.log(err));
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;
    dataSearch.length > 0
      ? searchOrderApi(0, 10, valueSearch, "doing")
          .then((res) => {
            setDataSearch(res.data);
            setTotalSearch(res.totalItem);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getOrder.getOrderRequest({
            start: start > 0 ? start : 0,
            length: 10,
            status: "doing",
          })
        );
  };

  return (
    <React.Fragment>
      <div className="mt-5 m-3">
        <div className="div-header">
          <a className="title-cv">Danh sách công việc</a>
          <CustomTextInput
            placeholder="Tìm kiếm"
            type="text"
            className="field-search"
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
        <div className="shadow">
          <Table
            columns={columns}
            dataSource={dataSearch.length > 0 ? dataSearch : data}
            pagination={false}
            // locale={{
            //   emptyText:
            //     data.length > 0 ? <Empty /> : <Skeleton active={true} />,
            // }}
            rowKey={(record) => record._id}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedRowKeys, selectedRows) => {
                setSelectedRowKeys(selectedRowKeys);
              },
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
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
