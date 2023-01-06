import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import Sidebar from "../components/Sidebar/Sidebar";
import Header from "../container/Header/Header";
import Home from "../container/System/Dashboard/DashBoard";
import DetailsOrder from "../container/System/DetailsOrder";
import ManageConfiguration from "../container/System/ManageConfiguration/ManageConfiguration";
import AppCustomer from "../container/System/ManageConfiguration/ScreenConfiguration/AppCustomer";
import GroupCustomerManage from "../container/System/ManageConfiguration/ScreenConfiguration/GroupCustomer";
import FeedbackManage from "../container/System/ManageFeedback/FeedbackManage";
import ManageOrder from "../container/System/ManageOrder";
import OrderDoingManage from "../container/System/ManageOrder/OrderDoing/OrderDoingManage";
import ManageReport from "../container/System/ManageReport";
import GroupServiceManage from "../container/System/ManageService/ManageGroupService/ManageGroupService/GroupServiceManage";
import ServiceManage from "../container/System/ManageService/ManageService/ServiceManage";
import ManageSetting from "../container/System/ManageSetting";
import ReasonManage from "../container/System/ManageSetting/ManageReason/ReasonManage";
import ManageTopup from "../container/System/ManageTopup";
import ManageCollaborator from "../container/System/ManageUser/Collaborator";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";
import ManageCustomer from "../container/System/ManageUser/Customer";
import Profile from "../container/System/ManageUser/Customer/Profiles/Profile";

import "./Dashboard.scss";

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(true);
  const [color, setColor] = useState("");

  const onColor = (e) => {
    setColor(e);
  };
  return (
    <div className="container-dashboard">
      <Header />

      <div className="row">
        {hideSidebar && (
          <div className="sidebar" style={{ backgroundColor: color }}>
            <Sidebar color={color} onChangeColor={(e) => onColor(e)} />
          </div>
        )}
        {/* <main className={hideSidebar ? "main p-0" : "main-full p-0"}> */}
        <main className="main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/details-order" element={<DetailsOrder />} />

            <Route
              path="/details-collaborator"
              element={<ProfileCollaborator />}
            />
            <Route path="/details-customer" element={<Profile />} />
            <Route path="/system/user-manage" element={<ManageCustomer />} />
            <Route
              path="/system/user-manage/details-customer"
              element={<Profile />}
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
            <Route path="/group-order/manage-order" element={<ManageOrder />} />
            <Route
              path="/group-order/manage-order/details-collaborator"
              element={<ProfileCollaborator />}
            />
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
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
