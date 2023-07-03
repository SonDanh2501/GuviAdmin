import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Dropdown,
  Empty,
  FloatButton,
  Image,
  Input,
  Pagination,
  Skeleton,
  Space,
  Table,
} from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { Link, useNavigate } from "react-router-dom";
import {
  activeCustomer,
  deleteCustomer,
  fetchCustomers,
  searchCustomers,
} from "../../../../../api/customer";
import AddCustomer from "../../../../../components/addCustomer/addCustomer";
import ModalCustom from "../../../../../components/modalCustom";
import LoadingPagination from "../../../../../components/paginationLoading";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import member from "../../../../../assets/images/iconMember.svg";
import silver from "../../../../../assets/images/iconSilver.svg";
import gold from "../../../../../assets/images/iconGold.svg";
import platinum from "../../../../../assets/images/iconPlatinum.svg";
import "./UserManage.scss";
import i18n from "../../../../../i18n";
const width = window.innerWidth;

const UserManage = (props) => {
  const { status } = props;
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [hidePhone, setHidePhone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowIndex, setRowIndex] = useState();
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [conditionFilter, setConditionFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rank, setRank] = useState("");
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    fetchCustomers(lang, 0, 50, status)
      .then((res) => {
        setData(res?.data);
        setTotal(res?.totalItems);
      })
      .catch((err) => {});
    setCurrentPage(1);
    setStartPage(0);
  }, [status]);

  const onDelete = useCallback(
    (id) => {
      setIsLoading(true);
      deleteCustomer(id, { is_delete: true })
        .then((res) => {
          fetchCustomers(lang, startPage, 50, status)
            .then((res) => {
              setData(res?.data);
              setTotal(res?.totalItems);
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
    },
    [status, startPage]
  );

  const blockCustomer = useCallback(
    (id, is_active) => {
      setIsLoading(true);
      if (is_active === true) {
        activeCustomer(id, { is_active: false })
          .then((res) => {
            setModalBlock(false);
            fetchCustomers(lang, startPage, 50, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
            setIsLoading(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      } else {
        activeCustomer(id, { is_active: true })
          .then((res) => {
            setModalBlock(false);
            setIsLoading(false);
            fetchCustomers(lang, startPage, 50, status)
              .then((res) => {
                setData(res?.data);
                setTotal(res?.totalItems);
              })
              .catch((err) => {});
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      }
    },
    [startPage, status]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength = data.length < 50 ? 50 : data.length;
    const filterLength = dataFilter.length < 50 ? 50 : dataFilter.length;

    const start =
      dataFilter.length > 0
        ? page * filterLength - filterLength
        : page * dataLength - dataLength;

    setStartPage(start);

    dataFilter.length > 0
      ? searchCustomers(start, 50, status, valueFilter)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItems);
          })
          .catch((err) => {})
      : fetchCustomers(lang, start, 50, status)
          .then((res) => {
            setData(res?.data);
            setTotal(res?.totalItems);
          })
          .catch((err) => {});
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueFilter(value);
      setIsLoading(true);
      searchCustomers(0, 50, status, value)
        .then((res) => {
          setIsLoading(false);
          setDataFilter(res.data);
          setTotalFilter(res.totalItems);
        })
        .catch((err) => {
          setIsLoading(false);
        });
    }, 1000),
    []
  );

  const items = [
    {
      key: "1",
      label: (
        <a onClick={toggleBlock}>
          {itemEdit?.is_active === true
            ? `${i18n.t("lock", { lng: lang })}`
            : `${i18n.t("unlock", { lng: lang })}`}
        </a>
      ),
    },
    {
      key: "2",
      label: checkElement?.includes("delete_customer") && (
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
  ];

  const columns =
    status === "birthday"
      ? [
          {
            title: `${i18n.t("code_customer", { lng: lang })}`,
            render: (data) => {
              return (
                <Link
                  to={
                    checkElement?.includes("detail_customer")
                      ? `/profile-customer/${data?._id}`
                      : ""
                  }
                >
                  <a className="text-id-customer"> {data?.id_view}</a>
                </Link>
              );
            },
          },
          {
            title: `${i18n.t("customer", { lng: lang })}`,
            render: (data) => {
              return (
                <Link
                  to={
                    checkElement?.includes("detail_customer")
                      ? `/profile-customer/${data?._id}`
                      : ""
                  }
                  className="div-name-customer"
                >
                  <img
                    src={
                      data?.rank_point < 100
                        ? member
                        : data?.rank_point >= 100 && data?.rank_point < 300
                        ? silver
                        : data?.rank_point >= 300 && data?.rank_point < 1500
                        ? gold
                        : platinum
                    }
                    style={{ width: 20, height: 20 }}
                  />
                  <a className="text-name-customer"> {data?.full_name}</a>
                </Link>
              );
            },
            sorter: true,
          },
          {
            title: `${i18n.t("phone", { lng: lang })}`,
            render: (data, record, index) => {
              const phone = data?.phone.slice(0, 7);
              return (
                <div className="hide-phone">
                  <a className="text-phone-customer">
                    {rowIndex === index
                      ? hidePhone
                        ? data?.phone
                        : phone + "***"
                      : phone + "***"}
                  </a>
                  <a
                    className="btn-eyes"
                    onClick={() =>
                      rowIndex === index
                        ? setHidePhone(!hidePhone)
                        : setHidePhone(!hidePhone)
                    }
                  >
                    {rowIndex === index ? (
                      hidePhone ? (
                        <i class="uil uil-eye"></i>
                      ) : (
                        <i class="uil uil-eye-slash"></i>
                      )
                    ) : (
                      <i class="uil uil-eye-slash"></i>
                    )}
                  </a>
                </div>
              );
            },
          },

          {
            title: `${i18n.t("birthday", { lng: lang })}`,
            render: (data) => {
              return (
                <a className="text-birtday-customer">
                  {moment(new Date(data?.birthday)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: `${i18n.t("kind_member", { lng: lang })}`,
            render: (data) => {
              if (data?.rank_point >= 0 && data?.rank_point < 100) {
                setRank(`${i18n.t("member", { lng: lang })}`);
              } else if (data?.rank_point >= 100 && data?.rank_point < 300) {
                setRank(`${i18n.t("silver", { lng: lang })}`);
              } else if (data?.rank_point >= 300 && data?.rank_point < 1500) {
                setRank(`${i18n.t("gold", { lng: lang })}`);
              } else {
                setRank(`${i18n.t("platinum", { lng: lang })}`);
              }
              return <a className="text-address-customer">{rank}</a>;
            },
          },
          {
            title: `${i18n.t("total_order", { lng: lang })}`,
            render: (data) => (
              <a className="text-address-customer">{data?.total_order}</a>
            ),

            align: "center",
            responsive: ["xl"],
          },
          {
            title: `${i18n.t("nearest_order", { lng: lang })}`,
            render: (data) => {
              return (
                <>
                  {data?.id_group_order ? (
                    <Link to={`/details-order/${data?.id_group_order}`}>
                      <a className="text-id-order">
                        {data?.id_view_group_order}
                      </a>
                    </Link>
                  ) : (
                    <a className="text-address-customer">{`${i18n.t(
                      "not_available",
                      { lng: lang }
                    )}`}</a>
                  )}
                </>
              );
            },

            align: "center",
          },
          {
            title: `${i18n.t("total", { lng: lang })}`,
            fixed: "right",
            width: "10%",
            render: (data) => (
              <a className="text-address-customer">
                {formatMoney(data?.total_price)}
              </a>
            ),
            align: "right",
            responsive: ["xl"],
          },
          {
            key: "action",
            fixed: "right",
            align: "center",
            width: "5%",
            render: (data) => (
              <Space size="middle">
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <a>
                    <MoreOutlined className="icon-more" />
                  </a>
                </Dropdown>
              </Space>
            ),
          },
        ]
      : [
          {
            title: `${i18n.t("code_customer", { lng: lang })}`,
            render: (data) => {
              return (
                <Link
                  to={
                    checkElement?.includes("detail_customer")
                      ? `/profile-customer/${data?._id}`
                      : ""
                  }
                >
                  <a className="text-id-customer"> {data?.id_view}</a>
                </Link>
              );
            },
          },
          {
            title: `${i18n.t("customer", { lng: lang })}`,
            render: (data) => {
              return (
                <Link
                  to={
                    checkElement?.includes("detail_customer")
                      ? `/profile-customer/${data?._id}`
                      : ""
                  }
                  className="div-name-customer"
                >
                  <img
                    src={
                      data?.rank_point < 100
                        ? member
                        : data?.rank_point >= 100 && data?.rank_point < 300
                        ? silver
                        : data?.rank_point >= 300 && data?.rank_point < 1500
                        ? gold
                        : platinum
                    }
                    style={{ width: 20, height: 20 }}
                  />
                  <a className="text-name-customer"> {data?.full_name}</a>
                </Link>
              );
            },
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
          },
          {
            title: `${i18n.t("phone", { lng: lang })}`,
            render: (data, record, index) => {
              const phone = data?.phone.slice(0, 7);
              return (
                <div className="hide-phone">
                  <a className="text-phone-customer">
                    {rowIndex === index
                      ? hidePhone
                        ? data?.phone
                        : phone + "***"
                      : phone + "***"}
                  </a>
                  <a
                    className="btn-eyes"
                    onClick={() =>
                      rowIndex === index
                        ? setHidePhone(!hidePhone)
                        : setHidePhone(!hidePhone)
                    }
                  >
                    {rowIndex === index ? (
                      hidePhone ? (
                        <i class="uil uil-eye"></i>
                      ) : (
                        <i class="uil uil-eye-slash"></i>
                      )
                    ) : (
                      <i class="uil uil-eye-slash"></i>
                    )}
                  </a>
                </div>
              );
            },
          },
          {
            title: `${i18n.t("address", { lng: lang })}`,
            render: (data) => {
              const address = data?.default_address?.address.split(",");
              return (
                <a className="text-address-customer-default">
                  {!data?.default_address
                    ? `${i18n.t("not_available", { lng: lang })}`
                    : address[address.length - 2] +
                      "," +
                      address[address.length - 1]}
                </a>
              );
            },

            responsive: ["xl"],
          },
          {
            title: `${i18n.t("date_create", { lng: lang })}`,
            render: (data) => {
              return (
                <div className="div-create">
                  <a className="text-create-customer">
                    {moment(new Date(data?.date_create)).format("DD/MM/YYYY")}
                  </a>
                  <a className="text-create-customer">
                    {moment(new Date(data?.date_create)).format("HH:mm")}
                  </a>
                </div>
              );
            },
            responsive: ["xl"],
          },
          {
            title: `${i18n.t("total_order", { lng: lang })}`,
            render: (data) => (
              <a className="text-address-customer">{data?.total_order}</a>
            ),

            align: "center",
            responsive: ["xl"],
          },
          {
            title: `${i18n.t("nearest_order", { lng: lang })}`,
            render: (data) => {
              return (
                <>
                  {data?.id_group_order ? (
                    <Link to={`/details-order/${data?.id_group_order}`}>
                      <a className="text-id-order">
                        {data?.id_view_group_order}
                      </a>
                    </Link>
                  ) : (
                    <a className="text-address-customer">{`${i18n.t(
                      "not_available",
                      { lng: lang }
                    )}`}</a>
                  )}
                </>
              );
            },

            align: "center",
          },
          {
            title: `${i18n.t("total", { lng: lang })}`,
            width: "10%",
            render: (data) => (
              <a className="text-address-customer">
                {formatMoney(data?.total_price)}
              </a>
            ),
            align: "right",
            responsive: ["xl"],
          },
          {
            key: "action",
            align: "center",
            width: "5%",
            render: (data) => (
              <Space size="middle">
                <Dropdown
                  menu={{
                    items,
                  }}
                  placement="bottom"
                  trigger={["click"]}
                >
                  <a>
                    <MoreOutlined className="icon-more" />
                  </a>
                </Dropdown>
              </Space>
            ),
          },
        ];

  return (
    <React.Fragment>
      <div>
        <div className="div-header-customer-table">
          {checkElement?.includes("create_customer") && (
            <AddCustomer
              setIsLoading={setIsLoading}
              setData={setData}
              setTotal={setTotal}
              startPage={startPage}
              status={status}
            />
          )}
          <Input
            placeholder={`${i18n.t("search", { lng: lang })}`}
            type="text"
            className="input-search"
            prefix={<SearchOutlined />}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={dataFilter.length > 0 ? dataFilter : data}
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
                  setItemEdit(record);
                  setRowIndex(rowIndex);
                },
              };
            }}
            // locale={{
            //   emptyText:
            //     data.length > 0 ? <Empty /> : <Skeleton active={true} />,
            // }}
            scroll={
              width <= 490
                ? {
                    x: 1600,
                  }
                : null
            }
          />
        </div>

        <div className="mt-1 div-pagination p-2">
          <a>
            {`${i18n.t("total", { lng: lang })}`}:{" "}
            {dataFilter.length > 0 ? totalFilter : total}
          </a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={dataFilter.length > 0 ? totalFilter : total}
              showSizeChanger={false}
              pageSize={50}
            />
          </div>
        </div>
        <div>
          <ModalCustom
            isOpen={modal}
            title={`${i18n.t("customer_delete", { lng: lang })}`}
            handleOk={() => onDelete(itemEdit?._id)}
            textOk={`${i18n.t("delete", { lng: lang })}`}
            handleCancel={toggle}
            body={
              <>
                <a>{`${i18n.t("sure_delete_customer", { lng: lang })}`}</a>
                <a className="text-name-modal">{itemEdit?.full_name}</a>
              </>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalBlock}
            title={
              itemEdit?.is_active === true
                ? `${i18n.t("lock_cutomer_account", { lng: lang })}`
                : `${i18n.t("unlock_cutomer_account", { lng: lang })}`
            }
            handleOk={() => blockCustomer(itemEdit?._id, itemEdit?.is_active)}
            textOk={
              itemEdit?.is_active === true
                ? `${i18n.t("lock", { lng: lang })}`
                : `${i18n.t("unlock", { lng: lang })}`
            }
            handleCancel={toggleBlock}
            body={
              <>
                {itemEdit?.is_active === true
                  ? `${i18n.t("want_lock_cutomer_account", { lng: lang })}`
                  : `${i18n.t("want_unlock_cutomer_account", { lng: lang })}`}
                <h6>{itemEdit?.full_name}</h6>
              </>
            }
          />
        </div>

        <FloatButton.BackTop />
        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
};

export default memo(UserManage);
