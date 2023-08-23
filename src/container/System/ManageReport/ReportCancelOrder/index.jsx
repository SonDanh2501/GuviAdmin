import { Tabs } from "antd";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import i18n from "../../../../i18n";
import { getLanguageState } from "../../../../redux/selectors/auth";
import CancelOrderCustomer from "./CancelCustomer";
import TotalCancel from "./CancelTotal";
import TotalCancelSystem from "./CancelTotalSystem";
import TotalCancelUserSystem from "./CancelTotalUserSystem";
import "./index.scss";

const ReportCancelOrder = () => {
  const [tab, setTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);
  const lang = useSelector(getLanguageState);

  const onChangeTab = (tab) => {
    switch (tab) {
      case "1":
        setTab("");
        setCurrentPage(1);
        setStartPage(0);
        break;
      case "2":
        setTab("customer");
        setCurrentPage(1);
        setStartPage(0);
        break;
      case "3":
        setTab("system");
        setCurrentPage(1);
        setStartPage(0);
        break;
      case "4":
        setTab("usersystem");
        setCurrentPage(1);
        setStartPage(0);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <Tabs onChange={onChangeTab}>
        <Tabs.TabPane tab={`${i18n.t("total", { lng: lang })}`} key="1">
          <TotalCancel
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("customer", { lng: lang })}`} key="2">
          <CancelOrderCustomer
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("system", { lng: lang })}`} key="3">
          <TotalCancelSystem
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={`${i18n.t("admin", { lng: lang })}`} key="4">
          <TotalCancelUserSystem
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default ReportCancelOrder;
