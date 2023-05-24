import { useNavigate } from "react-router-dom";
import "./styles.scss";

const ManageReportOrder = () => {
  const navigate = useNavigate();
  return (
    <div className="container-report-order">
      <div className="div-item-report">
        <a className="text-title">Báo cáo đơn hàng</a>
        <a className="text-details">
          Báo cáo chi tiết từng ca làm trong khoảng thời gian
        </a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-order")}
        >
          Xem báo cáo
        </a>
      </div>
      <div className="div-item-report">
        <a className="text-title">Báo cáo đơn hàng theo ngày</a>
        <a className="text-details">Báo cáo tất cả đơn hàng trong một ngày</a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-order-daily")}
        >
          Xem báo cáo
        </a>
      </div>

      <div className="div-item-report">
        <a className="text-title">Báo cáo đơn hàng theo khu vực</a>
        <a className="text-details">Báo cáo tổng số đơn hàng trong khu vực</a>
        <a
          className="text-see-report"
          onClick={() => navigate("/report/manage-report/report-order-area")}
        >
          Xem báo cáo
        </a>
      </div>

      <div className="div-item-report">
        <a className="text-title">Báo cáo đơn hàng theo khách hàng</a>
        <a className="text-details">
          Báo cáo tổng số đơn hàng theo khách hàng mới cũ
        </a>
        <a
          className="text-see-report"
          onClick={() =>
            navigate("/report/manage-report/report-order-customer")
          }
        >
          Xem báo cáo
        </a>
      </div>
    </div>
  );
};

export default ManageReportOrder;
