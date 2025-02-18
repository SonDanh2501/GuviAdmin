import React from "react";
import "./index.scss";
import { useNavigate } from "react-router-dom";

const ManageReportCashBook = () => {
  /* ~~~ Value ~~~ */
  const navigate = useNavigate();
  /* ~~~ List ~~~ */
  const reportCashBookListItem = [
    {
      title: "Báo cáo TỔNG QUAN thu chi",
      detail: "Báo cáo thu chi tổng",
      linkNavigate: "report/manage-report/report-cash-book",
      checkPermition: "order_report",
    },
    // {
    //   title: "Báo cáo CHI TIẾT thu chi",
    //   detail: "Báo cáo chi tiết thu chi tổng",
    //   linkNavigate: "report/manage-report/report-detail-cash-book",
    //   checkPermition: "order_report",
    // },
    {
      title: "Báo cáo TỔNG QUAN thu chi đối tác",
      detail: "Báo cáo tổng quan thu chi đối tác",
      linkNavigate: "report/manage-report/report-cash-book-collaborator",
      checkPermition: "order_report",
    },
    // {
    //   title: "Báo cáo CHI TIẾT thu chi đối tác",
    //   detail: "Báo cáo chi tiết thu chi đối tác",
    //   linkNavigate: "report/manage-report/report-detail-cash-book-collaborator",
    //   checkPermition: "order_report",
    // },
    {
      title: "Báo cáo TỔNG QUAN thu chi khách hàng",
      detail: "Báo cáo tổng quát thu chi khách hàng",
      linkNavigate: "report/manage-report/report-cash-book-customer",
      checkPermition: "order_report",
    },
    // {
    //   title: "Báo cáo CHI TIẾT thu chi khách hàng",
    //   detail: "Báo cáo chi tiết thu chi khách hàng",
    //   linkNavigate: "report/manage-report/report-detail-cash-book-customer",
    //   checkPermition: "order_report",
    // },
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
      {reportCashBookListItem?.map((item, index) => (
        <div key={index} className="manage-report-cash-book__child card-shadow">
          <div className="manage-report-cash-book__child--circle"></div>
          <div
            onClick={() => handleOpenNewTab(item.linkNavigate)}
            className="manage-report-cash-book__child--detail"
          >
            <span>Xem báo cáo</span>
          </div>
          <div className="manage-report-cash-book__child--numbered">
            <span>{index + 1}</span>
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

export default ManageReportCashBook;
