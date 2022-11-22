import { useState } from "react";
import { useSelector } from "react-redux";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import Navigator from "../components/Navigator/Navigator.jsx";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";
import Login from "./auth/Login";
import Header from "./Header/Header.jsx";
import FeedbackManage from "./System/ManageFeedback/FeedbackManage.jsx";
import PromotionManage from "./System/ManagePromotion/Customer/promotionManage";
import GroupServiceManage from "./System/ManageService/ManageGroupService/GroupServiceManage";
import BannerManage from "./System/ManageSetting/ManageBanner/BannerManage";
import NewsManage from "./System/ManageSetting/ManageNews/NewsManage";
import ReasonManage from "./System/ManageSetting/ManageReason/ReasonManage";
import CollaboratorManage from "./System/ManageUser/Collaborator/CollaboratorManage.jsx";
import UserManage from "./System/ManageUser/Customer/UserManage.jsx";

const App = () => {
  const [hideSidebar, setHideSidebar] = useState(true);
  const isCheckLogin = useSelector(getIsCheckLogin);

  return (
    <>
      {!isCheckLogin ? (
        <Router>
          <div className="App">
            <Switch>
              <Route path="/auth/login">
                <Login />
              </Route>
              <Redirect from="/" to="/auth/login" />
            </Switch>
          </div>
        </Router>
      ) : (
        <Router>
          <div className="row">
            {hideSidebar && (
              <div className="col-2 sidebar">
                <Navigator />
              </div>
            )}
            <main className={hideSidebar ? "col-10" : "col-12"}>
              <div>
                <Header onClick={() => setHideSidebar(!hideSidebar)} />
              </div>
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
                <Route path="/services/manage-group-service">
                  <GroupServiceManage />
                </Route>
                <Route path="/feedback/manage-feedback">
                  <FeedbackManage />
                </Route>
                <Route path="/settings/manage-reason">
                  <ReasonManage />
                </Route>
              </Switch>
            </main>
          </div>
        </Router>
      )}
    </>
  );
};

export default App;
