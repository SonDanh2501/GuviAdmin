import { Tabs } from "antd";
import { useLocation } from "react-router-dom";
import DetailsProfile from "./DetailsProfile";
import HistoryTransition from "./History";
import OrderCustomer from "./OrderCustomer";

const Profiles = () => {
  const { state } = useLocation();
  const { id } = state || {};
  return (
    <div>
      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Chi tiết Khách Hàng" key="1">
            <DetailsProfile id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đơn hàng" key="2">
            <OrderCustomer />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Lịch sử tài khoản" key="3">
            <HistoryTransition id={id} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Profiles;
