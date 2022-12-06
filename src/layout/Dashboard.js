import { useState } from "react";
import { useSelector } from "react-redux";
import { Route, Router, Routes, Switch } from "react-router-dom";
import Header from "../container/Header/Header";
import FeedbackManage from "../container/System/ManageFeedback/FeedbackManage";
import PromotionManage from "../container/System/ManagePromotion/Customer/promotionManage";
import NewsManage from "../container/System/ManageSetting/ManageNews/NewsManage";
import ReasonManage from "../container/System/ManageSetting/ManageReason/ReasonManage";
import CollaboratorManage from "../container/System/ManageUser/Collaborator/CollaboratorManage";
import BannerManage from "../container/System/ManageSetting/ManageBanner/BannerManage";
import UserManage from "../container/System/ManageUser/Customer/UserManage";
import ServiceManage from "../container/System/ManageService/ManageService/ServiceManage";
import GroupServiceManage from "../container/System/ManageService/ManageGroupService/ManageGroupService/GroupServiceManage";
import Home from "../container/System/Dashboard/DashBoard";
import "./Dashboard.scss";
import Sidebar from "../components/Sidebar/Sidebar";
import OrderManage from "../container/System/ManageOrder/OrderManage";
import TopupManage from "../container/System/ManageTopup/ManageTopupCollaborator/TopupManage";
import TopupCustomerManage from "../container/System/ManageTopup/ManageTopupCustomer/TopupCustomerManage";
import ManageConfiguration from "../container/System/ManageConfiguration/ManageConfiguration";
import Profile from "../container/System/ManageUser/Customer/Profiles/Profile";
import ProfileCollaborator from "../container/System/ManageUser/Collaborator/ProfilesCollaborator/ProfileCollaborator";
import ManageSetting from "../container/System/ManageSetting";
import ManageTopup from "../container/System/ManageTopup";

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(true);
  const [color, setColor] = useState("");

  const onColor = (e) => {
    setColor(e);
  };
  return (
    <div className="container-dashboard container-fluid">
      <div className="row">
        {hideSidebar && (
          <div className="sidebar" style={{ backgroundColor: color }}>
            <Sidebar color={color} onChangeColor={(e) => onColor(e)} />
          </div>
        )}
        <main className={hideSidebar ? "main p-0" : "main-full p-0"}>
          <div>
            <Header
              onClick={() => setHideSidebar(!hideSidebar)}
              hideSidebar={hideSidebar}
              color={color}
            />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/system/user-manage" element={<UserManage />} />
            <Route
              path="/system/user-manage/details-customer"
              element={<Profile />}
            />
            <Route
              path="/system/collaborator-manage"
              element={<CollaboratorManage />}
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
            <Route path="/group-order/manage-order" element={<OrderManage />} />
            <Route path="/topup/manage-topup" element={<ManageTopup />} />

            <Route
              path="/adminManage/manage-configuration"
              element={<ManageConfiguration />}
            />
            <Route
              path="/adminManage/manage-configuration/manage-reason"
              element={<ReasonManage />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
