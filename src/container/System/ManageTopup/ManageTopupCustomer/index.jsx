import { Tabs } from "antd";
import TopupCustomer from "./Topup/TopupCustomerManage";
import TopupPoint from "./WalletPoint";

const TopupCustomerManage = () => {
  return (
    <div>
      <Tabs>
        <Tabs.TabPane tab="Nạp tiền" key="1">
          <TopupCustomer />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Ví thưởng" key="2">
          <TopupPoint />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default TopupCustomerManage;
