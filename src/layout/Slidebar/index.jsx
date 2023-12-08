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
import { useSelector } from "react-redux";
import logo from "../../assets/images/LogoS.png";
import router from "../../routes/router";
import { Layout, Menu } from 'antd';
import "./index.scss";
import { useNavigate } from "react-router-dom";
const { Header, Sider, Content } = Layout;

const Sidebar = ({ hide }) => {
  const navigate = useNavigate();
  const checkElement = useSelector(getElementState);
  const permission = useSelector(getPermissionState);

  let menuItem = []
  for(const item of router) {
    const havePermission = permission.filter(x => x.id_side_bar === item.type)
    if(havePermission.length > 0) {
      menuItem.push(item)
    }
  }



  const onClick: MenuProps['onClick'] = (e) => {
    navigate(e.key);
  };
  const typeDate = window.location.pathname;
  return (
    <>
      <div className="div-logo">
        <img src={logo} className="img-logo" />
      </div>
      <div className="demo-logo-vertical" />
      <Menu
        onClick={onClick}
        defaultSelectedKeys={[typeDate]}
        mode="inline"
        theme="light"
        items={menuItem}
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
