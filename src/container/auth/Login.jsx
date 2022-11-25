import { Formik } from "formik";
import { useCallback, useRef } from "react";
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
  const initialValues = {
    email: "",
    password: "",
  };

  const onLogin = useCallback(() => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      loginAction.loginRequest({
        data: {
          email: formikRef?.current?.values?.email,
          password: formikRef?.current?.values?.password,
        },
        naviga: navigate,
      })
    );
  }, [dispatch, navigate]);

  return (
    <div className="container-login">
      <Card className="bg-white shadow border-0">
        <CardBody className="px-lg-5 py-lg-5">
          <div className="text-center text-muted mb-4">
            <img src={logo} className="img-logo" />
            <h3>Đăng nhập hệ thống Guvi</h3>
          </div>
          <Formik
            innerRef={formikRef}
            initialValues={initialValues}
            validationSchema={validateLoginSchema}
            validateOnChange={true}
            onSubmit={onLogin}
          >
            {({ values, setFieldValue, errors, handleSubmit }) => {
              return (
                <Form role="form">
                  <CustomTextInput
                    label="Email"
                    type="text"
                    id="className"
                    value={values?.email}
                    placeholder="Nhập email đăng nhập"
                    onChange={(text) =>
                      setFieldValue("email", text?.target?.value)
                    }
                    errors={errors?.email}
                  />
                  <CustomTextInput
                    label="Mật khẩu"
                    type="password"
                    name="password"
                    id="examplePassword"
                    value={values?.password}
                    placeholder="Nhập mật khẩu"
                    onChange={(text) =>
                      setFieldValue("password", text.target.value)
                    }
                    errors={errors?.password}
                  />
                  <div className="text-center">
                    <Button className="btn-login" onClick={handleSubmit}>
                      Đăng nhập
                    </Button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </CardBody>
      </Card>
    </div>
  );
};

export default Login;
