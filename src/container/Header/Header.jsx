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
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeToken } from "../../helper/tokenHelper";
import { languageAction, logoutAction } from "../../redux/actions/auth";
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

const {IoPeopleOutline, IoHomeOutline, IoHome, IoPeople} = icons;
const { Option } = Select;

const MainPort = Number(process.env.REACT_APP_PORT_MAIN);
const AffiliatePort = Number(process.env.REACT_APP_PORT_AFFILIATE);

const Header = ({ onClick, hide }) => {
  const currentPort = Number(window.location.port);
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
  const onLogout = () => {
    removeToken();
    dispatch(loadingAction.loadingRequest(true));
    dispatch(logoutAction.logoutRequest(navigate));
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

  return (
    <>
      {currentPort === MainPort && (
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
      {currentPort === AffiliatePort && (
        <div className="header-navigation-affiliate">
          <div className="header-navigation-affiliate__left">
            <div
              className="header-navigation-affiliate__icon"
              onClick={onClick}
            >
              <IoMenu />
            </div>
            <img
              className="header-navigation-affiliate__logo"
              src={logoGuvi}
            ></img>
            <span
              onClick={() => {
                navigate("/");
                setIsActivated(0);
              }}
              className={`header-navigation-affiliate__button ${
                isActivated === 0 && "activated"
              }`}
            >
              <IoHome size="16px" />
              Affiliate
            </span>
            <span
              onClick={() => {
                navigate("/referend-list");
                setIsActivated(1);
              }}
              className={`header-navigation-affiliate__button ${
                isActivated === 1 && "activated"
              }`}
            >
              <IoPeople size="16px" />
              DS người giới thiệu
            </span>
          </div>
          <div className="header-navigation-affiliate__right">
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
                <IoPersonCircle size="22px" color="#475569" />
                <a className="header-navigation__right--user-info-name">
                  {user?.full_name}
                </a>
                <CaretDownOutlined className="icon-down" />
              </span>
            </Dropdown>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
