import { NavLink } from "react-router-dom";

import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { useEffect, useState } from "react";
import {
  getElementState,
  getLanguageState,
  getPermissionState,
} from "../../redux/selectors/auth";
import logo from "../../assets/images/LogoS.png";
import router from "../../routes/router";
import { Layout, Menu } from 'antd';
import "./index.scss";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const Sidebar = ({ hide }) => {
  const navigate = useNavigate();
  const onClick: MenuProps['onClick'] = (e) => {
    console.log('click', e);
    navigate(e.key);
  };
  return (
    <>
      <div className="div-logo">
        <img src={logo} className="img-logo" />
      </div>
      <div className="demo-logo-vertical" />
      <Menu
        onClick={onClick}
        defaultSelectedKeys={[router[0].key]}
        mode="inline"
        theme="light"
        items={router}
        style={{ height: "100%" }}
      />
    </>
  );


  // return (
  //   <>

  //   </>
  // )

};

export default Sidebar;
