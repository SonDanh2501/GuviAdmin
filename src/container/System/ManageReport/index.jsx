import { Tabs } from "antd";

import "./index.scss";
import ReportManager from "./ReportCollaborator";
import ReportCustomer from "./ReportCustomer";
import ReportInvite from "./ReportInvite";
import ReportService from "./ReportService";

const ManageReport = () => {
  return (
    <>
      <div className="div-header-report">
        <a className="title-header ">Báo cáo</a>
      </div>
      <div className="div-container-report">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tổng quan" key="1">
            <ReportManager />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo số lượng user" key="2">
            <ReportCustomer />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo lượt giới thiệu" key="3">
            <ReportInvite />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo dịch vụ" key="4">
            <ReportService />
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
