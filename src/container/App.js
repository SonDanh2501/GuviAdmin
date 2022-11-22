import { useState } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Auth from "../layout/Auth.js";
import Dashboard from "../layout/Dashboard.js";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";

const App = () => {
  const isCheckLogin = useSelector(getIsCheckLogin);

  return <>{!isCheckLogin ? <Auth /> : <Dashboard />}</>;
};

export default App;
