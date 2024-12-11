import { Image, Input } from "antd";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import login from "../../assets/images/login.png";
import logo from "../../assets/images/logo.jpg";
import { loginAction } from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import "./Login.scss";

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
    <div className="container-login">
      {/*Login Card*/}
      <div className="div-card-login">
        {/*Login Card Left Side*/}
        <div className="div-card-left">
          {/*Header Text Left Side*/}
          <p className="text-wel-login">Chào mừng đến với GUVI</p>
          {/*Image Left Side*/}
          <Image src={login} className="image-login" preview={false} />
        </div>
        {/*Simple Line Between To Side*/}
        <div className="line" />
        {/*Login Card Right Side*/}
        <div className="div-card-right">
          {/*Container Right Side*/}
          <div className="div-head-card">
            {/*Image Right Side*/}
            <Image preview={false} src={logo} className="img-logo" />
            {/*Header Text Right Side*/}
            <p className="title-login">Đăng nhập hệ thống Guvi DEV</p>
          </div>
          {/*Submit Information*/}
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
