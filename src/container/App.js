import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Auth from "../layout/Auth.js";
import Dashboard from "../layout/Dashboard.js";
import { getServiceAction } from "../redux/actions/service.js";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";

const App = () => {
  const isCheckLogin = useSelector(getIsCheckLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isCheckLogin) {
      navigate("/auth/login");
    }
    dispatch(getServiceAction.getServiceRequest());
  }, []);

  return <>{!isCheckLogin ? <Auth /> : <Dashboard />}</>;
};

export default App;
