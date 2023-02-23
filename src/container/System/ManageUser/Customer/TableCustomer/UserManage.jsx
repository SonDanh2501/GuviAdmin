import React, { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import {
  FilterOutlined,
  MoreOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { Dropdown, FloatButton, Input, Pagination, Space, Table } from "antd";
import _debounce from "lodash/debounce";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { activeCustomer, searchCustomers } from "../../../../../api/customer";
import EditCustomer from "../../../../../components/editCustomer/editCustomer";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import {
  deleteCustomerAction,
  getCustomers,
} from "../../../../../redux/actions/customerAction";
import { loadingAction } from "../../../../../redux/actions/loading";
import "./UserManage.scss";
import LoadingPagination from "../../../../../components/paginationLoading";
import { getUser } from "../../../../../redux/selectors/auth";

export default function UserManage(props) {
  const { data, total, status } = props;
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [hidePhone, setHidePhone] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [rowIndex, setRowIndex] = useState();
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const [conditionFilter, setConditionFilter] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  const onDelete = useCallback((id) => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      deleteCustomerAction.deleteCustomerRequest({
        id: id,
        data: { is_delete: true },
      })
    );
  }, []);

  const blockCustomer = useCallback((id, is_active) => {
    dispatch(loadingAction.loadingRequest(true));
    if (is_active === true) {
      activeCustomer(id, { is_active: false })
        .then((res) => {
          setModalBlock(!modalBlock);
          window.location.reload();
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    } else {
      activeCustomer(id, { is_active: true })
        .then((res) => {
          setModalBlock(!modalBlock);

          window.location.reload();
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          dispatch(loadingAction.loadingRequest(false));
        });
    }
  }, []);

  const onChange = (page) => {
    setCurrentPage(page);

    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * data.length - data.length;
    dataFilter.length > 0
      ? searchCustomers(start, 20, status, valueFilter)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => {})
      : dispatch(
          getCustomers.getCustomersRequest({
            start: start > 0 ? start : 0,
            length: 20,
            type: status,
          })
        );
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueFilter(value);
      setIsLoading(true);
      searchCustomers(0, 20, status, value)
        .then((res) => {
          setIsLoading(false);
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
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
        <a
          onClick={() => {
            setModalEdit(!modalEdit);
          }}
        >
          Chỉnh sửa
        </a>
      ),
    },
    {
      key: "2",
      label: user?.role === "admin" && <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Mã",
      width: "10%",
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/system/user-manage/details-customer", {
                state: { id: data?._id },
              })
            }
          >
            {/* <img
              className="img_customer"
              src={data?.avatar ? data?.avatar : user}
            /> */}
            <a className="text-id"> {data?.id_view}</a>
          </div>
        );
      },
    },
    {
      title: "Khách hàng",
      width: "20%",
      render: (data) => {
        return (
          <div
            onClick={() =>
              navigate("/system/user-manage/details-customer", {
                state: { id: data?._id },
              })
            }
          >
            {/* <img
              className="img_customer"
              src={data?.avatar ? data?.avatar : user}
            /> */}
            <a className="text-name"> {data?.full_name}</a>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      render: (data, record, index) => {
        const phone = data?.phone.slice(0, 7);
        return (
          <div className="hide-phone">
            <a className="text-phone">
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
      width: "15%",
    },
    {
      title: "Địa Chỉ",
      render: (data) => (
        <a className="text-address">
          {!data?.default_address
            ? "Chưa có"
            : data?.default_address.slice(0, 60) + "..."}
        </a>
      ),
      width: "25%",
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
      width: "10%",
    },
    {
      title: "Tổng Đơn",
      render: (data) => <a className="text-address">{data?.total_order}</a>,
      width: "15%",
      align: "center",
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
                {data?.id_group_order}
              </a>
            ) : (
              <a className="text-address">Không có</a>
            )}
          </>
        );
      },
      width: "20%",
      align: "center",
    },
    {
      title: " Tổng",
      render: (data) => (
        <a className="text-address">{formatMoney(data?.total_price)}</a>
      ),
      align: "right",
      width: "10%",
    },
    {
      key: "action",
      width: "10%",
      align: "center",
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

  const itemFilter = [
    {
      key: "1",
      label: (
        <a
          onClick={() => {
            setConditionFilter("Khách hàng thân thiết");
          }}
        >
          Khách hàng thân thiết
        </a>
      ),
    },
    {
      key: "2",
      label: (
        <a
          onClick={() => {
            setConditionFilter("Khách hàng sinh nhật");
          }}
        >
          Khách hàng sinh nhật
        </a>
      ),
    },
  ];

  return (
    <React.Fragment>
      <div>
        <div className="div-header">
          <Dropdown
            menu={{ items: itemFilter }}
            trigger={["click"]}
            className="dropdown"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <FilterOutlined className="icon" />
                <a className="text-filter">
                  {conditionFilter ? conditionFilter : "Thêm điều kiện lọc"}
                </a>
              </Space>
            </a>
          </Dropdown>
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
            // locale={{
            //   emptyText:
            //     customers.length > 0 ? <Empty /> : <Skeleton active={true} />,
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
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa người dùng</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa người dùng{" "}
                <a className="text-name-modal">{itemEdit?.full_name}</a> này
                không?
              </a>
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={() => onDelete(itemEdit?._id)}>
                Có
              </Button>
              <Button color="#ddd" onClick={toggle}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div>
          <Modal isOpen={modalBlock} toggle={toggleBlock}>
            <ModalHeader toggle={toggleBlock}>
              {" "}
              {itemEdit?.is_active === true
                ? "Khóa tài khoản khách hàng"
                : "Mở tài khoản khách hàng"}
            </ModalHeader>
            <ModalBody>
              {itemEdit?.is_active === true
                ? "Bạn có muốn khóa tài khoản khách hàng"
                : "Bạn có muốn kích hoạt tài khoản khách hàng"}
              <h3>{itemEdit?.full_name}</h3>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                onClick={() =>
                  blockCustomer(itemEdit?._id, itemEdit?.is_active)
                }
              >
                Có
              </Button>
              <Button color="#ddd" onClick={toggleBlock}>
                Không
              </Button>
            </ModalFooter>
          </Modal>
        </div>
        <div>
          <EditCustomer
            state={modalEdit}
            setState={() => setModalEdit(!modalEdit)}
            data={itemEdit}
          />
        </div>
        <FloatButton.BackTop />
        {isLoading && <LoadingPagination />}
      </div>
    </React.Fragment>
  );
}
