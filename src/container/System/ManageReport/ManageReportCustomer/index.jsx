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
          <a className="text-title">{`${i18n.t("report_number_customer", {
            lng: lang,
          })}`}</a>
          <a className="text-details">
            {`${i18n.t("detail_report_time", {
              lng: lang,
            })}`}
          </a>
          <a
            className="text-see-report"
            onClick={() => navigate("/report/manage-report/report-user")}
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </a>
        </div>
      )}
      {checkElement?.includes("customer_invite_report") && (
        <div className="div-item-report">
          <a className="text-title">
            {" "}
            {`${i18n.t("referral_report", { lng: lang })}`}
          </a>
          <a className="text-details">{`${i18n.t("referral_report_day", {
            lng: lang,
          })}`}</a>
          <a
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-customer-invite")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </a>
        </div>
      )}
      {checkElement?.includes("customer_by_area_report") && (
        <div className="div-item-report">
          <a className="text-title">{`${i18n.t("customer_report_region", {
            lng: lang,
          })}`}</a>
          <a className="text-details">
            {`${i18n.t("total_customer_report_region", { lng: lang })}`}
          </a>
          <a
            className="text-see-report"
            onClick={() =>
              navigate("/report/manage-report/report-customer-area")
            }
          >
            {`${i18n.t("see_report", { lng: lang })}`}
          </a>
        </div>
      )}
    </div>
  );
};

export default ManageReportCustomer;
