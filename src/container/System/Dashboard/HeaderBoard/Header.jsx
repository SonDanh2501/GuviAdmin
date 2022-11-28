// reactstrap components
import { useEffect, useState } from "react";
import { Col, Container, Row } from "reactstrap";
import { getTotalReportApi } from "../../../../api/statistic";
import { formatMoney } from "../../../../helper/formatMoney";
import revenues from "../../../../assets/images/revenues.png";
import add from "../../../../assets/images/add.png";
import customer from "../../../../assets/images/customer.png";
import collaborator from "../../../../assets/images/collaborator.png";
import "./header.scss";

const Header = () => {
  const [dataTotal, setDataTotal] = useState([]);
  useEffect(() => {
    getTotalReportApi()
      .then((res) => setDataTotal(res))
      .catch((err) => console.log(err));
  }, []);
  return (
    <>
      <div className="header pb-8  pt-md-6 gradient-header">
        <Container fluid>
          <div className="header-body">
            {/* Card stats */}
            <Row>
              <Col lg="6" xl="3">
                <div className="card">
                  <p className="text-title"> Doanh thu</p>
                  <div className="div-details">
                    <img src={revenues} className="img" />
                    <p className="text-details">
                      {formatMoney(
                        !dataTotal?.total_revenue ? 0 : dataTotal?.total_revenue
                      )}
                    </p>
                  </div>
                </div>
              </Col>
              <Col lg="6" xl="3">
                <div className="card">
                  <p className="text-title"> Tổng đơn hàng</p>
                  <div className="div-details">
                    <img src={add} className="img" />
                    <p className="text-details">
                      {!dataTotal?.total_order ? 0 : dataTotal?.total_order}
                    </p>
                  </div>
                </div>
              </Col>
              <Col lg="6" xl="3">
                <div className="card">
                  <p className="text-title">Khách hàng</p>
                  <div className="div-details">
                    <img src={customer} className="img" />
                    <p className="text-details">
                      {!dataTotal?.total_customer
                        ? 0
                        : dataTotal?.total_customer}
                    </p>
                  </div>
                </div>
              </Col>
              <Col lg="6" xl="3">
                <div className="card">
                  <p className="text-title"> Cộng tác viên</p>
                  <div className="div-details">
                    <img src={collaborator} className="img" />
                    <p className="text-details">
                      {!dataTotal?.total_collaborator
                        ? 0
                        : dataTotal?.total_collaborator}
                    </p>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
