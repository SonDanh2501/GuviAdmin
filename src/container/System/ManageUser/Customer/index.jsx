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

  const customers = useSelector(getCustomer);
  const customerTotal = useSelector(getCustomerTotalItem);
  const dispatch = useDispatch();
  const user = useSelector(getUser);

  useEffect(() => {
    dispatch(
      getCustomers.getCustomersRequest({ start: 0, length: 20, type: "" })
    );
  }, [dispatch]);

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("member");
      dispatch(
        getCustomers.getCustomersRequest({
          start: 0,
          length: 20,
          type: "member",
        })
      );
    } else if (active === "3") {
      setStatus("silver");
      dispatch(
        getCustomers.getCustomersRequest({
          start: 0,
          length: 20,
          type: "silver",
        })
      );
    } else if (active === "4") {
      setStatus("gold");
      dispatch(
        getCustomers.getCustomersRequest({ start: 0, length: 20, type: "gold" })
      );
    } else if (active === "5") {
      setStatus("platinum");
      dispatch(
        getCustomers.getCustomersRequest({
          start: 0,
          length: 20,
          type: "platinum",
        })
      );
    } else if (active === "6") {
      setStatus("birthday");
      dispatch(
        getCustomers.getCustomersRequest({
          start: 0,
          length: 20,
          type: "birthday",
        })
      );
    } else {
      setStatus("");
      dispatch(
        getCustomers.getCustomersRequest({ start: 0, length: 20, type: "" })
      );
    }
  };

  return (
    <>
      <div className="div-header-customer">
        <a className="title-cv">Danh sách khách hàng</a>
        {user?.role !== "marketing_manager" ||
        user?.role !== "marketing_manager" ? (
          <AddCustomer />
        ) : (
          <></>
        )}
      </div>

      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab="Tất cả Khách Hàng" key="1">
            <UserManage
              data={customers}
              total={customerTotal}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Thành Viên" key="2">
            <UserManage
              data={customers}
              total={customerTotal}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Bạc" key="3">
            <UserManage
              data={customers}
              total={customerTotal}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Vàng" key="4">
            <UserManage
              data={customers}
              total={customerTotal}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Bạch Kim" key="5">
            <UserManage
              data={customers}
              total={customerTotal}
              status={status}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Sinh Nhật Trong Tháng" key="6">
            <UserManage
              data={customers}
              total={customerTotal}
              status={status}
            />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCustomer;
