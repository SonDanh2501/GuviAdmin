import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  PaginationItem,
  PaginationLink,
} from "reactstrap";

import {
  FilterOutlined,
  LockOutlined,
  MoreOutlined,
  UnlockOutlined,
} from "@ant-design/icons";
import { Dropdown, Empty, Skeleton, Space, Table, Pagination } from "antd";
import _debounce from "lodash/debounce";
import { useNavigate } from "react-router-dom";
import { activeCustomer, searchCustomers } from "../../../../../api/customer";
import user from "../../../../../assets/images/user.png";
import CustomTextInput from "../../../../../components/CustomTextInput/customTextInput";
import EditCustomer from "../../../../../components/editCustomer/editCustomer";
import { formatMoney } from "../../../../../helper/formatMoney";
import { errorNotify } from "../../../../../helper/toast";
import {
  deleteCustomerAction,
  getCustomers,
} from "../../../../../redux/actions/customerAction";
import { loadingAction } from "../../../../../redux/actions/loading";
import {
  getCustomer,
  getCustomerTotalItem,
} from "../../../../../redux/selectors/customer";
import "./UserManage.scss";
import AddCustomer from "../../../../../components/addCustomer/addCustomer";

export default function UserManage() {
  const [dataFilter, setDataFilter] = useState([]);
  const [totalFilter, setTotalFilter] = useState("");
  const [valueFilter, setValueFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [itemEdit, setItemEdit] = useState([]);
  const [modal, setModal] = useState(false);
  const [modalBlock, setModalBlock] = useState(false);
  const [modalEdit, setModalEdit] = useState(false);
  const toggle = () => setModal(!modal);
  const toggleBlock = () => setModalBlock(!modalBlock);

  const customers = useSelector(getCustomer);
  const customerTotal = useSelector(getCustomerTotalItem);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(loadingAction.loadingRequest(true));
    dispatch(getCustomers.getCustomersRequest({ start: 0, length: 10 }));
  }, [dispatch]);

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

  const handleClick = useCallback(
    (e, index) => {
      e.preventDefault();
      setCurrentPage(index);
      const start =
        dataFilter.length > 0
          ? index * dataFilter.length
          : index * customers.length;
      dataFilter.length > 0
        ? searchCustomers(valueFilter, start, 10)
            .then((res) => {
              setDataFilter(res.data);
            })
            .catch((err) => console.log(err))
        : dispatch(
            getCustomers.getCustomersRequest({
              start: start > 0 ? start : 0,
              length: 10,
            })
          );
    },
    [customers, dataFilter, valueFilter]
  );

  const onChange = (page) => {
    setCurrentPage(page);
    const start =
      dataFilter.length > 0
        ? page * dataFilter.length - dataFilter.length
        : page * customers.length - customers.length;
    dataFilter.length > 0
      ? searchCustomers(valueFilter, start, 10)
          .then((res) => {
            setDataFilter(res.data);
          })
          .catch((err) => console.log(err))
      : dispatch(
          getCustomers.getCustomersRequest({
            start: start > 0 ? start : 0,
            length: 10,
          })
        );
  };

  const handleSearch = useCallback(
    _debounce((value) => {
      setValueFilter(value);
      searchCustomers(value, 0, 10)
        .then((res) => {
          setDataFilter(res.data);
          setTotalFilter(res.totalItem);
        })
        .catch((err) => console.log(err));
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
      label: <a onClick={toggle}>Xoá</a>,
    },
  ];

  const columns = [
    {
      title: "Khách hàng",
      width: "15%",
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
            <a className="text-name"> {data.full_name}</a>
          </div>
        );
      },
    },
    {
      title: "Số điện thoại",
      render: (data) => {
        const phone = data?.phone.slice(0, 7);
        return <a className="text-phone">{phone + "***"}</a>;
      },
      width: "10%",
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
      title: "Tổng Đơn Đã Đặt",
      render: (data) => <a className="text-address">{data?.total_order}</a>,
      width: "10%",
      align: "center",
    },
    {
      title: "Đơn Dịch Vụ gần nhất",
      render: (data) => <a className="text-id-order"></a>,
      width: "20%",
    },
    {
      title: " Tổng",
      render: (data) => (
        <a className="text-address">{formatMoney(data?.total_price)}</a>
      ),
      align: "center",
      width: "10%",
    },
    {
      key: "action",
      width: "10%",
      align: "center",
      render: (data) => (
        <Space size="middle">
          <div>
            {data?.is_active ? (
              <UnlockOutlined className="icon-unlock" onClick={toggleBlock} />
            ) : (
              <LockOutlined className="icon-lock" onClick={toggleBlock} />
            )}
          </div>
          <Dropdown
            menu={{
              items,
            }}
            placement="bottom"
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
        // onClick={() => {
        //   setModalEdit(!modalEdit);
        // }}
        >
          Khách hàng thân thiết
        </a>
      ),
    },
    {
      key: "2",
      label: <a>Khách hàng sinh nhật</a>,
    },
  ];

  return (
    <React.Fragment>
      <div>
        {/* <CardHeader className="border-0 card-header">
            <Row className="align-items-center">
              <Col className="text-left">
                <AddCustomer />
              </Col>
              <Col>
                <CustomTextInput
                  placeholder="Tìm kiếm"
                  type="text"
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </Col>
            </Row>
          </CardHeader> */}
        <div className="div-header">
          <Dropdown
            menu={{ items: itemFilter }}
            trigger={["click"]}
            className="dropdown"
          >
            <a onClick={(e) => e.preventDefault()}>
              <Space>
                <FilterOutlined className="icon" />
                <a className="text-filter">Thêm điều kiện lọc</a>
              </Space>
            </a>
          </Dropdown>

          <CustomTextInput
            placeholder="Tìm kiếm"
            type="text"
            classNameForm="input-search"
            className="input"
            onChange={(e) => handleSearch(e.target.value)}
          />
          <AddCustomer />
        </div>

        <Table
          columns={columns}
          dataSource={dataFilter.length > 0 ? dataFilter : customers}
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
              },
            };
          }}
          locale={{
            emptyText:
              customers.length > 0 ? <Empty /> : <Skeleton active={true} />,
          }}
        />

        <div className="mt-1 div-pagination p-2">
          <a>Tổng: {dataFilter.length > 0 ? totalFilter : customerTotal}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={dataFilter.length > 0 ? totalFilter : customerTotal}
              showSizeChanger={false}
            />
          </div>
        </div>
        <div>
          <Modal isOpen={modal} toggle={toggle}>
            <ModalHeader toggle={toggle}>Xóa người dùng</ModalHeader>
            <ModalBody>
              <a>
                Bạn có chắc muốn xóa người dùng{" "}
                <a className="text-name-modal">{itemEdit?.name}</a> này không?
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
              <h3>{itemEdit?.name}</h3>
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
      </div>
    </React.Fragment>
  );
}
