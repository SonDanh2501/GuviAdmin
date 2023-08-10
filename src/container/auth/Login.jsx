import { Button, Image, Input } from "antd";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo.jpg";
import login from "../../assets/images/login.png";
import { loginAction } from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import "./Login.scss";

const Login = () => {
  const formikRef = useRef();
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
    <div className="container-login">
      <div className="div-card-login">
        <div className="div-card-left">
          <a className="text-wel-login">Chào mừng đến với GUVI</a>
          <Image src={login} className="image-login" />
        </div>
        <div className="line" />
        <div className="div-card-right">
          <div className="div-head">
            <img src={logo} className="img-logo" />
            <a className="title-login">Đăng nhập hệ thống Guvi</a>
          </div>
          <form onSubmit={onLogin}>
            <div className="div-body-login">
              <div>
                <label>Email</label>
                <Input
                  placeholder="Nhập email"
                  className="input-pass"
                  value={email}
                  type="email"
                  onChange={(text) => setEmail(text.target.value)}
                />
              </div>

              <div>
                <label>Password</label>
                <Input.Password
                  placeholder="Nhập mật khẩu"
                  className="input-pass"
                  value={password}
                  onChange={(text) => setPassword(text.target.value)}
                />
              </div>

              <div className="text-center">
                <button type="submit" className="btn-login">
                  Đăng nhập
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
