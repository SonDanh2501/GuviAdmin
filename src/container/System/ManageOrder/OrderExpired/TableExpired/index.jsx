import { Dropdown, Input, Pagination, Space, Table } from "antd";
import { UilEllipsisV } from "@iconscout/react-unicons";
import moment from "moment";
import "./index.scss";
import { formatDayVN } from "../../../../../helper/formatDayVN";
import { Link, useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  getOrderExpiredApi,
  searchOrderExpiredApi,
} from "../../../../../api/order";
import { useSelector } from "react-redux";
import { getLanguageState, getUser } from "../../../../../redux/selectors/auth";
import { SearchOutlined } from "@ant-design/icons";
import _debounce from "lodash/debounce";
import { vi } from "date-fns/locale";
import i18n from "../../../../../i18n";

const TableExpired = ({ status }) => {
  const [item, setItem] = useState([]);
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(1);
  const [dataSearch, setDataSearch] = useState([]);
  const [totalSearch, setTotalSearch] = useState(0);
  const [valueSearch, setValueSearch] = useState("");
  const lang = useSelector(getLanguageState);
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
          {`${i18n.t("see_more", { lng: lang })}`}
        </a>
      ),
    },
  ];

  const columns = [
    {
      title: `${i18n.t("code_order", { lng: lang })}`,
      render: (data) => {
        return (
          <Link to={`/details-order/${data?._id}`}>
            <a className="text-id-expire">{data?.id_view}</a>
          </Link>
        );
      },
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create-expire">
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
      title: `${i18n.t("customer", { lng: lang })}`,
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
      sorter: (a, b) =>
        a.id_customer.full_name.localeCompare(b.id_customer.full_name),
    },
    {
      title: `${i18n.t("service", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-service-expired">
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
      title: `${i18n.t("date_work", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-worktime-expire">
            <a className="text-worktime">
              {" "}
              {moment(new Date(data.date_work_schedule[0].date)).format(
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
      title: `${i18n.t("address", { lng: lang })}`,
      render: (data) => <p className="text-address-expired">{data?.address}</p>,
    },
    // {
    //   title: "Cộng tác viên",
    //   render: (data) => (
    //     <>
    //       {!data?.id_collaborator ? (
    //         <a className="text-name-customer ">Đang tìm kiếm</a>
    //       ) : (
    //         <Link
    //           to={`/details-collaborator/${data?.id_collaborator?._id}`}
    //           className="div-name-order"
    //         >
    //           <a className="text-collaborator">
    //             {data?.id_collaborator?.full_name}
    //           </a>
    //           {user?.role !== "support_customer" && (
    //             <a className="text-phone">{data?.id_collaborator?.phone}</a>
    //           )}
    //         </Link>
    //       )}
    //     </>
    //   ),
    // },

    {
      title: `${i18n.t("status", { lng: lang })}`,
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
    const dataLength = data?.length < 20 ? 20 : data.length;
    const searchLength = dataSearch?.length < 20 ? 20 : dataSearch.length;
    const start =
      dataSearch.length > 0
        ? page * searchLength - searchLength
        : page * dataLength - dataLength;

    setStartPage(start);
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
          placeholder={`${i18n.t("pending", { lng: lang })}`}
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
        <a>
          {`${i18n.t("total", { lng: lang })}`}:{" "}
          {totalSearch > 0 ? totalSearch : total}
        </a>
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
