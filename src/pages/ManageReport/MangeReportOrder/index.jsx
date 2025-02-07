import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../redux/selectors/auth";
import React from "react"
import i18n from "../../../i18n";

const ManageReportOrder = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();

  // const cardItemReport = [
  //   {
  //     titleI18n: "order_detail_report_by_date_work",
  //     detailI18n: "detailed_report_period",
  //     linkNavigate: "/report/manage-report/report-order-work",
  //     checkPermition: "order_report"
  //   },
  //   // {
  //   //   titleI18n: "order_detail_report_by_date_create",
  //   //   detailI18n: "detailed_report_period",
  //   //   linkNavigate: "/report/manage-report/report-order-work",
  //   //   checkPermition: "order_by_customer_report"
  //   // },
  //   {
  //     titleI18n: "completed_order_report_day",
  //     detailI18n: "report_all_orders_in_day",
  //     linkNavigate: "/report/manage-report/report-order-daily",
  //     checkPermition: "order_by_daily_report"
  //   }
  //   // {
  //   //   titleI18n: "order_detail_report",
  //   //   detailI18n: "detailed_report_period",
  //   //   linkNavigate: "/report/manage-report/report-order-work",
  //   //   checkPermition: "order_report"
  //   // },
  //   // {
  //   //   titleI18n: "order_detail_report",
  //   //   detailI18n: "detailed_report_period",
  //   //   linkNavigate: "/report/manage-report/report-order-work",
  //   //   checkPermition: "order_report"
  //   // }
  // ]


  const cardItemReport = [
    {
      title: "Báo cáo số lượng đơn hàng theo ngày làm",
      detail: "Báo cáo số lượng đơn hàng hoàn thành theo ngày làm",
      linkNavigate: "/report/manage-report/report-order-daily-date-work",
      checkPermition: "order_report",
    },
    {
      title: "Báo cáo chi tiết đơn hàng theo ngày làm",
      detail:
        "Báo cáo chi tiết đơn hàng theo ngày làm, chỉ bao gồm các đơn đã hoàn thành",
      linkNavigate: "/report/manage-report/report-detail-order-date-work",
      checkPermition: "order_report",
    },
    {
      title: "Báo cáo số lượng đơn hàng theo khách hàng",
      detail: "Báo cáo số lượng đơn hàng đã hoàn thành theo khách hàng ",
      linkNavigate: "/report/manage-report/report-order-by-customer",
      checkPermition: "order_report",
    },
    {
      title: "Báo cáo số lượng đơn hàng theo ngày tạo",
      detail:
        "Bao gồm các đơn hàng đã nhận, đang làm và hoàn thành theo ngày tạo",
      linkNavigate: "/report/manage-report/report-order-daily-date-create",
      checkPermition: "order_report",
    },
    {
      title: "Báo cáo chi tiết đơn hàng theo ngày tạo",
      detail:
        "Báo cáo chi tiết đơn hàng theo ngày tạo, bao gồm các đơn đã nhận, đang làm và hoàn thành",
      linkNavigate: "/report/manage-report/report-detail-order-date-create",
      checkPermition: "order_report",
    },
    {
      title: "Báo cáo khách hàng đặt đơn lần đầu theo ngày",
      detail: "Báo cáo số lượng đơn hàng là đơn đầu tiên của các khách hàng",
      linkNavigate: "/report/manage-report/report-first-order",
      checkPermition: "order_report",
    },
    // {
    //   title: "Báo cáo số lượng đơn hàng theo khu vực",
    //   detail: "Báo cáo chi tiết đơn hàng theo khu vực",
    //   linkNavigate: "/report/manage-report/report-detail-order-date-create",
    //   checkPermition: "order_report"
    // },
    {
      title: "Báo cáo doanh thu",
      detail: "Báo cáo doanh thu của những đơn đã hoàn thành",
      linkNavigate: "/report/manage-report/report-revenue",
      checkPermition: "order_report",
    },
  ];


  
  
  const ItemReport = ({ title, detail, linkNavigate, checkPermition }) => {
    return (
      <React.Fragment>
         {checkElement?.includes(checkPermition) && (
        <div className="div-item-report">
        {/* <p className="text-title">{`${i18n.t(`${titleI18n}`, {
          lng: lang,
        })}`}</p> */}

        <p className="text-title">{title}</p>

        <p className="text-details">
          {detail}
        </p>

        {/* <p className="text-details">
          {`${i18n.t(`${detailI18n}`, { lng: lang })}`}
        </p> */}

        <p
          className="text-see-report"
          onClick={() => navigate(linkNavigate)}
        >
          {`${i18n.t("see_report", { lng: lang })}`}
        </p>
      </div>
         )}
      </React.Fragment>
    )
  }

  return (
    <div className="container-report-order-item">
      {cardItemReport?.map((item, index) => {
        return (
          // <ItemReport titleI18n={item.titleI18n} detailI18n={item.detailI18n} linkNavigate={item.linkNavigate} checkPermition={item.checkPermition} />
          <ItemReport title={item.title} detail={item.detail} linkNavigate={item.linkNavigate} checkPermition={item.checkPermition} />
        )
      })}
    </div>
  );
};

export default ManageReportOrder;
