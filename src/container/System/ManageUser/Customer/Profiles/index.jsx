import { Tabs } from "antd";
import { useLocation, useParams } from "react-router-dom";
import DetailsProfile from "./DetailsProfile";
import HistoryTransition from "./History";
import OrderCustomer from "./OrderCustomer";
import FavouriteBlock from "./CollaboratorFavoriteBlock";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import UsedPromotion from "./UsedPromotion";
import CustomerReview from "./Review";

const Profiles = () => {
  // const { state } = useLocation();
  // const { id } = state || {};
  const params = useParams();
  const id = params?.id;
  const lang = useSelector(getLanguageState);

  return (
    <div>
      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large">
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
