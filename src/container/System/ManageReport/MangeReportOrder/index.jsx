import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { useSelector } from "react-redux";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const ManageReportOrder = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();

  return (
    <div className="container-report-order-item">
      {checkElement?.includes("order_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("order_detail_report", {
            lng: lang,
          })}`}</p>
          <p className="text-details">
            {`${i18n.t("detailed_report_period", { lng: lang })}`}
          </p>
          <p
            className="text-see-report"
            onClick={() => navigate("/report/manage-report/report-order-work")}
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
      {checkElement?.includes("order_by_customer_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("order_report_customer", {
            lng: lang,
          })}`}</p>
          <p className="text-details">
            {`${i18n.t("order_report_customer_old_new", { lng: lang })}`}
          </p>
          <p
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-order-customer")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}

      {checkElement?.includes("order_by_arera_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("order_report_region", {
            lng: lang,
          })}`}</p>
          <p className="text-details">{`${i18n.t("order_report_region_total", {
            lng: lang,
          })}`}</p>
          <p
            className="text-see-report"
            onClick={() => navigate("/report/manage-report/report-order-area")}
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
      {checkElement?.includes("order_by_daily_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("completed_order_report_day", {
            lng: lang,
          })}`}</p>
          <p className="text-details">{`${i18n.t("report_all_orders_in_day", {
            lng: lang,
          })}`}</p>
          <p
            className="text-see-report"
            onClick={() => navigate("/report/manage-report/report-order-daily")}
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
      {checkElement?.includes("order_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("order_report_creation_date", {
            lng: lang,
          })}`}</p>
          <p className="text-details">
            {`${i18n.t("detailed_report_period", { lng: lang })}`}
          </p>
          <p
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-order-create")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
      {checkElement?.includes("order_report_day_in_week") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("report_order_day_of_week", {
            lng: lang,
          })}`}</p>
          <p className="text-details">
            {`${i18n.t("report_order_day_of_week", { lng: lang })}`}
          </p>
          <p
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-order-day-of-week")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
    </div>
  );
};

export default ManageReportOrder;
