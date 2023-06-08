import { useNavigate } from "react-router-dom";
import "./styles.scss";

const ManageReportCollaborator = () => {
  const navigate = useNavigate();
  return (
    <div className="container-report-collaborator">
      <div className="div-item-report">
        <a className="text-title">Báo cáo đơn cộng tác viên</a>
        <a className="text-details">
          Báo cáo chi tiết từng ca làm của cộng tác viên
        </a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-collaborator")}
        >
          Xem báo cáo
        </a>
      </div>
    </div>
  );
};

export default ManageReportCollaborator;
