import { Tabs } from "antd";

import TopupManage from "./ManageTopupCollaborator/TopupManage";
import TopupCustomerManage from "./ManageTopupCustomer";

import "./styles.scss";

const ManageTopup = () => {
  return (
    <div className="div-container">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Cộng tác viên" key="1">
          <TopupManage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Khách hàng" key="2">
          <TopupCustomerManage />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ManageTopup;
