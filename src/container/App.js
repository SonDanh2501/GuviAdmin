import './App.scss';
import Navigator from "../components/Navigator/Navigator.jsx";
import { useState, useEffect } from 'react';
import UserManage from './System/ManageUser/Customer/UserManage.jsx';
import CollaboratorManage from './System/ManageUser/Collaborator/CollaboratorManage';

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";





const App = () => { 


  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigator />
        </header>

        <Switch> 
          <Route path="/system/user-manage">
            <UserManage/>
          </Route>
          <Route path="/system/collaborator-manage">
               <CollaboratorManage/>
          </Route>

         
        </Switch>
      </div>
    </Router>
  );
}

export default App;
