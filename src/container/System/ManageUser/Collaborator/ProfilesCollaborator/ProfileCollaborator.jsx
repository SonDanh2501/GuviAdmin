import { CameraOutlined } from "@material-ui/icons";
import { FloatButton, Image, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import {
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
  Input,
} from "reactstrap";
import { getCollaboratorsById } from "../../../../../api/collaborator";
import { getDistrictApi, postFile } from "../../../../../api/file";
import user from "../../../../../assets/images/user.png";
import resizeFile from "../../../../../helper/resizer";
import { errorNotify } from "../../../../../helper/toast";
import { loadingAction } from "../../../../../redux/actions/loading";
import Activity from "./components/activity";
import BankAccount from "./components/bankAccount";
import Document from "./components/documents";
import History from "./components/history";
import Information from "./components/information";
import Review from "./components/review";
import WithdrawTopup from "./components/withdrawTopup";
import "./ProfileCollaborator.scss";
import TestExam from "./components/testExam";
import InviteCollaborator from "./components/invite";
// core components

const ProfileCollaborator = () => {
  const { state } = useLocation();
  const { id } = state || {};
  const [data, setData] = useState({
    avatar: "",
    birthday: "2000-06-07T00:00:00.000Z",
    identity_date: "2020-11-12T00:00:00.000Z",
  });
  const [img, setImg] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadingAction.loadingRequest(true));
    getCollaboratorsById(id)
      .then((res) => {
        setData(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  }, [id]);

  const onChangeThumbnail = async (e) => {
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImg(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    const image = await resizeFile(file);
    const formData = new FormData();
    formData.append("file", image);
    dispatch(loadingAction.loadingRequest(true));
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImg(res);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  return (
    <>
      {/* Page content */}
      <Container className="mt-3" fluid>
        <Row>
          <Col className="order-xl-2 mb-5 mb-xl-0" xl="3">
            <Card className="card-profile shadow">
              <CardHeader className="headerCard">
                <Image
                  style={{
                    with: 200,
                    height: 200,
                    backgroundColor: "transparent",
                  }}
                  src={img ? img : data?.avatar ? data?.avatar : user}
                  className="rounded-circle"
                />
                <label for="choose-image">
                  <CameraOutlined /> Chọn ảnh khác
                </label>
                <input
                  name="image"
                  type="file"
                  placeholder=""
                  accept={".jpg,.png,.jpeg"}
                  id="choose-image"
                  onChange={onChangeThumbnail}
                />
              </CardHeader>
              <CardBody>
                <div className="text-body">
                  {data?.password_default && (
                    <a>Mật khẩu mặc định: {data?.password_default}</a>
                  )}
                  {data?.invite_code && (
                    <a>Mã giới thiệu: {data?.invite_code}</a>
                  )}
                  <a className="text-name">{data?.full_name}</a>
                  <a>
                    {!data?.birthday
                      ? ""
                      : "Tuổi:" + " " + moment().diff(data?.birthday, "years")}
                  </a>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col className="order-xl-1" xl="9">
            <Card className="bg-white shadow">
              <CardBody>
                <Tabs defaultActiveKey="1">
                  <Tabs.TabPane tab="Thông tin cơ bản" key="1">
                    <Information
                      data={data}
                      image={img}
                      idCTV={id}
                      setData={setData}
                    />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Tài liệu" key="2">
                    <Document id={data?._id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Hoạt động" key="3">
                    <Activity id={id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Lịch sử tài khoản" key="4">
                    <History id={id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Yêu cầu nạp/rút" key="5">
                    <WithdrawTopup id={id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Đánh giá" key="6">
                    <Review id={id} totalReview={data?.star} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Bài kiểm tra" key="7">
                    <TestExam id={data?._id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Lượt giới thiệu" key="8">
                    <InviteCollaborator id={data?._id} />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Tài khoản ngân hàng" key="9">
                    <BankAccount id={data?._id} />
                  </Tabs.TabPane>
                </Tabs>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
      <FloatButton.BackTop />
    </>
  );
};

export default ProfileCollaborator;
