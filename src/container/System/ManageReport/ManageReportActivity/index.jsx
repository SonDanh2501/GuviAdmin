import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

const ManageReportActivity = () => {
  /* ~~~ Value ~~~ */
  const navigate = useNavigate();
  /* ~~~ List ~~~ */
  const reportActivityListItem = [
    {
      title: "Báo cáo hoạt động đơn hàng",
      detail: "Báo cáo hoạt động của đơn hàng",
      linkNavigate: "report/manage-report/report-order-activity",
      checkPermition: "order_report",
    },
  ];
  /* ~~~ Handle function ~~~ */
  /* ~~~ Use effect ~~~ */
  /* ~~~ Other ~~~ */
  const handleOpenNewTab = (link) => {
    const url = `${window.location.origin}/${link}`;
    window.open(url, "_blank");
  };
  /* ~~~ Main ~~~ */
  return (
    <div className="manage-report-cash-book">
      {reportActivityListItem?.map((item, index) => (
        <div key={index} className="manage-report-cash-book__child card-shadow">
          <div className="manage-report-cash-book__child--circle"></div>
          <div
            onClick={() => handleOpenNewTab(item.linkNavigate)}
            className="manage-report-cash-book__child--detail"
          >
            <span>Xem báo cáo</span>
          </div>
          <div className="manage-report-cash-book__child--title">
            <span className="manage-report-cash-book__child--title-header">
              {item?.title}
            </span>
            <span className="manage-report-cash-book__child--title-sub-header">
              {item?.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageReportActivity;
