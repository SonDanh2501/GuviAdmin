import { Image, Input } from "antd";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import login from "../../assets/images/login.png";
import logo from "../../assets/images/Logo.svg";
import { loginAction } from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import "./index.scss";
import loginLandingImage from "../../assets/images/loginLanding.svg"
import logoLabelImage from "../../assets/images/LogoS.svg";
import InputTextCustom from "../../components/inputCustom";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(
    (e) => {
      dispatch(loadingAction.loadingRequest(true));
      e.preventDefault();
      dispatch(
        loginAction.loginRequest({
          data: {
            email: email,
            password: password,
          },
          naviga: navigate,
        })
      );
    },
    [dispatch, navigate, email, password]
  );

  return (
    <div className="login-admin">
      {/* <div className="login-admin__blank"></div> */}
      <div className="login-admin__wave"></div>
      <div className="login-admin__form">
        <div className="login-admin__form--left">
          <div className="login-admin__form--left-child">
            <img src={loginLandingImage} alt=""></img>
          </div>
        </div>
        <div className="login-admin__form--right">
          <div className="login-admin__form--right-logo">
            <img src={logoLabelImage} alt=""></img>
          </div>
          {/* Form Login */}
          <div className="login-admin__form--right-login">
            <div className="login-admin__form--right-login-header">
              <span>Đăng nhập hệ thống GUVI!</span>
            </div>
            <div className="login-admin__form--right-login-input">
              <InputTextCustom
                type="text"
                value={email}
                placeHolder="Email"
                onChange={(e) => setEmail(e.target.value)}
                required={true}
              />
              <InputTextCustom
                type="text"
                value={password}
                placeHolder="Mật khẩu"
                onChange={(e) => setPassword(e.target.value)}
                isPassword={true}
                required={true}
              />
              <button className="login-admin__button" onClick={onLogin}>
                <span>Đăng nhập</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
