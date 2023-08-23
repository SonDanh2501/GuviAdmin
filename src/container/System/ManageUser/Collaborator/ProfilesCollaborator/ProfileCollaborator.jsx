import { CameraOutlined } from "@material-ui/icons";
import { FloatButton, Image, Tabs } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getCollaboratorsById } from "../../../../../api/collaborator";
import { postFile } from "../../../../../api/file";
import user from "../../../../../assets/images/user.png";
import resizeFile from "../../../../../helper/resizer";
import { errorNotify } from "../../../../../helper/toast";
import { useCookies } from "../../../../../helper/useCookies";
import i18n from "../../../../../i18n";
import { loadingAction } from "../../../../../redux/actions/loading";
import { getLanguageState } from "../../../../../redux/selectors/auth";
import "./ProfileCollaborator.scss";
import Activity from "./components/activity";
import BankAccount from "./components/bankAccount";
import Document from "./components/documents";
import History from "./components/history";
import Information from "./components/information";
import InviteCollaborator from "./components/invite";
import Overview from "./components/overview";
import Review from "./components/review";
import TestExam from "./components/testExam";
import WithdrawTopup from "./components/withdrawTopup";

const ProfileCollaborator = () => {
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
  const [saveToCookie, readCookie] = useCookies();
  const [activeKey, setActiveKey] = useState("1");
  const tabCookie = readCookie("tab-detail-ctv");

  useEffect(() => {
    window.scroll(0, 0);
    setActiveKey(tabCookie === "" ? "1" : tabCookie);
  }, [tabCookie]);

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
  }, [id, dispatch]);

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

  const onChangeTab = (key) => {
    saveToCookie("tab-detail-ctv", key);
    setActiveKey(key);
  };

  return (
    <div className="div-container-profile-ctv">
      <div className="div-tab-profile-collaborator">
        <Tabs defaultActiveKey="1" activeKey={activeKey} onChange={onChangeTab}>
          <Tabs.TabPane tab="Tổng quan" key="1">
            <Overview id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("info", { lng: lang })}`} key="2">
            <Information data={data} image={img} idCTV={id} setData={setData} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("document", { lng: lang })}`} key="3">
            <Document id={id} />
          </Tabs.TabPane>
          <Tabs.TabPane tab={`${i18n.t("activity", { lng: lang })}`} key="4">
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
          <Tabs.TabPane tab={`${i18n.t("referrals", { lng: lang })}`} key="9">
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
          {activeKey === "2" && (
            <>
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
            </>
          )}
        </div>
        <div className="mt-2">
          <div className="text-body">
            {data?.password_default && (
              <p style={{ margin: 0 }}>
                {`${i18n.t("default_password", { lng: lang })}`}:{" "}
                {data?.password_default}
              </p>
            )}
            {data?.invite_code && (
              <p style={{ margin: 0 }}>
                {`${i18n.t("code_invite", { lng: lang })}`}: {data?.invite_code}
              </p>
            )}
            <p className="text-name">{data?.full_name}</p>
            <p style={{ margin: 0 }}>
              {!data?.birthday
                ? ""
                : `${i18n.t("age", { lng: lang })}` +
                  ": " +
                  moment().diff(data?.birthday, "years")}
            </p>
          </div>
        </div>
      </div>

      <FloatButton.BackTop />
    </div>
  );
};

export default ProfileCollaborator;
