import { Tabs } from "antd";

import "./index.scss";
import ReportManager from "./ReportCollaborator";

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
          <Tabs.TabPane tab="Báo cáo tài chính" key="2"></Tabs.TabPane>
          <Tabs.TabPane tab="Báo cáo dịch vụ" key="2"></Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
