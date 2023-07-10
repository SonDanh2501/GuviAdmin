import { CameraOutlined } from "@material-ui/icons";
import { Col, FloatButton, Image, Row, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useParams } from "react-router-dom";
import { Card, CardBody, CardHeader, Container } from "reactstrap";
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
import { getLanguageState } from "../../../../../redux/selectors/auth";
import i18n from "../../../../../i18n";
import Overview from "./components/overview";
// core components

const ProfileCollaborator = () => {
  // const { state } = useLocation();
  // const { id } = state || {};
  const [data, setData] = useState({
    avatar: "",
    birthday: "2000-06-07T00:00:00.000Z",
    identity_date: "2020-11-12T00:00:00.000Z",
  });
  const [img, setImg] = useState("");
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id;
  const lang = useSelector(getLanguageState);

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
    const extend = e.target.files[0].type.slice(
      e.target.files[0].type.indexOf("/") + 1
    );
    if (e.target.files[0]) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setImg(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
    const file = e.target.files[0];
    const image = await resizeFile(file, extend);
    const formData = new FormData();
    formData.append("multi-files", image);
    dispatch(loadingAction.loadingRequest(true));
    postFile(formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((res) => {
        setImg(res[0]);
        dispatch(loadingAction.loadingRequest(false));
      })
      .catch((err) => {
        setImg("");
        errorNotify({
          message: err,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  return (
    <>
      <Row gutter={16}>
        <Col span={18}>
          <div className="div-tab-profile-collaborator">
            <Tabs defaultActiveKey="1">
              <Tabs.TabPane tab="Tổng quan" key="1">
                <Overview id={id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={`${i18n.t("info", { lng: lang })}`} key="2">
                <Information
                  data={data}
                  image={img}
                  idCTV={id}
                  setData={setData}
                />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${i18n.t("document", { lng: lang })}`}
                key="3"
              >
                <Document id={data?._id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${i18n.t("activity", { lng: lang })}`}
                key="4"
              >
                <Activity id={id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${i18n.t("account_history", { lng: lang })}`}
                key="5"
              >
                <History id={id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${i18n.t("topup_withdraw", { lng: lang })}`}
                key="6"
              >
                <WithdrawTopup id={id} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={`${i18n.t("review", { lng: lang })}`} key="7">
                <Review id={id} totalReview={data?.star} />
              </Tabs.TabPane>
              <Tabs.TabPane tab={`${i18n.t("test", { lng: lang })}`} key="8">
                <TestExam id={data?._id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${i18n.t("referrals", { lng: lang })}`}
                key="9"
              >
                <InviteCollaborator id={data?._id} />
              </Tabs.TabPane>
              <Tabs.TabPane
                tab={`${i18n.t("bank_account", { lng: lang })}`}
                key="10"
              >
                <BankAccount id={data?._id} />
              </Tabs.TabPane>
            </Tabs>
          </div>
        </Col>
        <Col span={6}>
          <div className="div-card-profile">
            <div className="headerCard">
              <Image
                style={{
                  width: 100,
                  height: 100,
                  backgroundColor: "transparent",
                  borderRadius: 10,
                }}
                src={img ? img : data?.avatar ? data?.avatar : user}
                // className="rounded-circle"
              />
              <label for="choose-image">
                <CameraOutlined /> {`${i18n.t("choose_image", { lng: lang })}`}
              </label>
              <input
                name="image"
                type="file"
                placeholder=""
                accept={".jpg,.png,.jpeg"}
                id="choose-image"
                onChange={onChangeThumbnail}
              />
            </div>
            <div>
              <div className="text-body">
                {data?.password_default && (
                  <a>
                    {`${i18n.t("default_password", { lng: lang })}`}:{" "}
                    {data?.password_default}
                  </a>
                )}
                {data?.invite_code && (
                  <a>
                    {`${i18n.t("code_invite", { lng: lang })}`}:{" "}
                    {data?.invite_code}
                  </a>
                )}
                <a className="text-name">{data?.full_name}</a>
                <a>
                  {!data?.birthday
                    ? ""
                    : `${i18n.t("age", { lng: lang })}` +
                      ": " +
                      moment().diff(data?.birthday, "years")}
                </a>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      <FloatButton.BackTop />
    </>
  );
};

export default ProfileCollaborator;
