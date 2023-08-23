import { useNavigate } from "react-router-dom";
import {
  getElementState,
  getLanguageState,
} from "../../../../redux/selectors/auth";
import "./styles.scss";
import { useSelector } from "react-redux";
import i18n from "../../../../i18n";

const ManageReportCustomer = () => {
  const checkElement = useSelector(getElementState);
  const lang = useSelector(getLanguageState);
  const navigate = useNavigate();
  return (
    <div className="container-report-order">
      {checkElement?.includes("count_customer_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("report_number_customer", {
            lng: lang,
          })}`}</p>
          <p className="text-details">
            {`${i18n.t("detail_report_time", {
              lng: lang,
            })}`}
          </p>
          <p
            className="text-see-report"
            onClick={() => navigate("/report/manage-report/report-user")}
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
      {checkElement?.includes("customer_invite_report") && (
        <div className="div-item-report">
          <p className="text-title">
            {" "}
            {`${i18n.t("referral_report", { lng: lang })}`}
          </p>
          <p className="text-details">{`${i18n.t("referral_report_day", {
            lng: lang,
          })}`}</p>
          <p
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-customer-invite")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}
      {checkElement?.includes("customer_by_area_report") && (
        <div className="div-item-report">
          <p className="text-title">{`${i18n.t("customer_report_region", {
            lng: lang,
          })}`}</p>
          <p className="text-details">
            {`${i18n.t("total_customer_report_region", { lng: lang })}`}
          </p>
          <p
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-customer-area")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </p>
        </div>
      )}

      <div className="div-item-report">
        <p className="text-title">{`${i18n.t("report_customer_order_by_area", {
          lng: lang,
        })}`}</p>
        <p className="text-details">
          {`${i18n.t("report_customer_order_by_area", { lng: lang })}`}
        </p>
        <p
          className="text-see-report"
          onClick={() =>
            navigate("/report/manage-report/report-customer-order-by-area")
          }
        >
          {`${i18n.t("see_report", { lng: lang })}`}
        </p>
      </div>
      <div className="div-item-report">
        <p className="text-title">{`${i18n.t("Báo cáo tỉ suất", {
          lng: lang,
        })}`}</p>
        <p className="text-details">
          {`${i18n.t("Báo cáo tỉ suất khách hàng", { lng: lang })}`}
        </p>
        <p
          className="text-see-report"
          onClick={() =>
            navigate("/report/manage-report/report-customer-ratio")
          }
        >
          {`${i18n.t("see_report", { lng: lang })}`}
        </p>
      </div>
    </div>
  );
};

export default ManageReportCustomer;
