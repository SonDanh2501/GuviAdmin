import { Tabs } from "antd";

import "./index.scss";
import ReportManager from "./ReportCollaborator";
import ReportCustomer from "./ReportCustomer";
import ReportInvite from "./ReportInvite";
import ReportOrder from "./ReportOrder";
import ReportService from "./ReportService";
import ReportArea from "./ReportArea";

const ManageReport = () => {
  return (
    <>
      <div className="div-header-report">
        <a className="title-header ">Báo cáo</a>
      </div>
      <div className="div-container-report">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Tổng quan" key="1">
            <ReportOrder />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo CTV" key="2">
            <ReportManager />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo số lượng user" key="3">
            <ReportCustomer />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo lượt giới thiệu" key="4">
            <ReportInvite />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo khu vực" key="5">
            {/* <ReportArea /> */}
          </Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
