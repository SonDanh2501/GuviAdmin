import { Tabs } from "antd";
import ManagePromotions from "../ManagePromotion";
import "./index.scss";
import BannerManage from "./ManageBanner/BannerManage";
import NewsManage from "./ManageNews/NewsManage";

const ManageSetting = () => {
  return (
    <div className="div-container-promotion">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane tab="Quản lý khuyến mãi" key="1">
          <ManagePromotions />
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
