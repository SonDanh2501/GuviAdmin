import { Layout } from "antd";
import { useState } from "react";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderBar from "../container/Header/Header";

import { useSelector } from "react-redux";
import { getUser } from "../redux/selectors/auth";
import "./Dashboard.scss";
import Admin from "./admin";
import Marketing from "./marketing";
import SupportCustomer from "./supportCustomer";
import Support from "./support";
import Accountant from "./accountant";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(true);
  const user = useSelector(getUser);

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
            minHeight: "80%",
          }}
        >
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 750,
              background: "white",
              borderRadius: 4,
            }}
          >
            {user?.role === "admin" ? (
              <Admin />
            ) : user?.role === "marketing" ||
              user?.role === "marketing_manager" ? (
              <Marketing />
            ) : user?.role === "support_customer" ? (
              <SupportCustomer />
            ) : user?.role === "support" ? (
              <Support />
            ) : user?.role === "accountant" ? (
              <Accountant />
            ) : (
              ""
            )}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
