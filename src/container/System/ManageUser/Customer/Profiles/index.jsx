import { Tabs } from "antd";
import DetailsProfile from "./DetailsProfile";
import OrderCustomer from "./OrderCustomer";

const Profiles = () => {
  return (
    <div>
      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Chi tiết Khách Hàng" key="1">
            <DetailsProfile />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đơn hàng" key="2">
            <OrderCustomer />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Profiles;
