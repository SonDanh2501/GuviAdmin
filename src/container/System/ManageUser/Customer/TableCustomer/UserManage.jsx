import React, { memo, useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { MoreOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Dropdown,
  Empty,
  FloatButton,
  Input,
  Pagination,
  Skeleton,
  Space,
  Table,
} from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useNavigate } from "react-router-dom";
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
import { getElementState } from "../../../../../redux/selectors/auth";
import "./UserManage.scss";
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

  useEffect(() => {
    fetchCustomers(0, 20, status)
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
          fetchCustomers(startPage, 20, status)
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
            fetchCustomers(startPage, 20, status)
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
            fetchCustomers(startPage, 20, status)
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
    const dataLength = data.length < 20 ? 20 : data.length;
    const filterLength = dataFilter.length < 20 ? 20 : dataFilter.length;

    const start =
      dataFilter.length > 0
        ? page * filterLength - filterLength
        : page * dataLength - dataLength;

    setStartPage(start);

    dataFilter.length > 0
      ? searchCustomers(start, 20, status, valueFilter)
          .then((res) => {
            setDataFilter(res.data);
            setTotalFilter(res.totalItems);
          })
          .catch((err) => {})
      : fetchCustomers(start, 20, status)
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
      searchCustomers(0, 20, status, value)
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
      label: checkElement?.includes("delete_customer") && (
        <a onClick={toggle}>Xoá</a>
      ),
    },
  ];

  const columns =
    status === "birthday"
      ? [
          {
            title: "Mã",
            render: (data) => {
              return (
                <div
                  onClick={() => {
                    if (checkElement?.includes("detail_customer")) {
                      navigate("/profile-customer", {
                        state: { id: data?._id },
                      });
                    }
                  }}
                >
                  <a className="text-id-customer"> {data?.id_view}</a>
                </div>
              );
            },
          },
          {
            title: "Khách hàng",
            render: (data) => {
              return (
                <div
                  onClick={() => {
                    if (checkElement?.includes("detail_customer")) {
                      navigate("/profile-customer", {
                        state: { id: data?._id },
                      });
                    }
                  }}
                >
                  <a className="text-name-customer"> {data?.full_name}</a>
                </div>
              );
            },
            sorter: true,
          },
          {
            title: "Số điện thoại",
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
            title: "Ngày sinh",
            render: (data) => {
              return (
                <a className="text-birtday-customer">
                  {moment(new Date(data?.birthday)).format("DD/MM/YYYY")}
                </a>
              );
            },
          },
          {
            title: "Hạng thành viên",
            render: (data) => {
              if (data?.rank_point >= 0 && data?.rank_point < 100) {
                setRank("Hạng thành viên");
              } else if (data?.rank_point >= 100 && data?.rank_point < 300) {
                setRank("Bạc");
              } else if (data?.rank_point >= 300 && data?.rank_point < 1500) {
                setRank("Vàng");
              } else {
                setRank("Bạch kim");
              }
              return <a className="text-address-customer">{rank}</a>;
            },
          },
          {
            title: "Tổng Đơn",
            render: (data) => (
              <a className="text-address-customer">{data?.total_order}</a>
            ),

            align: "center",
            responsive: ["xl"],
          },
          {
            title: "Đơn gần nhất",
            render: (data) => {
              return (
                <>
                  {data?.id_group_order ? (
                    <a
                      className="text-id-order"
                      onClick={() =>
                        navigate("/details-order", {
                          state: { id: data?.id_group_order },
                        })
                      }
                    >
                      {data?.id_view_group_order}
                    </a>
                  ) : (
                    <a className="text-address-customer">Không có</a>
                  )}
                </>
              );
            },

            align: "center",
          },
          {
            title: " Tổng",
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
            title: "Mã",
            render: (data) => {
              return (
                <div
                  onClick={() => {
                    if (checkElement?.includes("detail_customer")) {
                      navigate("/profile-customer", {
                        state: { id: data?._id },
                      });
                    }
                  }}
                >
                  <a className="text-id-customer"> {data?.id_view}</a>
                </div>
              );
            },
          },
          {
            title: "Khách hàng",

            render: (data) => {
              return (
                <div
                  className="div-name-customer"
                  onClick={() => {
                    if (checkElement?.includes("detail_customer")) {
                      navigate("/profile-customer", {
                        state: { id: data?._id },
                      });
                    }
                  }}
                >
                  <a className="text-name-customer"> {data?.full_name}</a>
                  <a className="text-rank">
                    {data?.rank_point < 100
                      ? "(Thành viên)"
                      : data?.rank_point >= 100 && data?.rank_point < 300
                      ? "(Bạc)"
                      : data?.rank_point >= 300 && data?.rank_point < 1500
                      ? "(Vàng)"
                      : "(Bạch kim)"}
                  </a>
                </div>
              );
            },
            sorter: (a, b) => a.full_name.localeCompare(b.full_name),
          },
          {
            title: "Số điện thoại",
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
            title: "Địa Chỉ",
            render: (data) => {
              const address = data?.default_address?.address.split(",");
              return (
                <a className="text-address-customer-default">
                  {!data?.default_address
                    ? "Chưa có"
                    : address[address.length - 2] +
                      "," +
                      address[address.length - 1]}
                </a>
              );
            },

            responsive: ["xl"],
          },
          {
            title: "Ngày tạo",
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
            title: "Tổng Đơn",
            render: (data) => (
              <a className="text-address-customer">{data?.total_order}</a>
            ),

            align: "center",
            responsive: ["xl"],
          },
          {
            title: "Đơn gần nhất",
            render: (data) => {
              return (
                <>
                  {data?.id_group_order ? (
                    <a
                      className="text-id-order"
                      onClick={() =>
                        navigate("/details-order", {
                          state: { id: data?.id_group_order },
                        })
                      }
                    >
                      {data?.id_view_group_order}
                    </a>
                  ) : (
                    <a className="text-address-customer">Không có</a>
                  )}
                </>
              );
            },

            align: "center",
          },
          {
            title: " Tổng",
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
            placeholder="Tìm kiếm"
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
            locale={{
              emptyText:
                data.length > 0 ? <Empty /> : <Skeleton active={true} />,
            }}
            scroll={
              width <= 490
                ? {
                    x: 1600,
                  }
                : null
            }
            // expandable={{
            //   expandedRowRender: (record) => (
            //     <p
            //       style={{
            //         margin: 0,
            //       }}
            //     >
            //       {record?.date_create}
            //       {record?.default_address}
            //     </p>
            //   ),
            // }}
          />
        </div>

        <div className="mt-1 div-pagination p-2">
          <a>Tổng: {dataFilter.length > 0 ? totalFilter : total}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={dataFilter.length > 0 ? totalFilter : total}
              showSizeChanger={false}
              pageSize={20}
            />
          </div>
        </div>
        <div>
          <ModalCustom
            isOpen={modal}
            title="Xóa người dùng"
            handleOk={() => onDelete(itemEdit?._id)}
            textOk="Xoá"
            handleCancel={toggle}
            body={
              <a>
                Bạn có chắc muốn xóa người dùng{" "}
                <a className="text-name-modal">{itemEdit?.full_name}</a> này
                không?
              </a>
            }
          />
        </div>
        <div>
          <ModalCustom
            isOpen={modalBlock}
            title={
              itemEdit?.is_active === true
                ? "Khóa tài khoản khách hàng"
                : "Mở tài khoản khách hàng"
            }
            handleOk={() => blockCustomer(itemEdit?._id, itemEdit?.is_active)}
            textOk="Xoá"
            handleCancel={toggleBlock}
            body={
              <>
                {itemEdit?.is_active === true
                  ? "Bạn có muốn khóa tài khoản khách hàng"
                  : "Bạn có muốn kích hoạt tài khoản khách hàng"}
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
