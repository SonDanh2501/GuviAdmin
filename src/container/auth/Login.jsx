import { Button, Input } from "antd";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/images/logo.jpg";
import { loginAction } from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import "./Login.scss";

const Login = () => {
  const formikRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      loginAction.loginRequest({
        data: {
          email: email,
          password: password,
        },
        naviga: navigate,
      })
    );
  }, [dispatch, navigate, email, password]);

  const handlePress = (e) => {
    if (e.key === 13) {
      onLogin();
    }
  };

  return (
    <div className="container-login">
      <div className="div-card-login">
        <div className="div-head">
          <img src={logo} className="img-logo" />
          <a className="title-login">Đăng nhập hệ thống Guvi</a>
        </div>
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
            <Button className="btn-login" onClick={onLogin}>
              Đăng nhập
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
