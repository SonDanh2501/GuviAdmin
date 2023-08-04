import { Tabs } from "antd";

import TopupManage from "./ManageTopupCollaborator/TopupManage";
import TopupCustomerManage from "./ManageTopupCustomer";

import "./styles.scss";
import { useEffect, useState } from "react";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import i18n from "../../../i18n";
import { useCookies } from "../../../helper/useCookies";

const ManageTopup = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const [saveToCookie, readCookie] = useCookies();
  const [activeKey, setActiveKey] = useState("1");

  useEffect(() => {
    window.scrollTo(0, 0);
    setActiveKey(
      readCookie("tab_topup") === "" ? "1" : readCookie("tab_topup")
    );
  }, []);

  const onChangeTab = (key) => {
    setActiveKey(key);
    saveToCookie("tab_topup", key);
  };

  return (
    <div>
      <Tabs activeKey={activeKey} onChange={onChangeTab}>
        {checkElement?.includes("get_cash_book_collaborator") && (
          <Tabs.TabPane
            tab={`${i18n.t("collaborator", { lng: lang })}`}
            key="1"
          >
            <TopupManage />
          </Tabs.TabPane>
        )}
        {checkElement?.includes("list_transition_cash_book_customer") && (
          <Tabs.TabPane tab={`${i18n.t("customer", { lng: lang })}`} key="2">
            <TopupCustomerManage />
          </Tabs.TabPane>
        )}
      </Tabs>
    </div>
  );
};

export default ManageTopup;
