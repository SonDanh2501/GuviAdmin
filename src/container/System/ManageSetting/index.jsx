import { Tabs } from "antd";
import PromotionManage from "../ManagePromotion/Customer/promotionManage";
import "./index.scss";
import BannerManage from "./ManageBanner/BannerManage";
import NewsManage from "./ManageNews/NewsManage";

const ManageSetting = () => {
  return (
    <div className="div-container">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Quản lý khuyến mãi" key="1">
          <PromotionManage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quản lý banner" key="2">
          <BannerManage />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quản lý bài viết" key="3">
          <NewsManage />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default ManageSetting;
