import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "../../../helper/useCookies";
import i18n from "../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import ManagePromotions from "../ManagePromotion";
import BannerManage from "./ManageBanner/BannerManage";
import NewsManage from "./ManageNews/NewsManage";
import "./index.scss";

const ManageSetting = () => {
  const checkElement = useSelector(getElementState);
  const [activeKey, setActiveKey] = useState("1");
  const [saveToCookie, readCookie] = useCookies();
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveKey(
      readCookie("tab-promo-setting") === ""
        ? "1"
        : readCookie("tab-promo-setting")
    );
  }, []);

  const onChangeTab = (key) => {
    setActiveKey(key);
    saveToCookie("tab-promo-setting", key);
  };

  return (
    <div className="div-container-promotion">
      <Tabs activeKey={activeKey} size="small" onChange={onChangeTab}>
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
        {/* <Tabs.TabPane tab={"Kéo thả test"} key="4">
          <PromotionDrag />
        </Tabs.TabPane> */}
      </Tabs>
    </div>
  );
};

export default ManageSetting;
