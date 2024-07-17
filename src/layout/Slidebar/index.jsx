import { NavLink } from "react-router-dom";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import {
  getElementState,
  getLanguageState,
  getPermissionState,
} from "../../redux/selectors/auth";
import { useSelector } from "react-redux";
import logo from "../../assets/images/LogoS.svg";
import router from "../../routes/router";
import { ConfigProvider, Layout, Menu } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const Sidebar = ({ hide }) => {
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const permission = useSelector(getPermissionState);

  let menuItem = [];
  for (const item of router) {
    const havePermission = permission.filter(
      (x) => x.id_side_bar === item.type
    );
    if (havePermission.length > 0) {
      menuItem.push(item);
    }
  }

  const onClick = (e) => {
    navigate(e.key);
  };
  const typeDate = window.location.pathname;
  return (
    <>
      <div className="div-logo">
        <img src={logo} />
      </div>
      {/* <div className="demo-logo-vertical" /> */}
      <ConfigProvider
        theme={{
          components: {
            Menu: {
              iconMarginInlineEnd: 12, // Space between icon and text {default 10}
              iconSize: 22, // Icon size {default 14}
              collapsedIconSize: 22, // Icon size when collapse
              itemBorderRadius: 6, // Border của item
              itemMarginInline: hide ? 8 : 12, // Margin của item
              /* ~~~ Only color ~~~ */
              itemColor: "#000000", // Màu của item
              /* Color hover*/
              itemHoverColor: "#000000", // Màu của icon và text
              itemHoverBg: "#ebe0f8", // Màu của background
              /* Color for active (khi đè chuột xuống)*/
              itemActiveBg: "#ebe0f8", // Màu background
              /* Color for selected item */
              itemSelectedBg: "#d8c2f2", // Màu của item
              itemSelectedColor: "#000000", // Màu của icon và text
            },
          },
        }}
      >
        <Menu
          onClick={onClick}
          defaultSelectedKeys={[typeDate]}
          mode="inline"
          theme="light"
          items={menuItem}
        />
      </ConfigProvider>
    </>
  );
};

export default Sidebar;
