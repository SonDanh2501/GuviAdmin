// reactstrap components
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardBody, CardTitle, Container, Row, Col } from "reactstrap";
import { getTotalReportApi } from "../../../../api/statistic";
import { formatMoney } from "../../../../helper/formatMoney";
import { getCollaborator } from "../../../../redux/selectors/collaborator";
import { getCustomer } from "../../../../redux/selectors/customer";
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
                <Card className="card-stats mb-4 mb-xl-0 card-center">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Doanh thu
                        </CardTitle>
                        <span className="h5 font-weight-bold mb-0">
                          {formatMoney(dataTotal?.total_revenue)}
                        </span>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 card-center">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Tổng đơn hàng
                        </CardTitle>
                        <span className="h5 font-weight-bold mb-0">
                          {dataTotal?.total_order}
                        </span>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 card-center">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Khách hàng
                        </CardTitle>
                        <span className="h5 font-weight-bold mb-0">
                          {dataTotal?.total_customer}
                        </span>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
              <Col lg="6" xl="3">
                <Card className="card-stats mb-4 mb-xl-0 card-center">
                  <CardBody>
                    <Row>
                      <div className="col">
                        <CardTitle
                          tag="h5"
                          className="text-uppercase text-muted mb-0"
                        >
                          Cộng tác viên
                        </CardTitle>
                        <span className="h5 font-weight-bold mb-0 ">
                          {dataTotal?.total_collaborator}
                        </span>
                      </div>
                    </Row>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        </Container>
      </div>
    </>
  );
};

export default Header;
