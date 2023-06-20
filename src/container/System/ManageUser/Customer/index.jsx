import { FloatButton, Tabs } from "antd";

import "./index.scss";

import { useState } from "react";
import UserManage from "./TableCustomer/UserManage";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const ManageCustomer = () => {
  const [status, setStatus] = useState("");
  const lang = useSelector(getLanguageState);

  const onChangeTab = (active) => {
    if (active === "2") {
      setStatus("member");
    } else if (active === "3") {
      setStatus("silver");
    } else if (active === "4") {
      setStatus("gold");
    } else if (active === "5") {
      setStatus("platinum");
    } else if (active === "6") {
      setStatus("birthday");
    } else if (active === "7") {
      setStatus("block");
    } else {
      setStatus("");
    }
  };

  return (
    <>
      <div className="div-header-customer">
        <a className="title-cv">{`${i18n.t("list_customer", {
          lng: lang,
        })}`}</a>
      </div>

      <div className="div-container-customer">
        <Tabs defaultActiveKey="1" size="large" onChange={onChangeTab}>
          <Tabs.TabPane tab={`${i18n.t("all", { lng: lang })}`} key="1">
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("member_customer", { lng: lang })}`}
            key="2"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("silver_customer", { lng: lang })}`}
            key="3"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("gold_customer", { lng: lang })}`}
            key="4"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("platinum_customer", { lng: lang })}`}
            key="5"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("month_birthday", { lng: lang })}`}
            key="6"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
          <Tabs.TabPane
            tab={`${i18n.t("customer_block", { lng: lang })}`}
            key="7"
          >
            <UserManage status={status} />
          </Tabs.TabPane>
        </Tabs>
      </div>
      <FloatButton.BackTop />
    </>
  );
};

export default ManageCustomer;
