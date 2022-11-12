import "./App.scss";
import Navigator from "../components/Navigator/Navigator.jsx";
import { useState, useEffect } from "react";
import UserManage from "./System/ManageUser/Customer/UserManage.jsx";
import CollaboratorManage from "./System/ManageUser/Collaborator/CollaboratorManage.jsx";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PromotionManage from "./System/ManagePromotion/Customer/promotionManage";

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
        </Switch>
      </div>
    </Router>
  );
};

export default App;
