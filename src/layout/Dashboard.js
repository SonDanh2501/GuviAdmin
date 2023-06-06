import { Layout } from "antd";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderBar from "../container/Header/Header";

import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../redux/selectors/auth";
import "./Dashboard.scss";
import Admin from "./admin";

import { permissionAction } from "../redux/actions/auth";
import { useNavigate } from "react-router-dom";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(permissionAction.permissionRequest({ navigate: navigate }));
  }, []);

  return (
    <Layout>
      {hideSidebar && (
        <Sider
          width={230}
          style={{
            background: "white",
            overflow: "auto",
            height: "100vh",
            position: "fixed",
            left: 0,
            top: 0,
            bottom: 0,
          }}
        >
          <Sidebar />
        </Sider>
      )}

      <Layout
        className="site-layout"
        style={{ marginLeft: hideSidebar ? 230 : 0 }}
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            marginLeft: 20,
            marginRight: 20,
            borderRadius: 4,
            backgroundColor: "#7dbcea",
          }}
        >
          <HeaderBar onClick={() => setHideSidebar(!hideSidebar)} />
        </Header>
        <Layout
          style={{
            padding: "24px 24px",
            minHeight: "100%",
          }}
        >
          <Content
            style={{
              minHeight: 680,
              background: "white",
              borderRadius: 4,
              padding: 24,
            }}
          >
            <Admin />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
