import {
  BellOutlined,
  CaretDownOutlined,
  DownCircleTwoTone,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import {
  Dropdown,
  List,
  Select,
  Space,
  Opti,
  Tooltip,
  Drawer,
  Popover,
  Button,
} from "antd";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../helper/tokenHelper";
import {
  languageAction,
  logoutAction,
  logoutAffiliateAction,
} from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import { getLanguageState, getUser } from "../../redux/selectors/auth";
import "./Header.scss";
import {
  IoMenu,
  IoNotifications,
  IoNotificationsOutline,
  IoAirplane,
  IoSunny,
  IoSunnyOutline,
  IoGlobeOutline,
  IoCaretForwardOutline,
  IoPersonCircle,
  IoPersonCircleOutline,
  IoLanguage,
} from "react-icons/io5";

import logoVN from "../../assets/images/flag_vietnam.svg";
import logoUS from "../../assets/images/flag_american.svg";
import logoGuvi from "../../assets/images/LogoS.svg";
import Sidebar from "../../layout/Slidebar";
import icons from "../../utils/icons";
import { getCustomerInfoAffiliateApi } from "../../api/affeliate";
import { errorNotify } from "../../helper/toast";

const { IoPeopleOutline, IoHomeOutline, IoHome, IoPeople } = icons;
const { Option } = Select;

const MainPort = Number(process.env.REACT_APP_PORT_MAIN);
const AffiliatePort = Number(process.env.REACT_APP_PORT_AFFILIATE);

const Header = ({ onClick, hide }) => {
  const currentPort = Number(window.location.port);
  const urlPath = window.location.pathname;
  const currentUrl = window.location.hostname; // Đường link URL hiện tại (dùng để phân biệt chạy affiliate hay admin trên môi trường product)
  const currentUrlName = currentUrl.split(".")[0];
  const dispatch = useDispatch();
  const [data, setDate] = useState([]);
  const [status, setStatus] = useState(false);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const lang = useSelector(getLanguageState);
  const [isSelectLanguage, setIsSelectLanguage] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [isHover, setIsHover] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isActivated, setIsActivated] = useState(0);
  const [valueUserInfo, setValueUserInfo] = useState([]);
  const onLogout = () => {
    if (currentPort === MainPort) {
      removeToken();
      dispatch(loadingAction.loadingRequest(true));
      dispatch(logoutAction.logoutRequest(navigate));
    } else {
      removeToken();
      dispatch(loadingAction.loadingRequest(true));
      dispatch(logoutAffiliateAction.logoutAffiliateRequest(navigate));
    }
  };
  const languageItems = [
    {
      key: "0",
      label: (
        <div
          onClick={() => handleChange("vi")}
          className="flex gap-2 items-center cursor-pointer py-1 rounded-md duration-300 hover:text-violet-500"
        >
          <img className="h-[25px]" src={logoVN}></img>
          <span className="font-medium">Vietnamese</span>
        </div>
      ),
    },
    {
      key: "1",
      label: (
        <div
          onClick={() => handleChange("en")}
          className="flex gap-2 items-center cursor-pointer py-1 rounded-md duration-300 hover:text-violet-500 mt-1"
        >
          <img className="h-[25px]" src={logoUS}></img>
          <span className="font-medium">English</span>
        </div>
      ),
    },
  ];
  const items = [
    {
      label: <a onClick={onLogout}>Logout</a>,
      key: "0",
    },
  ];
  const handleChange = (e) => {
    setSelectedLanguage(e);
    dispatch(languageAction.languageRequest({ language: e }));
  };
  const fetchCustomerInfo = async () => {
    try {
      const res = await getCustomerInfoAffiliateApi();
      setValueUserInfo(res);
    } catch (err) {
      errorNotify({
        message: err?.message,
      });
    }
  };
  useEffect(() => {
    if (
      currentPort !== MainPort &&
      (currentUrlName !== "admin" ||
        currentUrlName !== "admin-dev" ||
        currentUrlName !== "admin-test")
    ) {
      fetchCustomerInfo();
    }
  }, []);

  useEffect(() => {
    if (urlPath.substring(1) === "") setIsActivated(1);
    if (urlPath.substring(1) === "referend-list") setIsActivated(2);
  }, []);
  return (
    <>
       {(currentPort === MainPort ||
        currentUrlName === "admin" ||
        currentUrlName === "admin-dev" ||
        currentUrlName === "admin-test") && (
        <div className="header-navigation">
          <div className="header-navigation__left">
            <div className="header-navigation__left--icon" onClick={onClick}>
              <IoMenu size={"18px"} />
            </div>
            <span className="header-navigation__left--version">
              Version 1.0.1
            </span>
          </div>
          <div className="header-navigation__right">
            <Popover
              content={
                <div className="list">
                  <List
                    itemLayout="horizontal"
                    dataSource={languageItems}
                    renderItem={(item) => {
                      return (
                        <div className="">
                          <a>{item.label}</a>
                        </div>
                      );
                    }}
                  />
                </div>
              }
              title="Ngôn ngữ"
            >
              <div
                onMouseEnter={() => {
                  setIsHover(true);
                }}
                onMouseLeave={() => {
                  setIsHover(false);
                }}
                className="header-navigation__right--icon"
              >
                <IoLanguage size={"18px"} />
              </div>
            </Popover>
            {/*Notification Drop Down Menu*/}
            <Tooltip placement="bottom" title="Thông báo">
              <div
                onMouseEnter={() => {
                  setIsHover(true);
                }}
                onMouseLeave={() => {
                  setIsHover(false);
                }}
                className="header-navigation__right--icon"
                onClick={() => setStatus(!status)}
              >
                <IoNotifications size={"18px"} />
              </div>
            </Tooltip>

            {/*Sign Out Drop Down Menu*/}
            <Dropdown
              arrow={true}
              placement="bottomCenter"
              menu={{
                items,
              }}
              trigger={["click"]}
            >
              <span
                className="header-navigation__right--user-info"
                onClick={(e) => e.preventDefault()}
              >
                <IoPersonCircle size="18px" color="#475569" />
                <a className="header-navigation__right--user-info-name">
                  {user?.full_name}
                </a>
                <CaretDownOutlined className="icon-down" />
              </span>
            </Dropdown>
          </div>
        </div>
      )}
      {(currentPort === AffiliatePort ||
        currentUrlName === "affiliate" ||
        currentUrlName === "affiliate-dev" ||
        currentUrlName === "affiliate-test") && (
        <div className="header-navigation-affiliate">
          <div className="header-navigation-affiliate__left">
            <img
              className="header-navigation-affiliate__logo"
              src={logoGuvi}
            ></img>
            <span
              onClick={() => {
                navigate("/");
                setIsActivated(1);
              }}
              className={`header-navigation-affiliate__button ${
                isActivated === 1 && "activated"
              }`}
            >
              <IoHome size="16px" />
              Affiliate
            </span>
            <span
              onClick={() => {
                navigate("/referend-list");
                setIsActivated(2);
              }}
              className={`header-navigation-affiliate__button ${
                isActivated === 2 && "activated"
              }`}
            >
              <IoPeople size="16px" />
              DS người giới thiệu
            </span>
          </div>
          <Dropdown
            arrow={true}
            placement="bottomCenter"
            menu={{
              items,
            }}
            trigger={["click"]}
          >
            <div className="header-navigation-affiliate__right">
              <div className="header-navigation-affiliate__right--icon">
                <IoPersonCircle />
              </div>
              <div className="header-navigation-affiliate__right--info">
                <span className="eader-navigation-affiliate__right--info-name">
                  {valueUserInfo?.full_name}
                </span>
                <div className="header-navigation-affiliate__right--info-icon-down">
                  <CaretDownOutlined />
                </div>
              </div>
            </div>
          </Dropdown>
        </div>
      )}
    </>
  );
};

export default Header;
