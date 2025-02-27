import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

const ManageReportActivity = () => {
  /* ~~~ List ~~~ */
  const reportActivityListItem = [
    {
      title: "Báo cáo hoạt động đơn hàng",
      detail: "Báo cáo hoạt động của đơn hàng",
      linkNavigate: "report/manage-report/report-order-activity",
      checkPermition: "order_report",
    },
    // {
    //   title: "Báo cáo chi tiết hoạt động đơn hàng",
    //   detail: "Báo cáo chi tiết hoạt động của đơn hàng",
    //   linkNavigate: "report/manage-report/report-detail-order-activity",
    //   checkPermition: "order_report",
    // },
  ];
  /* ~~~ Handle function ~~~ */
  const handleOpenNewTab = (link) => {
    const url = `${window.location.origin}/${link}`;
    window.open(url, "_blank");
  };
  /* ~~~ Main ~~~ */
  return (
    <div className="manage-report-order-activity">
      {reportActivityListItem?.map((item, index) => (
        <div
          key={index}
          className="manage-report-order-activity__child card-shadow"
        >
          <div className="manage-report-order-activity__child--circle"></div>
          <div
            onClick={() => handleOpenNewTab(item.linkNavigate)}
            className="manage-report-order-activity__child--detail"
          >
            <span>Xem báo cáo</span>
          </div>
          <div className="manage-report-order-activity__child--numbered">
            <span>{index + 1}</span>
          </div>
          <div className="manage-report-order-activity__child--title">
            <span className="manage-report-order-activity__child--title-header">
              {item?.title}
            </span>
            <span className="manage-report-order-activity__child--title-sub-header">
              {item?.detail}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ManageReportActivity;
