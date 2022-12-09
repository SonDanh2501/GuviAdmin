// reactstrap components
import { useCallback, useEffect, useState } from "react";
import { Col, Container, Input, Row } from "reactstrap";
import { getTotalReportApi } from "../../../../api/statistic";
import { formatMoney } from "../../../../helper/formatMoney";
import revenues from "../../../../assets/images/revenues.png";
import add from "../../../../assets/images/add.png";
import customer from "../../../../assets/images/customer.png";
import collaborator from "../../../../assets/images/collaborator.png";
import "./headerBoard.scss";
import moment from "moment";

const Header = () => {
  const [dataTotal, setDataTotal] = useState([]);
  useEffect(() => {
    getTotalReportApi("", "")
      .then((res) => setDataTotal(res))
      .catch((err) => console.log(err));
  }, []);

  const onChangeReport = useCallback((day) => {
    const start = moment().startOf("day").toISOString();
    const end = moment().endOf("day").toISOString();
    if (day === "day") {
      getTotalReportApi(start, end)
        .then((res) => setDataTotal(res))
        .catch((err) => console.log(err));
    } else {
      getTotalReportApi("", "")
        .then((res) => setDataTotal(res))
        .catch((err) => console.log(err));
    }
  }, []);
  return (
    <div className="container-header-board">
      {/* <Input
        name="selectType"
        type="select"
        className="selectType"
        onChange={(e) => onChangeReport(e.target.value)}
      >
        <option value="all">Tổng</option>
        <option value="day">Ngày hôm nay</option>
      </Input> */}

      <div className="header pb-8  pt-md-6">
        <div>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <div className="card">
                  <img src={customer} className="img" />
                  <div className="div-details">
                    <a className="text-title">Khách hàng</a>
                    <a className="text-detail">
                      {!dataTotal?.total_customer
                        ? 0
                        : dataTotal?.total_customer}
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg="6" xl="3">
                <div className="card">
                  <img src={collaborator} className="img" />
                  <div className="div-details">
                    <a className="text-title"> Cộng tác viên</a>
                    <a className="text-detail">
                      {!dataTotal?.total_collaborator
                        ? 0
                        : dataTotal?.total_collaborator}
                    </a>
                  </div>
                </div>
              </Col>

              <Col lg="6" xl="3">
                <div className="card">
                  <img src={add} className="img" />
                  <div className="div-details">
                    <a className="text-title"> Tổng đơn hàng</a>
                    <a className="text-detail">
                      {!dataTotal?.total_order ? 0 : dataTotal?.total_order}
                    </a>
                  </div>
                </div>
              </Col>
              <Col lg="6" xl="3">
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
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
