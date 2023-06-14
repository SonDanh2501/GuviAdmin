import { Tabs } from "antd";
import { useLocation, useParams } from "react-router-dom";
import DetailsProfile from "./DetailsProfile";
import HistoryTransition from "./History";
import OrderCustomer from "./OrderCustomer";
import FavouriteBlock from "./CollaboratorFavoriteBlock";

const Profiles = () => {
  // const { state } = useLocation();
  // const { id } = state || {};
  const params = useParams();
  const id = params?.id;

  return (
    <div>
      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large">
          <Tabs.TabPane tab="Chi tiết Khách Hàng" key="1">
            <DetailsProfile id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đơn hàng" key="2">
            <OrderCustomer id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Lịch sử tài khoản" key="3">
            <HistoryTransition id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Yêu thích / Hạn chế" key="4">
            <FavouriteBlock id={id} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Profiles;
