// reactstrap components
import moment from "moment";
import { useCallback, useEffect, useState } from "react";
import { Col, Row } from "reactstrap";
import { getTotalReportApi } from "../../../../api/statistic";
import add from "../../../../assets/images/add.png";
import collaborator from "../../../../assets/images/collaborator.png";
import customer from "../../../../assets/images/customer.png";
import revenues from "../../../../assets/images/revenues.png";
import { formatMoney } from "../../../../helper/formatMoney";
import "./headerBoard.scss";

const Header = () => {
  const [dataTotal, setDataTotal] = useState([]);
  useEffect(() => {
    getTotalReportApi("", "")
      .then((res) => setDataTotal(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <div className="container-header-board">
      <div className="card">
        <img src={customer} className="img" />
        <div className="div-details">
          <a className="text-title">Khách hàng</a>
          <a className="text-detail">
            {!dataTotal?.total_customer ? 0 : dataTotal?.total_customer}
          </a>
        </div>
      </div>

      <div className="card">
        <img src={collaborator} className="img" />
        <div className="div-details">
          <a className="text-title"> Cộng tác viên</a>
          <a className="text-detail">
            {!dataTotal?.total_collaborator ? 0 : dataTotal?.total_collaborator}
          </a>
        </div>
      </div>

      <div className="card">
        <img src={add} className="img" />
        <div className="div-details">
          <a className="text-title"> Tổng đơn hàng</a>
          <a className="text-detail">
            {!dataTotal?.total_order ? 0 : dataTotal?.total_order}
          </a>
        </div>
      </div>

      <div className="card">
        <img src={revenues} className="img" />
        <div className="div-details">
          <a className="text-title"> Doanh thu</a>
          <a className="text-detail">
            {formatMoney(
              !dataTotal?.total_revenue ? 0 : dataTotal?.total_revenue
            )}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Header;
