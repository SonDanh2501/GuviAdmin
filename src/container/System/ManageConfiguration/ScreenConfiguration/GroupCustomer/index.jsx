import React, { useCallback, useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { getGroupCustomers } from "../../../../../redux/actions/customerAction";
import {
  getGroupCustomer,
  getGroupCustomerTotalItem,
} from "../../../../../redux/selectors/customer";
import { Dropdown, Pagination, Space, Table } from "antd";
import { UilEllipsisV } from "@iconscout/react-unicons";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import {
  activeGroupCustomerApi,
  deleteGroupCustomerApi,
} from "../../../../../api/configuration";
import { errorNotify } from "../../../../../helper/toast";
import LoadingPagination from "../../../../../components/paginationLoading";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import onToggle from "../../../../../assets/images/on-button.png";
import offToggle from "../../../../../assets/images/off-button.png";
import { getElementState } from "../../../../../redux/selectors/auth";

const GroupCustomerManage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const listGroupCustomers = useSelector(getGroupCustomer);
  const totalGroupCustomers = useSelector(getGroupCustomerTotalItem);
  const [item, setItem] = useState([]);
  const [startPage, setStartPage] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [modalActive, setModalActive] = useState(false);
  const dispatch = useDispatch();
  const toggle = () => setModal(!modal);
  const toggleActive = () => setModalActive(!modalActive);
  const checkElement = useSelector(getElementState);

  const navigate = useNavigate();
  useEffect(() => {
    dispatch(
      getGroupCustomers.getGroupCustomersRequest({ start: 0, length: 10 })
    );
  }, []);

  const deleteGroupCustomer = useCallback(
    (id) => {
      setIsLoading(true);
      deleteGroupCustomerApi(id)
        .then((res) => {
          dispatch(
            getGroupCustomers.getGroupCustomersRequest({
              start: startPage,
              length: 10,
            })
          );
          setIsLoading(false);
          setModal(false);
        })
        .catch((err) => {
          errorNotify({
            message: err,
          });
          setIsLoading(false);
        });
    },
    [startPage]
  );

  const activeGroupCustomer = useCallback(
    (id, active) => {
      setIsLoading(true);
      if (active === true) {
        activeGroupCustomerApi(id, { is_active: false })
          .then((res) => {
            dispatch(
              getGroupCustomers.getGroupCustomersRequest({
                start: startPage,
                length: 10,
              })
            );
            setIsLoading(false);
            setModalActive(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      } else {
        activeGroupCustomerApi(id, { is_active: true })
          .then((res) => {
            dispatch(
              getGroupCustomers.getGroupCustomersRequest({
                start: startPage,
                length: 10,
              })
            );
            setIsLoading(false);
            setModalActive(false);
          })
          .catch((err) => {
            errorNotify({
              message: err,
            });
            setIsLoading(false);
          });
      }
    },
    [startPage]
  );

  const columns = [
    {
      title: "Tên nhóm khách hàng",
      render: (data) => <a className="text-name-group-cutomer">{data?.name}</a>,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      render: (data) => (
        <a className="text-date-group">
          {moment(data?.date_create).format("DD/MM/YYYY hh:mm")}
        </a>
      ),
    },
    {
      key: "action",
      align: "center",
      render: (data) => {
        return (
          <>
            {checkElement?.includes("active_group_customer_setting") && (
              <img
                className="img-unlock-banner"
                src={data?.is_active ? onToggle : offToggle}
                onClick={toggleActive}
              />
            )}
          </>
        );
      },
    },
    {
      key: "action",
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
            <div>
              <UilEllipsisV />
            </div>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const items = [
    {
      key: 1,
      label: checkElement?.includes("edit_group_customer_setting") && (
        <a
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/manage-group-customer/details-edit",
              {
                state: { id: item?._id },
              }
            )
          }
        >
          Chi tiết
        </a>
      ),
    },
    {
      key: 2,
      label: checkElement?.includes("delete_group_customer_setting") && (
        <a onClick={toggle}>Xoá</a>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * listGroupCustomers.length - listGroupCustomers.length;
    startPage(start);
    dispatch(
      getGroupCustomers.getGroupCustomersRequest({ start: start, length: 10 })
    );
  };

  return (
    <div>
      {checkElement?.includes("create_group_customer_setting") && (
        <div
          className="btn-add-group-customer"
          onClick={() =>
            navigate(
              "/adminManage/manage-configuration/manage-group-customer/create"
            )
          }
        >
          <a>Thêm nhóm khách hàng</a>
        </div>
      )}
      <div className="mt-3 p-3 ">
        <div className="mt-3">
          <Table
            columns={columns}
            dataSource={listGroupCustomers}
            pagination={false}
            onRow={(record, rowIndex) => {
              return {
                onClick: (event) => {
                  setItem(record);
                },
              };
            }}
          />
        </div>

        <div className="div-pagination p-2">
          <a>Tổng: {totalGroupCustomers}</a>
          <div>
            <Pagination
              current={currentPage}
              onChange={onChange}
              total={totalGroupCustomers}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>

      <div>
        <Modal isOpen={modal} toggle={toggle}>
          <ModalHeader toggle={toggle}>Xóa nhóm khách hàng</ModalHeader>
          <ModalBody>
            <a>
              Bạn có chắc muốn xóa nhóm khách hàng{" "}
              <a className="text-name-modal">{item?.name}</a> này không?
            </a>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => deleteGroupCustomer(item?._id)}
            >
              Có
            </Button>
            <Button color="#ddd" onClick={toggle}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      <div>
        <Modal isOpen={modalActive} toggle={toggleActive}>
          <ModalHeader toggle={toggleActive}>
            {item?.is_active === true ? "Khóa nhóm" : "Mở nhóm"}
          </ModalHeader>
          <ModalBody>
            {item?.is_active === true
              ? "Bạn có muốn khóa nhóm khách hàng này"
              : "Bạn có muốn kích hoạt nhóm khách hàng này"}
            <h3>{item?.title}</h3>
          </ModalBody>
          <ModalFooter>
            <Button
              color="primary"
              onClick={() => activeGroupCustomer(item?._id, item?.is_active)}
            >
              Có
            </Button>
            <Button color="#ddd" onClick={toggleActive}>
              Không
            </Button>
          </ModalFooter>
        </Modal>
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default GroupCustomerManage;
