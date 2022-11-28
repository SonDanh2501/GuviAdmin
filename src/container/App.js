import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Auth from "../layout/Auth.js";
import Dashboard from "../layout/Dashboard.js";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";

const App = () => {
  const isCheckLogin = useSelector(getIsCheckLogin);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isCheckLogin) {
      navigate("/auth/login");
    }
  }, []);

  return <>{!isCheckLogin ? <Auth /> : <Dashboard />}</>;
};

export default App;
