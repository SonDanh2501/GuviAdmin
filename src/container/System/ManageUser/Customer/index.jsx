import { FloatButton, Tabs } from "antd";

import "./index.scss";

import { useDispatch, useSelector } from "react-redux";
import UserManage from "./TableCustomer/UserManage";
import AddCustomer from "../../../../components/addCustomer/addCustomer";
import { getCustomers } from "../../../../redux/actions/customerAction";
import {
  getCustomer,
  getCustomerTotalItem,
} from "../../../../redux/selectors/customer";
import { useEffect, useState } from "react";
import { getUser } from "../../../../redux/selectors/auth";

const ManageCustomer = () => {
  const [status, setStatus] = useState("");

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("member");
    } else if (active === "3") {
      setStatus("silver");
    } else if (active === "4") {
      setStatus("gold");
    } else if (active === "5") {
      setStatus("platinum");
    } else if (active === "6") {
      setStatus("birthday");
    } else {
      setStatus("");
    }
  };

  return (
    <>
      <div className="div-header-customer">
        <a className="title-cv">Danh sách khách hàng</a>
      </div>

      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab="Tất cả Khách Hàng" key="1">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Thành Viên" key="2">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Bạc" key="3">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Vàng" key="4">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Bạch Kim" key="5">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Sinh Nhật Trong Tháng" key="6">
            <UserManage status={status} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCustomer;
