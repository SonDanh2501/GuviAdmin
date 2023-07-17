import { Tabs } from "antd";

import { useEffect, useState } from "react";
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
import { useCookies } from "../../../helper/useCookies";

const ManageReport = () => {
  const checkElement = useSelector(getElementState);
  const [tab, setTab] = useState(1);
  const [saveToCookie, readCookie] = useCookies();
  const lang = useSelector(getLanguageState);
  useEffect(() => {
    window.scrollTo(0, 0);
    setTab(Number(readCookie("tab_report")));
  }, []);

  return (
    <>
      <div className="div-header-report">
        <a className="title-header">{`${i18n.t("report", { lng: lang })}`}</a>
      </div>
      <div className="div-container-report">
        {/* <Tabs defaultActiveKey="1">
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
        </Tabs> */}
        <div className="div-tab-report">
          {DATA?.map((item, index) => {
            return (
              <>
                <div
                  key={index}
                  onClick={() => {
                    setTab(item?.key);
                    saveToCookie("tab_report", item?.key);
                  }}
                  className={
                    item?.key === tab ? "div-item-tab-select" : "div-item-tab"
                  }
                >
                  <a className="text-tab">{`${i18n.t(item?.tab, {
                    lng: lang,
                  })}`}</a>
                </div>
              </>
            );
          })}
        </div>
        {tab === 1 ? (
          <ManageReportOrder />
        ) : tab === 2 ? (
          <ManageReportCollaborator />
        ) : tab === 3 ? (
          <ManageReportCustomer />
        ) : tab === 4 ? (
          <ReportCancelOrder />
        ) : tab === 5 ? (
          <ReportService />
        ) : null}
      </div>
    </>
  );
};

export default ManageReport;

const DATA = [
  {
    key: 1,
    tab: "order_report",
    role: "",
  },
  {
    key: 2,
    tab: "collaborator_report",
    role: "collaborator_report",
  },
  {
    key: 3,
    tab: "customer_report",
    role: "",
  },
  {
    key: 4,
    tab: "cancellation_report",
    role: "order_cancel_report",
  },
  {
    key: 5,
    tab: "service_report",
    role: "order_by_service_report",
  },
];
