import { Tabs } from "antd";

import TopupManage from "./ManageTopupCollaborator/TopupManage";
import TopupCustomerManage from "./ManageTopupCustomer";

import "./styles.scss";
import { useEffect } from "react";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import { useSelector } from "react-redux";
import i18n from "../../../i18n";

const ManageTopup = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="div-container">
      <Tabs defaultActiveKey="1">
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
