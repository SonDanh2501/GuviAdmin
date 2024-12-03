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
  // 1
  //   useEffect(() => {
  //     dispatch(permissionAction.permissionRequest({ navigate: navigate }));
  //     dispatch(getProvinceAction.getProvinceRequest());
  //     dispatch(getUserAction.getUserRequest());
  //   }, [dispatch, navigate]);
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
        <Layout
          style={{
            // marginLeft: width > 1280 ? (collapsed ? 80 : 200) : 0,
            // transitionDuration: "100ms",
            height: "100vh",
          }}
        >
          <Header
            style={{
              // padding: 0,
              // padding: 0,
              // padding: "0px 145px",
              background: "#FCFEFF",
              borderBottom: "2px solid #E2E9F1",
              // boxShadow: "rgba(0, 0, 0, 0.24) 0px 3px 8px",
            }}
          >
            {/*Component for header*/}
            <HeaderBar onClick={() => handleClickSideBar()} hide={collapsed} />
          </Header>
          <Content
            style={{
              // paddingTop: "20px",
              // margin: "20px",
              // padding: "20px",
              overflow: "auto",
            }}
          >
            {/*Button để scroll to top page*/}
            <FloatButton.BackTop />
            {/*Các navigate page trong admin */}
            <Affiliate />
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
};
export default MainAffiliate;
