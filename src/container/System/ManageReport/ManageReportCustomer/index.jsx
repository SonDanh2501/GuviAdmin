import { useNavigate } from "react-router-dom";
import "./styles.scss";

const ManageReportCustomer = () => {
  const navigate = useNavigate();
  return (
    <div className="container-report-order">
      <div className="div-item-report">
        <a className="text-title">Báo cáo số lượng khách hàng</a>
        <a className="text-details">
          Báo cáo chi tiết số lượt đăng kí theo khoảng thời gian
        </a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-user")}
        >
          Xem báo cáo
        </a>
      </div>
      <div className="div-item-report">
        <a className="text-title">Báo cáo lượt giới thiệu</a>
        <a className="text-details">Báo cáo lượt giới thiệu trong ngày</a>
        <a
          className="text-see-report"
          onClick={() =>
            navigate("/report/manage-report/report-customer-invite")
          }
        >
          Xem báo cáo
        </a>
      </div>

      <div className="div-item-report">
        <a className="text-title">Báo cáo khách hàng theo khu vực</a>
        <a className="text-details">Báo cáo tổng số khách hàng trong khu vực</a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-customer-area")}
        >
          Xem báo cáo
        </a>
      </div>
    </div>
  );
};

export default ManageReportCustomer;
