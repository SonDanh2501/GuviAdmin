import { Tabs } from "antd";

import { useEffect } from "react";
import ManageReportCustomer from "./ManageReportCustomer";
import ManageReportOrder from "./MangeReportOrder";
import ReportCancelOrder from "./ReportCancelOrder";
import "./index.scss";
import ReportService from "./ReportService";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import ManageReportCollaborator from "./ManagerReportCollaborator";
import i18n from "../../../i18n";

const ManageReport = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <div className="div-header-report">
        <a className="title-header">{`${i18n.t("report", { lng: lang })}`}</a>
      </div>
      <div className="div-container-report">
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane
            tab={`${i18n.t("order_report", { lng: lang })}`}
            key="1"
          >
            <ManageReportOrder />
          </Tabs.TabPane>
          {checkElement?.includes("collaborator_report") && (
            <Tabs.TabPane
              tab={`${i18n.t("collaborator_report", { lng: lang })}`}
              key="2"
            >
              <ManageReportCollaborator />
            </Tabs.TabPane>
          )}
          <Tabs.TabPane
            tab={`${i18n.t("customer_report", { lng: lang })}`}
            key="3"
          >
            <ManageReportCustomer />
          </Tabs.TabPane>
          {checkElement?.includes("order_cancel_report") && (
            <Tabs.TabPane
              tab={`${i18n.t("cancellation_report", { lng: lang })}`}
              key="4"
            >
              <ReportCancelOrder />
            </Tabs.TabPane>
          )}
          {checkElement?.includes("order_by_service_report") && (
            <Tabs.TabPane
              tab={`${i18n.t("service_report", { lng: lang })}`}
              key="5"
            >
              <ReportService />
            </Tabs.TabPane>
          )}
        </Tabs>
      </div>
    </>
  );
};

export default ManageReport;
