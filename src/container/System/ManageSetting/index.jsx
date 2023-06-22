import { Tabs } from "antd";
import ManagePromotions from "../ManagePromotion";
import "./index.scss";
import BannerManage from "./ManageBanner/BannerManage";
import NewsManage from "./ManageNews/NewsManage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import i18n from "../../../i18n";

const ManageSetting = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="div-container-promotion">
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={`${i18n.t("promotion_management", { lng: lang })}`}
          key="1"
        >
          <ManagePromotions />
        </Tabs.TabPane>
        {checkElement?.includes("get_banner") && (
          <Tabs.TabPane
            tab={`${i18n.t("banner_management", { lng: lang })}`}
            key="2"
          >
            <BannerManage />
          </Tabs.TabPane>
        )}
        {checkElement?.includes("get_news") && (
          <Tabs.TabPane
            tab={`${i18n.t("news_management", { lng: lang })}`}
            key="3"
          >
            <NewsManage />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ManageSetting;
