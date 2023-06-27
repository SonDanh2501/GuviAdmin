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
import {
  getElementState,
  getLanguageState,
} from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import ModalCustom from "../../../../../components/modalCustom";
const width = window.innerWidth;

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
  const lang = useSelector(getLanguageState);

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
      title: `${i18n.t("name", { lng: lang })}`,
      render: (data) => <a className="text-name-group-cutomer">{data?.name}</a>,
    },
    {
      title: `${i18n.t("detail", { lng: lang })}`,
      dataIndex: "description",
    },
    {
      title: `${i18n.t("date_create", { lng: lang })}`,
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
          {`${i18n.t("detail", { lng: lang })}`}
        </a>
      ),
    },
    {
      key: 2,
      label: checkElement?.includes("delete_group_customer_setting") && (
        <a onClick={toggle}>{`${i18n.t("delete", { lng: lang })}`}</a>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const dataLength =
      listGroupCustomers?.length < 10 ? 10 : listGroupCustomers.length;
    const start = page * dataLength - dataLength;
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
          <a>{`${i18n.t("add_group_customer", { lng: lang })}`}</a>
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
            scroll={
              width <= 490
                ? {
                    x: 1000,
                  }
                : null
            }
          />
        </div>

        <div className="div-pagination p-2">
          <a>
            {`${i18n.t("total", { lng: lang })}`}: {totalGroupCustomers}
          </a>
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
        <ModalCustom
          isOpen={modal}
          title={`${i18n.t("delete_group_customer", {
            lng: lang,
          })}`}
          textOk={`${i18n.t("delete", { lng: lang })}`}
          handleOk={() => deleteGroupCustomer(item?._id)}
          handleCancel={toggle}
          body={
            <>
              <a>{`${i18n.t("want_delete_group_customer", { lng: lang })}`}</a>
              <a className="text-name-modal">{item?.name}</a>
            </>
          }
        />
      </div>

      <div>
        <ModalCustom
          isOpen={modalActive}
          title={
            item?.is_active === true
              ? `${i18n.t("lock_group_customer", { lng: lang })}`
              : `${i18n.t("unlock_group_customer", { lng: lang })}`
          }
          textOk={
            item?.is_active === true
              ? `${i18n.t("lock", { lng: lang })}`
              : `${i18n.t("unlock", { lng: lang })}`
          }
          handleCancel={toggleActive}
          handleOk={() => activeGroupCustomer(item?._id, item?.is_active)}
          body={
            <>
              <a>
                {item?.is_active === true
                  ? `${i18n.t("want_lock_group_customer", { lng: lang })}`
                  : `${i18n.t("want_unlock_group_customer", { lng: lang })}`}
              </a>

              <h3>{item?.title}</h3>
            </>
          }
        />
      </div>

      {isLoading && <LoadingPagination />}
    </div>
  );
};

export default GroupCustomerManage;
