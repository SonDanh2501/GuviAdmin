import { NavLink } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { Drawer, Layout, Menu, Button, theme, FloatButton } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
// import Sidebar from "../../components/Sidebar/Sidebar";
import Sidebar from "../Slidebar";
import { getUserAction, permissionAction } from "../../redux/actions/auth";
import { getProvinceAction } from "../../redux/actions/service";
import { useNavigate } from "react-router-dom";
import HeaderBar from "../../container/Header/Header";
import Admin from "../admin";
import useWindowDimensions from "../../helper/useWindowDimensions";
import "./index.scss";

import { useDispatch } from "react-redux";

const { Header, Sider, Content } = Layout;

const Main = ({ hide }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { width } = useWindowDimensions();

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(permissionAction.permissionRequest({ navigate: navigate }));
    dispatch(getProvinceAction.getProvinceRequest());
    dispatch(getUserAction.getUserRequest());
  }, [dispatch, navigate]);

  useEffect(() => {
    if (width > 900) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [width]);

  return (
    <Layout style={{ overflowX: "hidden" }}>
      <Header
        style={{
          padding: 0,
          background: "#38BDF8",
          borderBottomLeftRadius: 8,
          borderBottomRightRadius: 8,
          top: 0,
          zIndex: 1,
        }}
      >
        <HeaderBar onClick={() => setCollapsed(!collapsed)} hide={collapsed} />
      </Header>
      <Layout>
        {width > 900 ? (
          <Sider
            trigger={null}
            collapsible
            collapsed={!collapsed}
            style={{
              overflow: "auto",
              height: "100%",
              left: 0,
              top: 0,
              bottom: 0,
              backgroundColor: "white",
              borderRadius: 8,
              marginTop: 10,
              borderWidth: 1,
              borderColor: "yellow",
            }}
          >
            <Sidebar hide={collapsed} />
          </Sider>
        ) : (
          <Drawer
            open={collapsed}
            width={250}
            onClose={() => setCollapsed(false)}
            placement="left"
            headerStyle={{
              height: 30,
              paddingLeft: 0,
              display: "none",
              margin: 0,
            }}
          >
            <Sidebar hide={true} />
          </Drawer>
        )}
        <Layout>
          <Content
            style={{
              margin: 10,
              padding: 10,
              minHeight: 900,
              background: "white",
              borderRadius: 8,
              overflow: "initial",
            }}
          >
            <FloatButton.BackTop />

            <Admin />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Main;
