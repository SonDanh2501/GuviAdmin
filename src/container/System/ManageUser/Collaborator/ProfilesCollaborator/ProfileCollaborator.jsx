import { CameraOutlined } from "@material-ui/icons";
import { ConfigProvider, FloatButton, Image, Tabs } from "antd";
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
import useWindowDimensions from "../../../../../helper/useWindowDimensions";

const ProfileCollaborator = () => {
  const { width } = useWindowDimensions();
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
  const [isShowPhone, setIsShowPhone] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(data?.phone);
  const [isShowMore, setIsShowMore] = useState(false);

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
          message: err?.message,
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
          message: err?.message,
        });
        dispatch(loadingAction.loadingRequest(false));
      });
  };

  const onChangeTab = (key) => {
    saveToCookie("tab-detail-ctv", key);
    setActiveKey(key);
  };
  const hidePhoneNumber = (phone) => {
    if (phone) {
      let hidePhone = phone.toString().substring(0, 3);
      hidePhone = hidePhone + "*******";
      return hidePhone;
    }
  };

  return (
    <div>
      <div>
        <ConfigProvider
          theme={{
            components: {
              Tabs: {
                // inkBarColor: "#a855f7", //
              },
            },
          }}
        >
          <Tabs
            defaultActiveKey="1"
            activeKey={activeKey}
            onChange={onChangeTab}
          >
            <Tabs.TabPane tab="Tổng quan" key="1">
              <Overview id={id} star={data?.star} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${i18n.t("info", { lng: lang })}`} key="2">
              <Information
                data={data}
                image={img}
                idCTV={id}
                id={id}
                setData={setData}
              />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${i18n.t("activity", { lng: lang })}`} key="3">
              <Activity id={id} />
            </Tabs.TabPane>
            <Tabs.TabPane
              tab={`${i18n.t("account_history", { lng: lang })}`}
              key="4"
            >
              <History id={id} />
            </Tabs.TabPane>
            {/* <Tabs.TabPane
              tab={`${i18n.t("topup_withdraw", { lng: lang })}`}
              key="5"
            >
              <WithdrawTopup id={id} />
            </Tabs.TabPane> */}
            <Tabs.TabPane tab={`${i18n.t("review", { lng: lang })}`} key="6">
              <Review id={id} totalReview={data?.star} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${i18n.t("test", { lng: lang })}`} key="7">
              <TestExam id={data?._id} collaboratorData={data} />
            </Tabs.TabPane>
            <Tabs.TabPane tab={`${i18n.t("referrals", { lng: lang })}`} key="8">
              <InviteCollaborator id={data?._id} />
            </Tabs.TabPane>
          </Tabs>
        </ConfigProvider>
      </div>
      <FloatButton.BackTop />
    </div>
  );
};

export default ProfileCollaborator;
