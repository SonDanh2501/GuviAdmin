import { Input } from "antd";
import { Formik } from "formik";
import { useCallback, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button, Card, CardBody, Form } from "reactstrap";
import logo from "../../assets/images/logo.png";
import CustomTextInput from "../../components/CustomTextInput/customTextInput";
import { loginAction } from "../../redux/actions/auth";
import { loadingAction } from "../../redux/actions/loading";
import { validateLoginSchema } from "../../utils/schema";
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
      <Card className="bg-white shadow border-0 card">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-muted mb-4 div-head">
            <img src={logo} className="img-logo" />
            <a className="title-login">Đăng nhập hệ thống Guvi</a>
          </div>
          <Form role="form" onSubmit={onLogin}>
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
          </Form>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
