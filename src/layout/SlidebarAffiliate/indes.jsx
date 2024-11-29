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
import routerAffiliate from "../../routes/routerAffiliate";
import { ConfigProvider, Layout, Menu } from "antd";
import "./index.scss";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const SidebarAffiliate = ({ hide }) => {
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const permission = useSelector(getPermissionState);
  let menuItem = [];
  for (const item of routerAffiliate) {
    // const havePermission = permission.filter(
    //   (x) => x.id_side_bar === item.type
    // );
    // if (havePermission.length > 0) {
      menuItem.push(item);
    // }
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
              itemHeight: 35,
              iconMarginInlineEnd: 12, // Space between icon and text {default 10}
              iconSize: 18, // Icon size {default 14}
              collapsedIconSize: 18, // Icon size when collapse
              itemBorderRadius: 4, // Border của item
              itemMarginInline: 12, // Margin của item
              /* ~~~ Only color ~~~ */
              itemColor: "#475569", // Màu của item
              /* Color hover*/
              itemHoverColor: "#000000", // Màu của icon và text
              itemHoverBg: "#ebe0f8", // Màu của background
              /* Color for active (khi đè chuột xuống)*/
              itemActiveBg: "#ebe0f8", // Màu background
              /* Color for selected item */
              itemSelectedBg: "#8b5cf6", // Màu của item
              itemSelectedColor: "#F4F5FE", // Màu của icon và text
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

export default SidebarAffiliate;
