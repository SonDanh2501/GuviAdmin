import { SearchOutlined } from "@ant-design/icons";
import { UilEllipsisV } from "@iconscout/react-unicons";
import { Dropdown, Pagination, Space, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getOrderApi } from "../../../../api/order";
import InputCustom from "../../../../components/textInputCustom";

import "./OrderDoingManage.scss";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

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
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    getOrderApi("", 0, 20, "doing", "", "", "", "", "")
      .then((res) => {
        setData(res.data);
        setTotal(res.totalItem);
      })
      .catch((err) => {});
  }, []);

  const timeWork = (data) => {
    const start = moment(new Date(data?.date_work)).format("HH:mm");

    const timeEnd = moment(new Date(data?.date_work))
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
            <a className="text-id-order-doing">{data?.id_view}</a>
          </Link>
        );
      },
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-create-doing">
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
      render: (data) => (
        <Link to={`/profile-customer/${data?.id_customer?._id}`}>
          <a className="text-name-doing">{data?.id_customer?.full_name}</a>
        </Link>
      ),
    },
    {
      title: `${i18n.t("service", { lng: lang })}`,
      render: (data) => {
        return (
          <div className="div-service">
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
          <div className="div-worktime-doing">
            <a className="text-worktime">
              {" "}
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
      title: `${i18n.t("address", { lng: lang })}`,
      render: (data) => <p className="text-address">{data?.address}</p>,
    },
    {
      title: `${i18n.t("collaborator", { lng: lang })}`,
      render: (data) => (
        <>
          {!data?.id_collaborator ? (
            <a>{`${i18n.t("searching", {
              lng: lang,
            })}`}</a>
          ) : (
            <Link to={`/details-collaborator/${data?.id_collaborator?._id}`}>
              <a className="text-collaborator">
                {data?.id_collaborator?.full_name}
              </a>
            </Link>
          )}
        </>
      ),
    },

    {
      title: `${i18n.t("status", { lng: lang })}`,
      render: (data) => (
        <a
          className={
            data?.status === "pending"
              ? "text-pending-doing"
              : data?.status === "confirm"
              ? "text-confirm-doing"
              : data?.status === "doing"
              ? "text-doing-doing"
              : data?.status === "done"
              ? "text-done-doing"
              : "text-cancel-doing"
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

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueSearch(value);
      getOrderApi(value, 0, 20, "doing", "", "", "", "", "")
        .then((res) => {
          setData(res.data);
          setTotal(res.totalItem);
        })
        .catch((err) => {});
    }, 1000),
    []
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data?.length < 20 ? 20 : data.length;

    const start = page * dataLength - dataLength;

    setStartPage(start);

    getOrderApi(valueSearch, 0, 20, "doing", "", "", "", "", "")
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
          <a className="title-cv">{`${i18n.t("work_list", { lng: lang })}`}</a>

          <InputCustom
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            className="field-search"
            onChange={(e) => handleSearch(e.target.value)}
            prefix={<SearchOutlined />}
          />
        </div>
        <div className="shadow mt-5">
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
      </div>
    </React.Fragment>
  );
};

export default memo(OrderDoingManage);
