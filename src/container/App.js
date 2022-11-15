import "./App.scss";
import Navigator from "../components/Navigator/Navigator.jsx";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import UserManage from "./System/ManageUser/Customer/UserManage.jsx";
import CollaboratorManage from "./System/ManageUser/Collaborator/CollaboratorManage.jsx";
import PromotionManage from "./System/ManagePromotion/Customer/promotionManage";
import BannerManage from "./System/ManageSetting/ManageBanner/BannerManage";
import NewsManage from "./System/ManageSetting/ManageNews/NewsManage";
import ReasonManage from "./System/ManageSetting/ManageReason/ReasonManage";

const App = () => {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigator />
        </header>
        <Switch>
          <Route path="/system/user-manage">
            <UserManage />
          </Route>
          <Route path="/system/collaborator-manage">
            <CollaboratorManage />
          </Route>
          <Route path="/promotion/manage-promotion">
            <PromotionManage />
          </Route>
          <Route path="/settings/manage-banner">
            <BannerManage />
          </Route>
          <Route path="/settings/manage-news">
            <NewsManage />
          </Route>
          <Route path="/settings/manage-reason">
            <ReasonManage />
          </Route>
        </Switch>
      </div>
    </Router>
  );
};

export default App;
