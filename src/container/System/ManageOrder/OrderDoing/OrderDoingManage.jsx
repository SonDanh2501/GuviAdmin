import React, { memo, useCallback, useEffect, useState } from "react";
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

const OrderDoingManage = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [total, setTotal] = useState();
  const [valueSearch, setValueSearch] = useState("");
  const [item, setItem] = useState([]);

  useEffect(() => {
    getOrderApi(0, 10, "doing", "")
      .then((res) => {
        setData(res.data);
        setTotal(res.totalItem);
      })
      .catch((err) => {});
  }, []);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd = moment(new Date(data.date_work_schedule[0].date))
      .add(data?.total_estimate, "hours")
      .format("HH:mm");

    return start + " - " + timeEnd;
  };

  const items = [
    {
      key: "1",
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
              {data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại"
                : data?.service?._id?.kind === "giup_viec_theo_gio"
                ? "Theo giờ"
                : data?.service?._id?.kind === "giup_viec_co_dinh"
                ? "Cố định"
                : data?.service?._id?.kind === "phuc_vu_nha_hang"
                ? "Phục vụ"
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
          <div className="div-worktime">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data.date_work_schedule[0].date)).format(
                "DD/MM/YYYY"
              )}
            </a>
            <a className="text-worktime">
              {formatDayVN(
                moment(new Date(data.date_work_schedule[0].date)).format(
                  "DD/MM/YYYY"
                )
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
        .catch((err) => {});
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;

    setStartPage(start);

    dataSearch.length > 0
      ? searchOrderApi(start, 10, valueSearch, "doing")
          .then((res) => {
            setDataSearch(res.data);
            setTotalSearch(res.totalItem);
          })
          .catch((err) => {})
      : getOrderApi(start, 10, "doing", "")
          .then((res) => {
            setData(res.data);
            setTotal(res.totalItem);
          })
          .catch((err) => {});
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
        </div>
      </div>
    </React.Fragment>
  );
};

export default memo(OrderDoingManage);
