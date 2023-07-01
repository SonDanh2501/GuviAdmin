import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { useSelector } from "react-redux";
import { getLanguageState } from "../../../../redux/selectors/auth";
import i18n from "../../../../i18n";

const ManageReportCollaborator = () => {
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);
  return (
    <div className="container-report-collaborator">
      <div className="div-item-report">
        <a className="text-title">{`${i18n.t("report_collaborator_orders", {
          lng: lang,
        })}`}</a>
        <a className="text-details">
          {`${i18n.t("report_detail_collaborator_orders", {
            lng: lang,
          })}`}
        </a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-collaborator")}
        >
          {`${i18n.t("see_report", {
            lng: lang,
          })}`}
        </a>
      </div>
    </div>
  );
};

export default ManageReportCollaborator;
