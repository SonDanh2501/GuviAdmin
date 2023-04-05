import { Tabs } from "antd";

const ManageFinance = () => {
  return (
    <>
      <Tabs>
        <Tabs.TabPane tab="Cộng tác viên" key="1"></Tabs.TabPane>
        <Tabs.TabPane tab="Khách hàng" key="2"></Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default ManageFinance;
