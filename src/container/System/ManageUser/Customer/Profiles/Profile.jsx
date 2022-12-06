import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Button,
  Card,
  CardHeader,
  CardBody,
  FormGroup,
  Form,
  Input,
  Container,
  Row,
  Col,
} from "reactstrap";
import { formatMoney } from "../../../../../helper/formatMoney";
import user from "../../../../../assets/images/user.png";
import "./Profile.scss";
// core components

const Profile = () => {
  const { state } = useLocation();
  const { data } = state || {};
  const [rank, setRank] = useState("");

  console.log(data);

  useEffect(() => {
    if (data?.rank_point < 100) {
      setRank("Thành viên");
    } else if (data?.rank_point >= 100 && data?.rank_point < 300) {
      setRank("Bạc");
    } else if (data?.rank_point >= 300 && data?.rank_point < 1500) {
      setRank("Vàng");
    } else {
      setRank("Kim cương");
    }
  }, [data]);
  const age = moment().diff(data?.birth_date, "years");

  return (
    <>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <CardHeader className="headerCard">
                <img
                  alt="..."
                  className="rounded-circle"
                  src={data?.avatar ? data?.avatar : user}
                />
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <h3>
                    {data?.name}{" "}
                    <span className="font-weight-light">,{age} tuổi</span>
                  </h3>
                </div>
                <div className="row-heading">
                  <div className="col-heading">
                    <span className="heading">{formatMoney(data?.cash)}</span>
                    <span className="description">G-point</span>
                  </div>
                  <div className="col-heading">
                    <span className="heading">{rank}</span>
                    <span className="description">Member point</span>
                  </div>
                  <div className="col-heading">
                    <span className="heading">
                      {formatMoney(data?.total_price)}
                    </span>
                    <span className="description">Total Price</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-white shadow">
              <CardHeader className="bg-white border-0"></CardHeader>
              <CardBody>
                <Form>
                  <h3 className="">Thông tin</h3>
                  <div className="pl-lg-4">
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Email
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-email"
                          type="email"
                          value={data?.email ? data?.email : "Chưa có"}
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-email"
                        >
                          Ngày sinh
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-email"
                          type="email"
                          value={
                            data?.birth_date ? data?.birth_date : "Chưa có"
                          }
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                    <Col lg="6">
                      <FormGroup>
                        <label
                          className="form-control-label"
                          htmlFor="input-last-name"
                        >
                          Giới tính
                        </label>
                        <Input
                          className="form-control-alternative"
                          id="input-last-name"
                          type="text"
                          value={
                            data?.gender === "male"
                              ? "Nam"
                              : data?.gender === "female"
                              ? "Nữ"
                              : data?.gender === "other"
                              ? "Khác"
                              : "Chưa có"
                          }
                          disabled={true}
                        />
                      </FormGroup>
                    </Col>
                  </div>
                  <hr className="my-4" />
                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Profile;
