import { Layout } from "antd";
import { Footer } from "antd/es/layout/layout";
import moment from "moment";
import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import HeaderBar from "../container/Header/Header";
import Home from "../container/System/Dashboard/DashBoard";
import DetailsOrder from "../container/System/DetailsOrder";
import ManageConfiguration from "../container/System/ManageConfiguration/ManageConfiguration";
import AppCollaborator from "../container/System/ManageConfiguration/ScreenConfiguration/AppCollaborator";
import AppCustomer from "../container/System/ManageConfiguration/ScreenConfiguration/AppCustomer";
import GroupCustomerManage from "../container/System/ManageConfiguration/ScreenConfiguration/GroupCustomer";
import SettingQrCode from "../container/System/ManageConfiguration/ScreenConfiguration/SettingQrcode";
import FeedbackManage from "../container/System/ManageFeedback/FeedbackManage";
import ManageOrder from "../container/System/ManageOrder";
import AddOrder from "../container/System/ManageOrder/DrawerAddOrder";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";
import OrderUsePromotion from "../container/System/ManagePromotion/OrderUsePromotion";
import ManagePushNotification from "../container/System/ManagePushNotification";
import ManageReport from "../container/System/ManageReport";
import DetailReportManager from "../container/System/ManageReport/DetailsReportCollaborator";
import DetailRegisterCustomer from "../container/System/ManageReport/ReportCustomer/DetailRegisterCustomer";
import ReportInviteDetails from "../container/System/ManageReport/ReportInvite/ReportInviteDetails";
import GroupServiceManage from "../container/System/ManageService/ManageGroupService/ManageGroupService/GroupServiceManage";
import ServiceManage from "../container/System/ManageService/ManageService/ServiceManage";
import ManageSetting from "../container/System/ManageSetting";
import ReasonManage from "../container/System/ManageSetting/ManageReason/ReasonManage";
import ManageTopup from "../container/System/ManageTopup";
import ManageCollaborator from "../container/System/ManageUser/Collaborator";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profiles from "../container/System/ManageUser/Customer/Profiles";

import "./Dashboard.scss";
const { Header, Content, Sider } = Layout;

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(true);

  return (
    <Layout>
      <Header
        style={{
          background: "#0f157f",
        }}
      >
        <HeaderBar />
      </Header>
      <Layout>
        {!hideSidebar && (
          <Sider
            width={1}
            style={{
              background: "transparent",
            }}
          >
            <div
              className="div-menu-das"
              onClick={() => setHideSidebar(!hideSidebar)}
            >
              <i class="uil uil-bars"></i>
            </div>
          </Sider>
        )}

        {hideSidebar && (
          <Sider
            width={230}
            style={{
              background: "white",
            }}
          >
            <Sidebar onClick={() => setHideSidebar(!hideSidebar)} />
          </Sider>
        )}
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
              minHeight: 280,
              background: "white",
              borderRadius: 4,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/details-order" element={<DetailsOrder />} />

              <Route
                path="/details-collaborator"
                element={<ProfileCollaborator />}
              />
              <Route path="/details-customer" element={<Profiles />} />
              <Route path="/system/user-manage" element={<ManageCustomer />} />
              <Route
                path="/system/user-manage/details-customer"
                element={<Profiles />}
              />
              <Route
                path="/system/collaborator-manage"
                element={<ManageCollaborator />}
              />
              <Route
                path="/system/collaborator-manage/details-collaborator"
                element={<ProfileCollaborator />}
              />
              <Route
                path="/promotion/manage-setting"
                element={<ManageSetting />}
              />

              <Route
                path="/promotion/manage-setting/order-promotion"
                element={<OrderUsePromotion />}
              />

              <Route
                path="/services/manage-group-service"
                element={<GroupServiceManage />}
              />
              <Route
                path="/services/manage-group-service/manage-service"
                element={<ServiceManage />}
              />
              <Route
                path="/feedback/manage-feedback"
                element={<FeedbackManage />}
              />
              <Route
                path="/group-order/manage-order"
                element={<ManageOrder />}
              />

              <Route
                path="/group-order/manage-order/create-order"
                element={<AddOrder />}
              />
              <Route
                path="/group-order/manage-order/details-collaborator"
                element={<ProfileCollaborator />}
              />
              <Route
                path="/group-order/manage-order/details-customer"
                element={<Profiles />}
              />
              <Route path="/profile-customer" element={<Profiles />} />
              <Route
                path="/group-order/manage-order/all"
                element={<ManageOrder />}
              />
              <Route
                path="/group-order/manage-order/doing"
                element={<OrderDoingManage />}
              />

              <Route path="/topup/manage-topup" element={<ManageTopup />} />

              <Route
                path="/adminManage/manage-configuration/manage-group-customer"
                element={<GroupCustomerManage />}
              />
              <Route path="/report/manage-report" element={<ManageReport />} />
              <Route
                path="/report/manage-report/all"
                element={<ManageReport />}
              />
              <Route
                path="/report/manage-report/report-details"
                element={<DetailReportManager />}
              />
              <Route
                path="/report/manage-report/details-register-customer"
                element={<DetailRegisterCustomer />}
              />

              <Route
                path="/report/manage-report/details-customer-invite"
                element={<ReportInviteDetails />}
              />

              <Route
                path="/notification/manage-push-notification"
                element={<ManagePushNotification />}
              />

              <Route
                path="/adminManage/manage-configuration"
                element={<ManageConfiguration />}
              />
              <Route
                path="/adminManage/manage-configuration/manage-reason"
                element={<ReasonManage />}
              />
              <Route
                path="/adminManage/manage-configuration/manage-app-customer"
                element={<AppCustomer />}
              />
              <Route
                path="/adminManage/manage-configuration/manage-app-collaborator"
                element={<AppCollaborator />}
              />
              <Route
                path="/adminManage/manage-configuration/setting-qrcode"
                element={<SettingQrCode />}
              />
            </Routes>
          </Content>
          {/* <Footer>Guvi Admin ©{moment().year()} Created by Le Minh Dang</Footer> */}
        </Layout>
      </Layout>
    </Layout>
  );
};

export default Dashboard;
