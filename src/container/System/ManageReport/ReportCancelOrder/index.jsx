import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { Tabs } from "antd";
import CancelOrderCustomer from "./CancelCustomer";
import TotalCancel from "./CancelTotal";
import TotalCancelSystem from "./CancelTotalSystem";
import TotalCancelUserSystem from "./CancelTotalUserSystem";

const ReportCancelOrder = () => {
  const [tab, setTab] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [startPage, setStartPage] = useState(0);

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
        <Tabs.TabPane tab="Tổng" key="1">
          <TotalCancel
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Khách hàng" key="2">
          {/* <CancelOrderCustomer /> */}
          <CancelOrderCustomer
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Hệ thống" key="3">
          <TotalCancelSystem
            tab={tab}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            startPage={startPage}
            setStartPage={setStartPage}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Quản trị viên" key="4">
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
