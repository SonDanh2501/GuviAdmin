// import { NavLink } from "react-router-dom";
// import React, { useEffect, useState } from "react";
// import { Drawer, Layout, Menu, Button, theme, FloatButton } from "antd";
// import {
//   MenuFoldOutlined,
//   MenuUnfoldOutlined,
//   UploadOutlined,
//   UserOutlined,
//   VideoCameraOutlined,
// } from "@ant-design/icons";
// // import Sidebar from "../../components/Sidebar/Sidebar";
// import Sidebar from "../Slidebar";
// import { getUserAction, permissionAction } from "../../redux/actions/auth";
// import { getProvinceAction } from "../../redux/actions/service";
// import { useNavigate } from "react-router-dom";
// import HeaderBar from "../../container/Header/Header";
// import Admin from "../admin";
// import useWindowDimensions from "../../helper/useWindowDimensions";
// import "./index.scss";

// import { useDispatch } from "react-redux";

// const { Header, Sider, Content } = Layout; // Set content có trong Layout, ở đây là gồm 3 phần Header, Thanh Sider, Content

// const Main = ({ hide }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const {
//     token: { colorBgContainer },
//   } = theme.useToken();
//   const { width } = useWindowDimensions(); // Lấy độ rộng của màn hình hiển thị

//   const dispatch = useDispatch();
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     dispatch(permissionAction.permissionRequest({ navigate: navigate }));
//     dispatch(getProvinceAction.getProvinceRequest());
//     dispatch(getUserAction.getUserRequest());
//   }, [dispatch, navigate]);

//   useEffect(() => {
//     // Responsive cho thanh side bar
//     if (width > 900) {
//       setCollapsed(true);
//     } else {
//       setCollapsed(false);
//     }
//   }, [width]);

//   return (
//     <Layout style={{ overflowX: "hidden" }}>
//       {/*Header Container*/}
//       <Header
//         style={{
//           padding: 0,
//           background: "#38BDF8",
//           borderBottomLeftRadius: 8,
//           borderBottomRightRadius: 8,
//           top: 0,
//           zIndex: 1,
//         }}
//       >
//         {/*Component for header*/}
//         <HeaderBar onClick={() => setCollapsed(!collapsed)} hide={collapsed} />
//       </Header>
//       <Layout>
//         {width > 900 ? (
//           // Width lớn hơn 900 thì hiển thị sider
//           <Sider
//             trigger={null}
//             collapsible
//             collapsed={!collapsed}
//             style={{
//               overflow: "auto",
//               height: "100%",
//               left: 0,
//               top: 0,
//               bottom: 0,
//               backgroundColor: "white",
//               borderRadius: 8,
//               marginTop: 10,
//               borderWidth: 1,
//               borderColor: "yellow",
//             }}
//           >
//             {/*Sider content*/}
//             <Sidebar hide={collapsed} />
//           </Sider>
//         ) : (
//           // Width <= 900 thì hiển thị Drawler
//           <Drawer
//             open={collapsed}
//             width={250}
//             onClose={() => setCollapsed(false)}
//             placement="left"
//             headerStyle={{
//               height: 30,
//               paddingLeft: 0,
//               display: "none",
//               margin: 0,
//             }}
//           >
//             {/*Drawler content*/}
//             <Sidebar hide={true} />
//           </Drawer>
//         )}
//         {/*Layout for Content*/}
//         <Layout>
//           <Content
//             style={{
//               margin: 10,
//               padding: 10,
//               minHeight: 900,
//               background: "white",
//               borderRadius: 8,
//               overflow: "initial",
//             }}
//           >
//             {/*Button để scroll to top page*/}
//             <FloatButton.BackTop />
//             {/*Các navigate page trong admin */}
//             <Admin />
//           </Content>
//         </Layout>
//       </Layout>
//     </Layout>
//   );
// };

// export default Main;






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

const { Header, Sider, Content } = Layout; // Set content có trong Layout, ở đây là gồm 3 phần Header, Thanh Sider, Content

const Main = ({ hide }) => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer },
  } = theme.useToken();
  const { width } = useWindowDimensions(); // Lấy độ rộng của màn hình hiển thị

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(permissionAction.permissionRequest({ navigate: navigate }));
    dispatch(getProvinceAction.getProvinceRequest());
    dispatch(getUserAction.getUserRequest());
  }, [dispatch, navigate]);

  return (
    <Layout hasSider style={{ overflowX: "hidden" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        width={200}
        collapsedWidth={70}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          boxShadow: "0 3px 12px rgba(57, 63, 72, 0.3)",
        }}
      >
        {/*Sider content*/}
        <Sidebar hide={collapsed} />
      </Sider>
      <Layout
        style={{
          marginLeft: collapsed ? 70 : 200,
          transitionDuration: "100ms",
        }}
      >
        <Header
          style={{
            padding: 0,
            background: "#FFFFFF",
            // borderBottom: "2px solid silver",
            boxShadow: "0 3px 5px rgba(57, 63, 72, 0.3)",
          }}
        >
          {/*Component for header*/}
          <HeaderBar
            onClick={() => setCollapsed(!collapsed)}
            hide={collapsed}
          />
        </Header>
        <Content
          style={{
            margin: "10px 16px 0",
            overflow: "initial",
          }}
        >
          {/*Button để scroll to top page*/}
          <FloatButton.BackTop />
          {/*Các navigate page trong admin */}
          <Admin />
        </Content>
      </Layout>
    </Layout>
  );
};

export default Main;
