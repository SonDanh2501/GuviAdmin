import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import Auth from "../layout/Auth.js";
import Dashboard from "../layout/Dashboard.js";
import Main from "../layout/Main/index.jsx";
import { getServiceAction } from "../redux/actions/service.js";
import { getIsCheckLogin } from "../redux/selectors/auth";
import "./App.scss";

const App = () => {
  const isCheckLogin = useSelector(getIsCheckLogin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  {/*Check nếu chưa đăng nhập thì navigate tới trang login */}
  useEffect(() => {
    if (!isCheckLogin) {
      navigate("/auth/login");
    }
    dispatch(getServiceAction.getServiceRequest());
  }, []);


    {/*Nếu đăng nhập rồi thì navigation tới Main (chứa các layout) */}
  return <>{!isCheckLogin ? <Auth /> : <Main />}</>;
};

export default App;
