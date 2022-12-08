import { Image, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Card, CardBody, CardHeader, Col, Container, Row } from "reactstrap";
import { getCollaboratorsById } from "../../../../../api/collaborator";
import { postFile } from "../../../../../api/file";
import user from "../../../../../assets/images/user.png";
import { loadingAction } from "../../../../../redux/actions/loading";
import Activity from "./components/activity";
import Document from "./components/documents";
import Information from "./components/information";
import "./ProfileCollaborator.scss";
// core components

const ProfileCollaborator = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState({
    avatar: "",
    birthday: "2000-06-07T00:00:00.000Z",
    identity_date: "2020-11-12T00:00:00.000Z",
  });
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getCollaboratorsById(id)
      .then((res) => {
        setData(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => console.log(err));
  }, [id]);

  return (
    <>
      {/* Page content */}
      <Container className="mt--7" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="4">
            <Card className="card-profile shadow">
              <CardHeader className="headerCard">
                <Image
                  style={{
                    with: 200,
                    height: 200,
                    backgroundColor: "transparent",
                  }}
                  src={data?.avatar ? data?.avatar : user}
                  className="rounded-circle"
                />
              </CardHeader>
              <CardBody>
                <div className="text-center">
                  <h3>
                    {data?.name}{" "}
                    <span className="font-weight-light">
                      ,{moment().diff(data?.birthday, "years")} tuổi
                    </span>
                  </h3>
                </div>
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
                    <Activity id={id} />
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
