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
          <Tabs.TabPane tab="Cộng tác viên" key="1">
            <ReportManager />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Khách hàng" key="2"></Tabs.TabPane>
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
