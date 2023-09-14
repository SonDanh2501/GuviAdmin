import { Select } from "antd";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "../../../helper/useCookies";
import { useHorizontalScroll } from "../../../helper/useSideScroll";
import useWindowDimensions from "../../../helper/useWindowDimensions";
import i18n from "../../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import ManageReportCustomer from "./ManageReportCustomer";
import ManageReportCollaborator from "./ManagerReportCollaborator";
import ManageReportOrder from "./MangeReportOrder";
import ReportCancelOrder from "./ReportCancelOrder";
import ReportOverview from "./ReportOverview";
import ReportService from "./ReportService";
import "./index.scss";

const ManageReport = () => {
  const checkElement = useSelector(getElementState);
  const { width } = useWindowDimensions();
  const [tab, setTab] = useState(1);
  const [saveToCookie, readCookie] = useCookies();
  const scrollRef = useHorizontalScroll();
  const lang = useSelector(getLanguageState);
  const tabCookie = readCookie("tab_report");
  useEffect(() => {
    window.scrollTo(0, 0);
    setTab(tabCookie === "" ? 1 : Number(tabCookie));
  }, [tabCookie]);

  

  let DATA = [
    {
      value: 1,
      label: `${i18n.t("overview", {
        lng: lang,
      })}`,
      role: "order_report",
    },
    {
      value: 2,
      label: `${i18n.t("order_report", {
        lng: lang,
      })}`,
      role: "order_report",
    },
    {
      value: 3,
      label: `${i18n.t("collaborator_report", {
        lng: lang,
      })}`,
      role: "collaborator_report",
    },
    {
      value: 4,
      label: `${i18n.t("customer_report", {
        lng: lang,
      })}`,
      role: "count_customer_report",
    },
    {
      value: 5,
      label: `${i18n.t("cancellation_report", {
        lng: lang,
      })}`,
      role: "order_cancel_report",
    },
    {
      value: 6,
      label: `${i18n.t("service_report", {
        lng: lang,
      })}`,
      role: "order_by_service_report",
    },
  ];


  for(let i = 0 ; i < DATA.length ; i++) {
    DATA[i] = (checkElement?.includes(DATA[i].role)) ? DATA[i] : false;
  }
  DATA = DATA.filter(x => x !== false);
  saveToCookie("tab_report", DATA[0].value)


  return (
    <>
      <div className="div-header-report">
        <p className="title-header">{`${i18n.t("report", { lng: lang })}`}</p>
      </div>
      
      <div className="div-container-report">
        {width > 490 ? (
          <div className="div-tab-report" ref={scrollRef}>
            {DATA?.map((item, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    setTab(item?.value);
                    saveToCookie("tab_report", item?.value);
                  }}
                  className={
                    item?.value === tab ? "div-item-tab-select" : "div-item-tab"
                  }
                  // style={
                  //   checkElement?.includes(item?.role)
                  //     ? {}
                  //     : { display: "none" }
                  // }
                >
                  <p className="text-tab">{item?.label}</p>
                </div>
              );
            })}
          </div>
        ) : (
          <Select
            options={DATA}
            style={{ width: "100%" }}
            value={tab}
            onChange={(e) => {
              setTab(e);
              saveToCookie("tab_report", e);
            }}
          />
        )}
        {tab === 1 ? ( 
          <ReportOverview/>
        ) : tab === 2 ? (
          <ManageReportOrder />
        ) : tab === 3 ? (
          <ManageReportCollaborator />
        ) : tab === 4 ? (
          <ManageReportCustomer />
        ) : tab === 5 ? (
          <ReportCancelOrder />
        ) : tab === 6 ? (
          <ReportService />
        ) : (
          <ReportOverview />
        )}
      </div>
    </>
  );
};

export default ManageReport;
