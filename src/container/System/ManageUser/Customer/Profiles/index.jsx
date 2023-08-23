import { Tabs } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { useCookies } from "../../../../../helper/useCookies";
import i18n from "../../../../../i18n";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import FavouriteBlock from "./CollaboratorFavoriteBlock";
import DetailsProfile from "./DetailsProfile";
import HistoryTransition from "./History";
import OrderCustomer from "./OrderCustomer";
import CustomerReview from "./Review";
import UsedPromotion from "./UsedPromotion";

const Profiles = () => {
  const params = useParams();
  const id = params?.id;
  const [saveToCookie, readCookie] = useCookies();
  const [activeKey, setActiceKey] = useState("1");
  const lang = useSelector(getLanguageState);

  useEffect(() => {
    setActiceKey(
      readCookie("tab-detail-kh") === "" ? "1" : readCookie("tab-detail-kh")
    );
  }, [readCookie]);

  const onChangeTab = (key) => {
    saveToCookie("tab-detail-kh", key);
    setActiceKey(key);
  };
  return (
    <div>
      <div className="div-container-customer">
        <Tabs activeKey={activeKey} size="small" onChange={onChangeTab}>
          <Tabs.TabPane tab={`${i18n.t("detail", { lng: lang })}`} key="1">
            <DetailsProfile id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("order", { lng: lang })}`} key="2">
            <OrderCustomer id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("account_history", { lng: lang })}`}
            key="3"
          >
            <HistoryTransition id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("favourite_block", { lng: lang })}`}
            key="4"
          >
            <FavouriteBlock id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={"Khuyến mãi đã sử dụng"} key="5">
            <UsedPromotion id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Đánh giá" key="6">
            <CustomerReview id={id} />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </div>
  );
};

export default Profiles;
