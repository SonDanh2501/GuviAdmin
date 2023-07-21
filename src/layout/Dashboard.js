import { Layout } from "antd";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderBar from "../container/Header/Header";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { permissionAction } from "../redux/actions/auth";
import { getProvinceAction } from "../redux/actions/service";
import "./Dashboard.scss";
import Admin from "./admin";
import useWindowDimensions from "../helper/useWindowDimensions";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width } = useWindowDimensions;
  useEffect(() => {
    dispatch(permissionAction.permissionRequest({ navigate: navigate }));
    dispatch(getProvinceAction.getProvinceRequest());
  }, []);

  useEffect(() => {
    if (window.innerWidth > 468) {
      setCollapsed(true);
    } else {
      setCollapsed(false);
    }
  }, [window]);

  return (
    <Layout style={{ width: "100%" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={!collapsed}
        style={{
          background: "white",
          overflow: "auto",
          height: "120vh",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <Sidebar hide={collapsed} />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: "#38BDF8",
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            marginLeft: 10,
            marginRight: 10,
          }}
        >
          <HeaderBar
            onClick={() => setCollapsed(!collapsed)}
            hide={collapsed}
          />
        </Header>
        <Content
          style={{
            margin: 10,
            padding: 10,
            minHeight: 280,
            background: "white",
            borderRadius: 8,
          }}
        >
          <Admin />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
