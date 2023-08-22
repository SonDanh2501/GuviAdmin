import { Drawer, Layout } from "antd";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderBar from "../container/Header/Header";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getUserAction, permissionAction } from "../redux/actions/auth";
import { getProvinceAction } from "../redux/actions/service";
import "./Dashboard.scss";
import Admin from "./admin";
import useWindowDimensions from "../helper/useWindowDimensions";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [collapsed, setCollapsed] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { width } = useWindowDimensions();
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
    // <Layout hasSider>
    //   {width > 900 ? (
    //     <Sider
    //       trigger={null}
    //       collapsible
    //       collapsed={!collapsed}
    //       style={{
    //         overflow: "auto",
    //         height: "100vh",
    //         position: "fixed",
    //         left: 0,
    //         top: 0,
    //         bottom: 0,
    //         backgroundColor: "white",
    //       }}
    //     >
    //       <Sidebar hide={collapsed} />
    //     </Sider>
    //   ) : (
    //     <Drawer
    //       open={collapsed}
    //       width={300}
    //       onClose={() => setCollapsed(false)}
    //       placement="left"
    //       headerStyle={{ height: 30, paddingLeft: 0 }}
    //     >
    //       <Sidebar hide={true} />
    //     </Drawer>
    //   )}
    //   <Layout
    //     className="site-layout"
    //     style={{
    //       marginLeft: width < 900 ? 10 : collapsed ? 200 : 80,
    //       height: "auto",
    //       width: "80%",
    //     }}
    //   >
    //     <Header
    //       style={{
    //         padding: 0,
    //         background: "#38BDF8",
    //         borderBottomLeftRadius: 8,
    //         borderBottomRightRadius: 8,
    //         marginLeft: 10,
    //         marginRight: 10,
    //         position: "sticky",
    //         top: 0,
    //         zIndex: 1000,
    //       }}
    //     >
    //       <HeaderBar
    //         onClick={() => setCollapsed(!collapsed)}
    //         hide={collapsed}
    //       />
    //     </Header>
    //     <Content
    //       style={{
    //         margin: 10,
    //         padding: 10,
    //         minHeight: 900,
    //         background: "white",
    //         borderRadius: 8,
    //         overflow: "initial",
    //       }}
    //     >
    //       <Admin />
    //     </Content>
    //   </Layout>
    // </Layout>
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
            <Admin />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
