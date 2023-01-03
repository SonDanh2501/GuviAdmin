import { FloatButton, Tabs } from "antd";

import "./index.scss";

import { useDispatch } from "react-redux";
import UserManage from "./TableCustomer/UserManage";
import AddCustomer from "../../../../components/addCustomer/addCustomer";

const ManageCustomer = () => {
  const dispatch = useDispatch();

  return (
    <>
      <div className="div-header-customer">
        <a className="title-cv">Danh sách khách hàng</a>
        <AddCustomer />
      </div>

      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Tất cả Khách Hàng" key="1">
            <UserManage />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Thành Viên" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Bạc" key="3"></Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Vàng" key="4"></Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng Bạch Kim" key="5"></Tabs.TabPane>
          <Tabs.TabPane tab="Sinh Nhật Trong Tháng" key="6"></Tabs.TabPane>
        </Tabs>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCustomer;
