import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Auth from "../layout/Auth.js";
import Dashboard from "../layout/Dashboard.js";
import Main from "../layout/Main/index.jsx";
import { getServiceAction } from "../redux/actions/service.js";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";
import AuthAffiliate from "../layout/authAffiliate.js";
import MainAffiliate from "../layout/MainAffiliate/index.jsx";

const MainPort = Number(process.env.REACT_APP_PORT_MAIN);
const AffiliatePort = Number(process.env.REACT_APP_PORT_AFFILIATE);

const App = () => {
  const currentPort = Number(window.location.port);
  const isCheckLogin = useSelector(getIsCheckLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isCheckLogin && currentPort === AffiliatePort) {
      navigate("/auth/login-affiliate");
    }
    if (!isCheckLogin && currentPort === MainPort) {
      navigate("/auth/login");
    }
    dispatch(getServiceAction.getServiceRequest());
  }, []);

  return (
    <>
      {currentPort === AffiliatePort && isCheckLogin ? (
        <MainAffiliate />
      ) : (
        <AuthAffiliate />
      )}
      {currentPort === MainPort && isCheckLogin ? <Main /> : <Auth />}
    </>
  );
};

export default App;
