import React, { useEffect, useState } from "react";
import "./styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { getGroupCustomers } from "../../../../../redux/actions/customerAction";
import {
  getGroupCustomer,
  getGroupCustomerTotalItem,
} from "../../../../../redux/selectors/customer";
import { Pagination, Table } from "antd";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const GroupCustomerManage = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const listGroupCustomers = useSelector(getGroupCustomer);
  const totalGroupCustomers = useSelector(getGroupCustomerTotalItem);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(
      getGroupCustomers.getGroupCustomersRequest({ start: 0, length: 10 })
    );
  }, []);

  const columns = [
    {
      title: "Tên nhóm khách hàng",
      render: (data) => <a className="text-name">{data?.name}</a>,
    },
    {
      title: "Chi tiết",
      dataIndex: "description",
    },
    {
      title: "Ngày tạo",
      render: (data) => (
        <a className="text-name">
          {moment(data?.date_create).format("DD/MM/YYYY hh:mm")}
        </a>
      ),
    },
  ];

  const onChange = (page) => {
    setCurrentPage(page);
    const start = page * listGroupCustomers.length - listGroupCustomers.length;
    dispatch(
      getGroupCustomers.getGroupCustomersRequest({ start: start, length: 10 })
    );
  };

  return (
    <div className="content">
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
      <div className="mt-3 p-3 ">
        <div className="mt-3 table">
          <Table
            columns={columns}
            dataSource={listGroupCustomers}
            pagination={false}
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
    </div>
  );
};

export default GroupCustomerManage;
