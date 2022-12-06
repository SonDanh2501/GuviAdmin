import { Tabs } from "antd";
import moment from "moment";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { postFile } from "../../../../../api/file";
import user from "../../../../../assets/images/user.png";
import { loadingAction } from "../../../../../redux/actions/loading";
import Document from "./components/documents";
import Information from "./components/information";
import "./ProfileCollaborator.scss";
// core components

const ProfileCollaborator = () => {
  const { state } = useLocation();
  const { data } = state || {};

  const age = moment().diff(data?.birthday, "years");

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
                {/* <div className="row-heading">
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
                </div> */}
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="8">
            <Card className="bg-white shadow">
              <CardBody>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Thông tin cơ bản" key="1">
                    <Information data={data} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Tài liệu" key="2">
                    <Document />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Hoạt động" key="3">
                    Content of Tab Pane 3
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Lịch sử tài khoản" key="4">
                    Content of Tab Pane 3
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Yêu cầu nạp/rút" key="5">
                    Content of Tab Pane 3
                  </Tabs.TabPane>
                </Tabs>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ProfileCollaborator;
