import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Card, CardFooter } from "reactstrap";
import { getOrder } from "../../../../redux/actions/order";

import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Empty, Pagination, Skeleton, Space, Table } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { getOrderApi, searchOrderApi } from "../../../../api/order";
import CustomTextInput from "../../../../components/CustomTextInput/customTextInput";
import { formatDayVN } from "../../../../helper/formatDayVN";
import "./OrderDoingManage.scss";

export default function OrderDoingManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [totalFilter, setTotalFilter] = useState();
  const [valueFilter, setValueFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();

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

  // const handleClick = useCallback(
  //   (e, index) => {
  //     e.preventDefault();
  //     setCurrentPage(index);
  //     const start =
  //       dataFilter.length > 0 ? index * dataFilter.length : index * data.length;

  //     dataFilter.length > 0 && search
  //       ? searchOrderApi(start, 10, valueFilter, "doing")
  //           .then((res) => {
  //             setDataFilter(res.data);
  //             setTotalFilter(res.totalItem);
  //           })
  //           .catch((err) => console.log(err))
  //       : dataFilter.length > 0
  //       ? filterOrderApi(start, 10, valueFilter)
  //           .then((res) => {
  //             setDataFilter(res.data);
  //           })
  //           .catch((err) => console.log(err))
  //       : getOrderApi(start > 0 ? start : 0, 10, "doing").then((res) => {
  //           setData(res.data);
  //           setTotal(res.totalItem);
  //         });
  //   },
  //   [valueFilter, dataFilter, data]
  // );

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

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * data.length - data.length;
    dispatch(
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
            dataSource={dataFilter.length > 0 ? dataFilter : data}
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
            <a>Tổng: {total}</a>
            <div>
              <Pagination
                current={currentPage}
                onChange={onChange}
                total={total}
                showSizeChanger={false}
              />
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
