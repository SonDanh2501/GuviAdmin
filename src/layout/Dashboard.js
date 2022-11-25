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

const Dashboard = () => {
  const [hideSidebar, setHideSidebar] = useState(true);
  return (
    <div className="container-fluid">
      <div className="row">
        {hideSidebar && (
          <div className="col-2 sidebar">
            <Sidebar />
          </div>
        )}
        <main className={hideSidebar ? "col-10" : "col-12"}>
          <div>
            <Header onClick={() => setHideSidebar(!hideSidebar)} />
          </div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/system/user-manage" element={<UserManage />} />
            <Route
              path="/system/collaborator-manage"
              element={<CollaboratorManage />}
            />
            <Route
              path="/promotion/manage-promotion"
              element={<PromotionManage />}
            />
            <Route path="/settings/manage-banner" element={<BannerManage />} />
            <Route path="/settings/manage-news" element={<NewsManage />} />
            <Route
              path="/services/manage-group-service"
              element={<GroupServiceManage />}
            />
            <Route
              path="/feedback/manage-feedback"
              element={<FeedbackManage />}
            />
            <Route path="/settings/manage-reason" element={<ReasonManage />} />
            <Route
              path="/services/manage-group-service/manage-service"
              element={<ServiceManage />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
