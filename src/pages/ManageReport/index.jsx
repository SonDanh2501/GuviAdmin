import { useState } from "react";
import { useSelector } from "react-redux";
import { useCookies } from "../../helper/useCookies";
import { useHorizontalScroll } from "../../helper/useSideScroll";
import i18n from "../../i18n";
import {
  getElementState,
  getLanguageState,
} from "../../redux/selectors/auth";
import ReportOverview from "./ReportOverview";
import ManageReportOrder from "./MangeReportOrder"
// import ManageReportCollaborator from "../../container/System/ManageReport/ManagerReportCollaborator"
import MamageReportCollaborator from "./MamageReportCollaborator"

import ManageReportCustomer from "../../container/System/ManageReport/ManageReportCustomer"
import ReportCancelOrder from "../../container/System/ManageReport/ReportCancelOrder"
import ReportService from "../../container/System/ManageReport/ReportService"

import TabPanelContent from "../../components/tabs/TabPanel"
import "./index.scss";
import ManageReportCashBook from "../../container/System/ManageReport/ManageReportCashBook";
import ManageReportActivity from "../../container/System/ManageReport/ManageReportActivity";
import ManageReportRewardAnhPunish from "../../container/System/ManageReport/ManageReportRewardAnhPunish";

const ManageReport = () => {

  const itemTab = [
    {
      label: "Tổng quan",
      content: <ReportOverview />,
      key: 0,
    },
    {
      label: "Báo cáo đơn hàng",
      content: <ManageReportOrder />,
      key: 1,
    },
    {
      label: "Báo cáo CTV",
      content: <MamageReportCollaborator />,
      key: 2,
    },
    {
      label: "Báo cáo khách hàng",
      content: <ManageReportCustomer />,
      key: 3,
    },
    {
      label: "Báo cáo đơn huỷ",
      content: <ReportCancelOrder />,
      key: 4,
    },
    {
      label: "Báo cáo dịch vụ",
      content: <ReportService />,
      key: 5,
    },
    {
      label: "Báo cáo sổ quỹ",
      content: <ManageReportCashBook />,
      key: 6,
    },
    {
      label: "Báo cáo hoạt động",
      content: <ManageReportActivity />,
      key: 7,
    },
    // {
    //   label: "Báo cáo thưởng phạt",
    //   content: <ManageReportRewardAnhPunish />,
    //   key: 8,
    // },
  ];
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  // const [tab, setTab] = useState(itemTab[0].key);

  const onChangeTab = (item) => {
    // setTab(item.key);
  };

  return (
    <div className="div-container-content">
      <div className="div-flex-row">
        <div className="div-header-container">
          <h4 className="title-cv">{`${i18n.t("report", { lng: lang })}`}</h4>
        </div>
        <div className="btn-action-header">
        </div>
      </div>
      <div className="div-flex-row">
        <TabPanelContent
          items={itemTab}
          onValueChangeTab={onChangeTab}
        />
      </div>
      <div className="div-flex-row">
      </div>
    </div>
  )
}
export default ManageReport;