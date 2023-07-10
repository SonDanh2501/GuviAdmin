import { Drawer, Layout } from "antd";
import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderBar from "../container/Header/Header";

import { useDispatch, useSelector } from "react-redux";
import "./Dashboard.scss";
import Admin from "./admin";

import { permissionAction } from "../redux/actions/auth";
import { useNavigate } from "react-router-dom";
import { getProvinceAction } from "../redux/actions/service";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(permissionAction.permissionRequest({ navigate: navigate }));
    dispatch(getProvinceAction.getProvinceRequest());
  }, []);

  const width = window.innerWidth;

  useEffect(() => {
    if (width > 490) {
      setHideSidebar(true);
    } else if (width <= 490) {
      setHideSidebar(false);
    }
  }, [width]);

  return (
    <Layout>
      {width > 490 ? (
        <>
          <Sider
            width={hideSidebar ? 220 : 90}
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
            <Sidebar hide={hideSidebar} />
          </Sider>
        </>
      ) : (
        <Drawer
          open={hideSidebar}
          width={300}
          onClose={() => setHideSidebar(false)}
          placement="left"
        >
          <Sidebar hide={true} />
        </Drawer>
      )}

      <Layout
        className="site-layout"
        style={
          width > 490
            ? { marginLeft: hideSidebar ? 230 : 100 }
            : { marginLeft: 0 }
        }
      >
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            // marginLeft: 20,
            // marginRight: 20,
            borderRadius: 4,
            backgroundColor: "#7dbcea",
          }}
        >
          <HeaderBar
            onClick={() => setHideSidebar(!hideSidebar)}
            hide={hideSidebar}
          />
        </Header>
        <Layout
          style={{
            // padding: "20px 20px",
            minHeight: "100%",
            width: "auto",
          }}
        >
          <Content
            style={{
              minHeight: 1000,
              background: "#F5F5F5",
              borderRadius: 4,
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
