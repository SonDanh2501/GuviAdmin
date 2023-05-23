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
import ReportOrderDaily from "./ReportOrderDaily";

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
          <Tabs.TabPane tab="Báo cáo đơn hàng theo ngày" key="2">
            <ReportOrderDaily />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo CTV" key="3">
            <ReportManager />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo số lượng user" key="4">
            <ReportUser />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo lượt giới thiệu" key="5">
            <ReportInvite />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn hàng theo khách hàng" key="6">
            <ReportCustomer />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo khu vực" key="7">
            <ReportArea />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn huỷ" key="8">
            <ReportCancelOrder />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
