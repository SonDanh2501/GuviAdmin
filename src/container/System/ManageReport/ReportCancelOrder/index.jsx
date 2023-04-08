import React, { useCallback, useEffect, useState } from "react";
import "./index.scss";
import { Tabs } from "antd";
import CancelOrderCustomer from "./CancelCustomer";
import TotalCancel from "./CancelTotal";

const ReportCancelOrder = () => {
  return (
    <>
      <Tabs>
        <Tabs.TabPane tab="Tổng" key="1">
          <TotalCancel />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Khách hàng" key="2">
          <CancelOrderCustomer />
        </Tabs.TabPane>
        <Tabs.TabPane tab="Hệ thống" key="3"></Tabs.TabPane>
        <Tabs.TabPane tab="Quản trị viên" key="4"></Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default ReportCancelOrder;
