import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  CardFooter,
  Pagination,
  PaginationItem,
  PaginationLink,
} from "reactstrap";
import { getOrder } from "../../../../redux/actions/order";

import "./OrderManage.scss";
import { Empty, Skeleton, Space, Table, Dropdown } from "antd";
import { filterOrderApi, searchOrderApi } from "../../../../api/order";
import { formatDayVN } from "../../../../helper/formatDayVN";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { UilEllipsisV } from "@iconscout/react-unicons";

export default function OrderManage({ data, total }) {
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [valueFilter, setValueFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

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
      dataIndex: "_id",
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
      dataIndex: ["id_customer", "name"],
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service">
            <a className="text-service">{data?.service?._id?.title?.vi}</a>
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
              {data?.id_collaborator?.name}
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
          >
            <div>
              <UilEllipsisV />
            </div>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const handleClick = useCallback(
    (e, index) => {
      e.preventDefault();
      setCurrentPage(index);
      const start =
        dataFilter.length > 0 ? index * dataFilter.length : index * data.length;

      dataFilter.length > 0 && search
        ? searchOrderApi(start, 10, valueFilter)
            .then((res) => {
              setDataFilter(res.data);
              setTotalFilter(res.totalItem);
            })
            .catch((err) => console.log(err))
        : dataFilter.length > 0
        ? filterOrderApi(start, 10, valueFilter)
            .then((res) => {
              setDataFilter(res.data);
            })
            .catch((err) => console.log(err))
        : dispatch(
            getOrder.getOrderRequest({
              start: start > 0 ? start : 0,
              length: 10,
            })
          );
    },
    [valueFilter, dataFilter, data]
  );

  const pageCount = dataFilter.length > 0 ? totalFilter / 10 : total / 10;
  let pageNumbers = [];
  for (let i = 0; i < pageCount; i++) {
    pageNumbers.push(
      <PaginationItem key={i} active={currentPage === i ? true : false}>
        <PaginationLink onClick={(e) => handleClick(e, i)} href="#">
          {i + 1}
        </PaginationLink>
      </PaginationItem>
    );
  }

  const handlefilter = useCallback((value) => {
    setSearch(false);
    setValueFilter(value);
    if (value === "filter") {
      dispatch(getOrder.getOrderRequest({ start: 0, length: 10 }));
      setDataFilter([]);
    } else {
      filterOrderApi(0, 10, value)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
    }
  }, []);

  const handleSearch = useCallback((value) => {
    setValueFilter(value);
    setSearch(true);
    searchOrderApi(0, 10, value)
      .then((res) => {
        setDataFilter(res.data);
        setTotalFilter(res.totalItem);
      })
      .catch((err) => console.log(err));
  }, []);

  return (
    <React.Fragment>
      <div>
        <Table
          columns={columns}
          dataSource={dataFilter.length > 0 ? dataFilter : data}
          pagination={false}
          locale={{
            emptyText: data.length > 0 ? <Empty /> : <Skeleton active={true} />,
          }}
          rowKey={(record) => record._id}
          rowSelection={{
            selectedRowKeys,
            onChange: (selectedRowKeys, selectedRows) => {
              setSelectedRowKeys(selectedRowKeys);
            },
          }}
        />

        <div className="mt-2">
          <p>Tổng: {total}</p>
          <Pagination
            className="pagination justify-content-end mb-0"
            listClassName="justify-content-end mb-0"
          >
            <PaginationItem
              className={currentPage === 0 ? "disabled" : "enable"}
            >
              <PaginationLink
                onClick={(e) => handleClick(e, currentPage - 1)}
                href="#"
              >
                <i class="uil uil-previous"></i>
              </PaginationLink>
            </PaginationItem>
            {pageNumbers}
            <PaginationItem disabled={currentPage >= pageCount - 1}>
              <PaginationLink
                onClick={(e) => handleClick(e, currentPage + 1)}
                href="#"
              >
                <i class="uil uil-step-forward"></i>
              </PaginationLink>
            </PaginationItem>
          </Pagination>
        </div>
      </div>
    </React.Fragment>
  );
}
