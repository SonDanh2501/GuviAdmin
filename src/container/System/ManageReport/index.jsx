import { Tabs } from "antd";

import { useEffect } from "react";
import ManageReportOrder from "./MangeReportOrder";
import ReportArea from "./ReportArea";
import ReportCancelOrder from "./ReportCancelOrder";
import ReportManager from "./ReportCollaborator";
import ReportInvite from "./ReportInvite";
import ReportUser from "./ReportUser";
import "./index.scss";
import ReportCustomerArea from "./ReportCustomerArea";

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
          {/* <Tabs.TabPane tab="Báo cáo đơn hàng" key="1">
            <ReportOrder />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn hàng theo ngày" key="2">
            <ReportOrderDaily />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn hàng theo khu vực" key="3">
            <ReportOrderCity />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo CTV" key="4">
            <ReportManager />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo số lượng user" key="5">
            <ReportUser />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo lượt giới thiệu" key="6">
            <ReportInvite />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn hàng theo khách hàng" key="7">
            <ReportCustomer />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo khu vực" key="8">
            <ReportArea />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo đơn huỷ" key="9">
            <ReportCancelOrder />
          </Tabs.TabPane> */}
          <Tabs.TabPane tab="Báo cáo đơn hàng" key="1">
            <ManageReportOrder />
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
          <Tabs.TabPane tab="Báo cáo đơn huỷ" key="5">
            <ReportCancelOrder />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo khu vực" key="6">
            <ReportArea />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo khách hàng theo khu vực" key="7">
            <ReportCustomerArea />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
