import { Tabs } from "antd";
import TopupCustomer from "./Topup/TopupCustomerManage";
import TopupPoint from "./WalletPoint";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const TopupCustomerManage = () => {
  const lang = useSelector(getLanguageState);
  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab={`${i18n.t("wallet_gpay", { lng: lang })}`} key="1">
          <TopupCustomer />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("reward_points", { lng: lang })}`} key="2">
          <TopupPoint />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TopupCustomerManage;
