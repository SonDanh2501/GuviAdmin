import { Tabs } from "antd";

import "./index.scss";
import ReportManager from "./ReportCollaborator";
import ReportInvite from "./ReportInvite";
import ReportOrder from "./ReportOrder";
import ReportService from "./ReportService";
import ReportArea from "./ReportArea";
import ReportUser from "./ReportUser";
import ReportCustomer from "./ReportCutomer";
import ReportCancelOrder from "./ReportCancelOrder";
import { useEffect } from "react";

const ManageReport = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="div-header-report">
        <a className="title-header ">Báo cáo</a>
      </div>
      <div className="div-container-report">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Báo cáo đơn hàng" key="1">
            <ReportOrder />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo CTV" key="2">
            <ReportManager />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo số lượng user" key="3">
            <ReportUser />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo lượt giới thiệu" key="4">
            <ReportInvite />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn hàng theo khách hàng" key="5">
            <ReportCustomer />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo khu vực" key="6">
            <ReportArea />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn huỷ" key="7">
            <ReportCancelOrder />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
