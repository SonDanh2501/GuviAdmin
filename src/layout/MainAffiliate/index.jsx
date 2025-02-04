import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import useWindowDimensions from "../../helper/useWindowDimensions";
import {
  Drawer,
  Layout,
  Menu,
  Button,
  theme,
  FloatButton,
  ConfigProvider,
} from "antd";
import Sidebar from "../Slidebar";
import SidebarAffiliate from "../SlidebarAffiliate/indes";
import Admin from "../admin";
import HeaderBar from "../../container/Header/Header";
import Affiliate from "../affiliate";

import icons from "../../utils/icons";
import { getUserAffiliateAction } from "../../redux/actions/auth";

const { IoLogoFacebook, IoLogoYoutube, IoLogoTiktok } = icons;
const { Header, Footer, Sider, Content } = Layout; // Set content có trong Layout, ở đây là gồm 3 phần Header, Thanh Sider, Content

const MainAffiliate = () => {
  const { width } = useWindowDimensions(); // Lấy độ rộng của màn hình hiển thị
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /* ~~~ Value ~~~ */
  const [collapsed, setCollapsed] = useState(false);
  const [isOpenDrawler, setIsOpenDrawler] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  /* ~~~ Handle function ~~~ */
  const handleClickSideBar = () => {
    if (width > 1280) {
      setCollapsed(!collapsed);
    } else {
      setIsOpenDrawler(true);
    }
  };
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    dispatch(getUserAffiliateAction.getUserAffiliateRequest());
  }, [dispatch])
  // 2
  useEffect(() => {
    // Auto close sidebar
    if (width > 1280) {
      setCollapsed(false);
    } else {
      setCollapsed(true);
    }
  }, [width]);
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            bodyBg: "#EEF0F8",
            headerHeight: 55,
          },
        },
      }}
    >
      <Layout hasSider style={{ overflowX: "hidden" }}>
        <Drawer
          open={isOpenDrawler}
          width={200}
          onClose={() => setIsOpenDrawler(false)}
          placement="left"
          headerStyle={{
            height: 30,
            paddingLeft: 0,
            display: "none",
            margin: 0,
          }}
        >
          <SidebarAffiliate hide={true} />
        </Drawer>
        <Layout
          style={{
            height: "100vh",
          }}
        >
          {/* <Header
            style={{
              height: `${width < 640 ? "40px" : "55px"}`,
              padding: "0px",
              background: "#FCFEFF",
              borderBottom: "2px solid #E2E9F1",
            }}
          >
            <HeaderBar onClick={() => handleClickSideBar()} hide={collapsed} />
          </Header> */}
          <Content
            style={{
              overflow: "auto",
            }}
          >
            <FloatButton.BackTop />
            <Affiliate />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainAffiliate;
