import {
  BellOutlined,
  CaretDownOutlined,
  DownCircleTwoTone,
  DownOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import { Dropdown, List, Select, Space, Opti, Tooltip, Drawer, Popover, Button } from "antd";
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
import Sidebar from "../../layout/Slidebar";
const { Option } = Select;

const Header = ({ onClick, hide }) => {
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
    // console.log("check onclick ",e)
    setSelectedLanguage(e);
    dispatch(languageAction.languageRequest({ language: e }));
  };

  return (
    <div className="div-container-header">
      <div className="menu-icon" onClick={onClick}>
        <IoMenu size={"18px"} />
      </div>
      <div className="nav-header">
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
            className="div-noti"
          >
            <IoLanguage size={"18px"} />
          </div>
        </Popover>
        {/*Darkmode, lightmode*/}
        {/* <Tooltip placement="bottom" title="Bật/tắt chế độ tối">
          <div
            onMouseEnter={() => {
              setIsHover(true);
            }}
            onMouseLeave={() => {
              setIsHover(false);
            }}
            className="div-noti"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? (
              <IoSunnyOutline size={"1.4rem"} />
            ) : (
              <IoSunny size={"1.4rem"} />
            )}
          </div>
        </Tooltip> */}
        {/*Notification Drop Down Menu*/}
        <Tooltip placement="bottom" title="Thông báo">
          <div
            onMouseEnter={() => {
              setIsHover(true);
            }}
            onMouseLeave={() => {
              setIsHover(false);
            }}
            className="div-noti"
            onClick={() => setStatus(!status)}
          >
            <IoNotifications size={"18px"} />
          </div>
        </Tooltip>
        {/* {status && (
          <div className="list shadow-blue-400">
            <List
              itemLayout="horizontal"
              dataSource={[1, 2, 3, 4]}
              renderItem={(item) => {
                return (
                  <div onClick={() => setStatus(false)}>
                    <a>Lee Minh dang</a>
                  </div>
                );
              }}
            />
          </div>
        )} */}
        {/*Drop down select language */}
        {/* <div
          onClick={() => setIsSelectLanguage(!isSelectLanguage)}
          className="div-language"
        >
          <img
            src={
              selectedLanguage === "vi"
                ? logoCircleVN
                : selectedLanguage === "en"
                ? logoCircleUS
                : logoCircleVN // Default value
            }
          ></img>
        </div> */}
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
            className="flex items-center justify-center gap-2"
            onClick={(e) => e.preventDefault()}
          >
            {/* <img style={{ height: "26px" }} src={defaultAvatar}></img> */}
            <IoPersonCircle size="18px" color="#475569" />
            <a className="text-name">{user?.full_name}</a>
            <CaretDownOutlined className="icon-down" />
          </span>
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
