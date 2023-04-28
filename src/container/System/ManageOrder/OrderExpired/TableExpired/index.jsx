import { Dropdown, Input, Pagination, Space, Table } from "antd";
import { UilEllipsisV } from "@iconscout/react-unicons";
import moment from "moment";
import "./index.scss";
import { formatDayVN } from "../../../../../helper/formatDayVN";
import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  getOrderExpiredApi,
  searchOrderExpiredApi,
} from "../../../../../api/order";
import { useSelector } from "react-redux";
import { getUser } from "../../../../../redux/selectors/auth";
import { SearchOutlined } from "@ant-design/icons";
import _debounce from "lodash/debounce";
import { vi } from "date-fns/locale";

const TableExpired = ({ status }) => {
  const [item, setItem] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const user = useSelector(getUser);
  const navigate = useNavigate();

  useEffect(() => {
    getOrderExpiredApi(0, 20, status)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItem);
      })
      .catch((err) => {});
  }, [status]);

  const timeWork = (data) => {
    const start = moment(new Date(data.date_work_schedule[0].date)).format(
      "HH:mm"
    );

    const timeEnd =
      Number(start?.slice(0, 2)) + data?.total_estimate + start?.slice(2, 5);

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
      title: "STT",
      render: (data, record, index) => <a>{index + 1}</a>,
      align: "center",
    },
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
      sorter: (a, b) =>
        a.id_customer.full_name.localeCompare(b.id_customer.full_name),
    },
    {
      title: "Dịch vụ",
      render: (data) => {
        return (
          <div className="div-service-expired">
            <a className="text-service">
              {data?.type === "schedule"
                ? "Cố định"
                : data?.type === "loop" && !data?.is_auto_order
                ? "Theo giờ"
                : data?.type === "loop" && data?.is_auto_order
                ? "Lặp lại"
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
      render: (data) => <p className="text-address-expired">{data?.address}</p>,
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

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataSearch.length > 0
        ? page * dataSearch.length - dataSearch.length
        : page * data.length - data.length;
    dataSearch?.length > 0
      ? searchOrderExpiredApi(start, 20, status, valueSearch).then((res) => {
          setDataSearch(res?.data);
          setTotalSearch(res?.totalItem);
        })
      : getOrderExpiredApi(start, 20, status)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItem);
          })
          .catch((err) => {});
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      searchOrderExpiredApi(0, 20, status, value).then((res) => {
        setDataSearch(res?.data);
        setTotalSearch(res?.totalItem);
      });
    }, 1000),
    [status]
  );

  return (
    <div>
      <div>
        <Input
          placeholder="Tìm kiếm"
          type="text"
          className="input-search-expired"
          value={valueSearch}
          prefix={<SearchOutlined />}
          onChange={(e) => {
            handleSearch(e.target.value);
            setValueSearch(e.target.value);
          }}
        />
      </div>
      <Table
        columns={columns}
        dataSource={dataSearch.length > 0 ? dataSearch : data}
        pagination={false}
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
  );
};

export default TableExpired;
