import { Tabs } from "antd";

import { useEffect } from "react";
import ManageReportCustomer from "./ManageReportCustomer";
import ManageReportOrder from "./MangeReportOrder";
import ReportCancelOrder from "./ReportCancelOrder";
import "./index.scss";
import ReportService from "./ReportService";
import { useSelector } from "react-redux";
import { getElementState } from "../../../redux/selectors/auth";
import ManageReportCollaborator from "./ManagerReportCollaborator";

const ManageReport = () => {
  const checkElement = useSelector(getElementState);
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
            <ManageReportOrder />
          </Tabs.TabPane>
          {checkElement?.includes("collaborator_report") && (
            <Tabs.TabPane tab="Báo cáo CTV" key="2">
              <ManageReportCollaborator />
            </Tabs.TabPane>
          )}
          <Tabs.TabPane tab="Báo cáo khách hàng" key="3">
            <ManageReportCustomer />
          </Tabs.TabPane>
          {checkElement?.includes("order_cancel_report") && (
            <Tabs.TabPane tab="Báo cáo đơn huỷ" key="4">
              <ReportCancelOrder />
            </Tabs.TabPane>
          )}
          {checkElement?.includes("order_by_service_report") && (
            <Tabs.TabPane tab="Báo cáo dịch vụ" key="5">
              <ReportService />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
