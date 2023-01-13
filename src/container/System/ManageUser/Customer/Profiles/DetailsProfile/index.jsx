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
import { formatMoney } from "../../../../../../helper/formatMoney";
import user from "../../../../../../assets/images/user.png";
import "./index.scss";
import { fetchCustomerById } from "../../../../../../api/customer";
import { FloatButton, Image } from "antd";
// core components

const DetailsProfile = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [rank, setRank] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchCustomerById(id)
      .then((res) => setData(res))
      .catch((err) => console.log(err));
  }, [id]);

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

  const age = moment().diff(data?.birthday, "years");

  return (
    <div className="mt-2">
      {/* Page content */}
      <Container className="mt-7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0 " xl="4">
            <div className="text-center">
              <Image
                style={{ width: 100, height: 100, alignSelf: "center" }}
                src={data?.avatar ? data?.avatar : user}
              />
              <h3 className="mt-5">
                {data?.full_name}{" "}
                <span className="font-weight-light">
                  {!data.birthday ? "" : age + "tuổi"}
                </span>
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
          </Col>
          <Col className="order-xl-1" xl="8">
            <div className="pl-lg-4">
              <Col lg="6">
                <h3 className="">Thông tin</h3>
                <FormGroup>
                  <label className="form-control-label" htmlFor="input-email">
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

                <FormGroup>
                  <label className="form-control-label" htmlFor="input-email">
                    Ngày sinh
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-email"
                    type="email"
                    value={
                      data?.birthday
                        ? moment(new Date(data?.birthday)).format("DD/MM/YYYY")
                        : "Chưa có"
                    }
                    disabled={true}
                  />
                </FormGroup>

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

                <FormGroup>
                  <label
                    className="form-control-label"
                    htmlFor="input-last-name"
                  >
                    Số điện thoại
                  </label>
                  <Input
                    className="form-control-alternative"
                    id="input-last-name"
                    type="text"
                    value={data?.phone}
                    disabled={true}
                  />
                </FormGroup>
              </Col>
              <Col lg="6">
                <h3 className="">Điểm thưởng</h3>
                <FormGroup>
                  <label className="form-control-label">Point</label>
                  <Input
                    className="form-control-alternative"
                    id="input-email"
                    type="email"
                    placeholder="Nhập số điểm thưởng"
                  />
                </FormGroup>

                <Button className="btn-update-point">Cập nhật</Button>
              </Col>
            </div>
          </Col>
        </Row>
      </Container>
      <FloatButton.BackTop />
    </div>
  );
};

export default DetailsProfile;
