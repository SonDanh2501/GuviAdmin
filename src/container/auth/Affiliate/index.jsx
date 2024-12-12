import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import InputTextCustom from "../../../components/inputCustom";
import ButtonCustom from "../../../components/button";
import {
  registerPhoneAffiliateApi,
  registerAffiliateApi,
  loginAffiliateApi,
  checkOTPAffiliateApi,
  forgotPasswordAffiliateApi,
  sendOtpAffiliateApi,
  updatePasswordAffiliateApi,
} from "../../../api/affeliate";
import { useDispatch } from "react-redux";
import logo from "../../../assets/images/Logo.svg";
import icons from "../../../utils/icons";
import { message, Modal } from "antd";
import { errorNotify } from "../../../helper/toast";
import { loadingAction } from "../../../redux/actions/loading";
import {
  loginAffiliateAction,
  loginAffiliateWithOTPAction,
  loginWithOnlyTokenAction,
} from "../../../redux/actions/auth";
import { useNavigate } from "react-router-dom";

const LoginAffiliate = () => {
  const { IoColorWandOutline, IoCashOutline } = icons;
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false); // Giá trị xác định hiện form đăng nhập hay form đăng ký
  const [valuePhone, setValuePhone] = useState(""); // Giá trị điện thoại đăng nhập/đăng ký
  const [valuePhoneForgot, setValuePhoneForgot] = useState(""); // Giá trị điện thoại để quên mật khẩu
  const [valuePassword, setValuePassword] = useState(""); // Giá trị mật khẩu đăng nhập/đăng ký
  const [valuePasswordRetype, setValuePasswordRetype] = useState(""); // Giá trị nhập lại mật khẩu đăng nhập/đăng ký
  const [valueName, setValueName] = useState(""); // Giá trị tên đăng ký
  const [valueFullName, setValueFullName] = useState(""); // Giá trị họ và tên đăng ký
  // const [valueInvitedCode, setValueInvitedCode] = useState(""); // Giá trị mã giới thiệu
  const [valueEmail, setValueEmail] = useState(""); // Giá trị email đăng ký
  const [secondsLeft, setSecondsLeft] = useState(60); // Giá trị giờ đếm để được gửi một OTP mới
  const [isRunning, setIsRunning] = useState(false); // Giá trị xác định bộ đếm có đang chạy hay không
  const [saveToken, setSaveToken] = useState(""); // Giá trị Token lưu lại thông tin số điện thoại, mã vùng số điện thoại và ngày tạo (không phải token đăng nhập)
  const [showModalSignUp, setShowModalSignUp] = useState(false); // Giá trị hiển thị modal đăng ký
  const [showModalRegisterInformation, setShowModalRegisterInformation] =
    useState(false); // Giá trị hiển thị modal nhập thông tin tài khoản mới
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false); // Giá trị hiển thị modal quên mật khẩu
  const [showModalUpdatePassword, setShowModalUpdatePassword] = useState(false); // Giá trị hiển thị modal nhập mật khẩu mới
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Giá trị kiểm trị là đang quên mật khẩu hay đăng nhập/đăng ký
  const [valuePhoneArea, setValuePhoneArea] = useState("+84"); // Giá trị phân vùng
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    if (isRunning && secondsLeft > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Xóa interval khi component unmount
    } else if (secondsLeft === 0) {
      setIsRunning(false); // Dừng bộ đếm khi hết giờ
    }
  }, [isRunning, secondsLeft]);

  /* ~~~ Handle function ~~~ */
  // 1. Hàm đăng nhập
  const handleLoginAffiliate = async (phone, password) => {
    dispatch(loadingAction.loadingRequest(true));
    dispatch(
      loginAffiliateAction.loginAffiliateRequest({
        data: {
          phone: phone,
          password: password,
          code_phone_area: valuePhoneArea,
        },
        naviga: navigate,
      })
    );
  };
  // 2. Hàm gửi mã OTP
  const handleSendOTP = async (payload) => {
    try {
      const res = await registerPhoneAffiliateApi(payload);
      setIsRunning(true);
      setShowModalSignUp(true);
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 3. Hàm check mã OTP, nếu pass thì lưu lại token vào cookie
  const handleCheckOTP = async (payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      const res = await checkOTPAffiliateApi(payload);
      setSaveToken(res.token);
      if (isForgotPassword) {
        setShowModalUpdatePassword(true);
      } else {
        setShowModalRegisterInformation(true);
      }
      setShowModalSignUp(false);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err.message,
      });
      dispatch(loadingAction.loadingRequest(false));
    }
  };
  // 4. Hàm tạo tài khoản mới với những thông tin đã nhập
  const handleRegisterAccount = async (payload) => {
    try {
      dispatch(loadingAction.loadingRequest(true));
      dispatch(
        loginAffiliateWithOTPAction.loginAffiliateWithOTPRequest({
          data: payload,
          user: payload,
          naviga: navigate,
        })
      );
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 5. Hàm gửi lại mã OTP
  const handleResendOTP = async (payload) => {
    try {
      const res = await sendOtpAffiliateApi(payload);
      setSecondsLeft(60);
      setIsRunning(true);
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 6. Hàm kiểm tra đăng nhập mỗi lần vào trang login
  const getIsCheckLogin = () => {
    const currentData = localStorage.getItem("authApp");
    const formatData = JSON.parse(currentData);
    if (formatData?.token.length > 0 && formatData?.isCheckLogin === "true") {
      dispatch(loadingAction.loadingRequest(true));
      dispatch(
        loginWithOnlyTokenAction.loginWithOnlyTokenRequest({
          token: formatData?.token,
          naviga: navigate,
        })
      );
    }
  };
  // 7. Hàm quên mật khẩu
  const handleForgotPassword = async (payload) => {
    try {
      const res = await forgotPasswordAffiliateApi(payload);
      setShowModalSignUp(true);
      setIsForgotPassword(true);
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 8. Hàm cập nhật mật khẩu
  const handleUpdatePassword = async (payload) => {
    try {
      const res = await updatePasswordAffiliateApi(payload);
      handleLoginAffiliate(valuePhoneForgot, valuePassword);
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };

  useEffect(() => {
    getIsCheckLogin();
  }, []);
  //
  /* ~~~ Other ~~~ */
  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(Array(6).fill("")); // Trạng thái lưu giá trị từng ô

  const handleChange = (e, index) => {
    const value = e.target.value;

    // Chỉ cho phép nhập số
    if (!/^\d*$/.test(value)) {
      return;
    }
    // Cập nhật giá trị vào state
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Chuyển focus sang ô tiếp theo
    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && index > 0 && !e.target.value) {
      // Quay lại ô trước nếu nhấn Backspace khi ô hiện tại đang trống
      inputRefs.current[index - 1].focus();
    }
  };

  const handleChangeToSignUp = () => {
    setIsSignUp(true);
    setValuePhone("");
    setValuePassword("");
  };

  const handleChangeToSignIn = () => {
    setIsSignUp(false);
    setValuePassword("");
  };

  return (
    <div className="login-affiliate">
      <div className="login-affiliate__card card-shadow">
        <div className="login-affiliate__card--information">
          {/* Label đăng nhập */}
          <span className="login-affiliate__card--information-label">
            {isSignUp ? "Đăng ký" : "Đăng nhập"}
          </span>
          <div className="login-affiliate__card--information-logo">
            <img
              className="login-affiliate__card--information-logo-image"
              src={logo}
            ></img>
          </div>
          {!isSignUp ? (
            <>
              <InputTextCustom
                type="textValue"
                valueUnit={valuePhoneArea}
                onChangeValueUnit={(e) => setValuePhoneArea(e.target.value)}
                value={valuePhone}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhone(e.target.value)}
                required={true}
              />
              <InputTextCustom
                type="text"
                value={valuePassword}
                placeHolder="Mật khẩu"
                onChange={(e) => setValuePassword(e.target.value)}
                required={true}
                isPassword={true}
              />
              <ButtonCustom
                fullScreen={true}
                label="Đăng nhập"
                onClick={() => handleLoginAffiliate(valuePhone, valuePassword)}
              />
              <div className="login-affiliate__card--information-line">
                <span className="login-affiliate__card--information-line-other">
                  Hoặc
                </span>
              </div>
              <ButtonCustom
                fullScreen={true}
                label="Đăng ký"
                style="normal"
                onClick={() => handleChangeToSignUp()}
              />
            </>
          ) : (
            <>
              <InputTextCustom
                type="text"
                value={valuePhone}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhone(e.target.value)}
                required={true}
              />
              <ButtonCustom
                fullScreen={true}
                label="Đăng ký"
                onClick={() =>
                  handleSendOTP({
                    phone: valuePhone,
                    code_phone_area: valuePhoneArea,
                  })
                }
              />
              <div className="login-affiliate__card--information-line">
                <span className="login-affiliate__card--information-line-other">
                  Hoặc
                </span>
              </div>
              <ButtonCustom
                fullScreen={true}
                label="Đăng nhập"
                style="normal"
                onClick={() => handleChangeToSignIn()}
              />
            </>
          )}
          <div className="login-affiliate__card--information-forgot-password">
            <span className="login-affiliate__card--information-forgot-password-label">
              Bạn quên mật khẩu hiện tại?
            </span>
            <span
              onClick={() => setShowModalForgotPassword(true)}
              className="login-affiliate__card--information-forgot-password-button"
            >
              Quên mật khẩu
            </span>
          </div>
          {/* Modal OTP */}
          <Modal
            title="Xác thực mã OTP"
            onCancel={() => setShowModalSignUp(false)}
            onOk={() =>
              handleCheckOTP({
                phone: valuePhone.length > 0 ? valuePhone : valuePhoneForgot,
                code_phone_area: valuePhoneArea,
                code: otp.join(""),
              })
            }
            open={showModalSignUp}
            okText={"Xác nhận"}
            cancelText={"Hủy"}
          >
            <div className="login-affiliate__card--information-otp">
              <span className="login-affiliate__card--information-otp-label">
                Nhập mã gồm 6 số đã gửi tới SMS thông qua số (+84) {valuePhone}
              </span>
              <div className="login-affiliate__card--information-otp-digit">
                {Array.from({ length: 6 }, (_, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength={1}
                    className="login-affiliate__card--information-otp-digit-number"
                    ref={(el) => (inputRefs.current[index] = el)}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                ))}
              </div>
              {secondsLeft !== 0 ? (
                <span className="login-affiliate__card--information-otp-label">
                  Bạn chưa nhận được mã OTP. Gửi lại mã sau{" "}
                  <span className="login-affiliate__card--information-otp-label high-light">
                    {secondsLeft}s
                  </span>
                </span>
              ) : (
                <span
                  className="login-affiliate__card--information-otp-label high-light clickable"
                  onClick={() =>
                    handleResendOTP({
                      phone: valuePhone,
                      code_phone_area: valuePhoneArea,
                    })
                  }
                >
                  Gửi lại mã
                </span>
              )}
            </div>
          </Modal>
          {/* Modal nhập thông tin cá nhân */}
          <Modal
            title="Nhập thông tin cá nhân"
            onCancel={() => {
              setShowModalRegisterInformation(false);
            }}
            onOk={() =>
              handleRegisterAccount({
                token: saveToken,
                name: "",
                full_name: valueFullName,
                email: valueEmail,
                phone: valuePhone,
                password: valuePassword,
                code_phone_area: valuePhoneArea,
                code: otp.join(""),
                // code_inviter: valueInvitedCode,
              })
            }
            okText={"Xác nhận"}
            cancelText={"Hủy"}
            open={showModalRegisterInformation}
          >
            <div className="login-affiliate__card--information-person">
              <InputTextCustom
                type="text"
                value={valueEmail}
                placeHolder="Email"
                onChange={(e) => setValueEmail(e.target.value)}
              />
              {/* <InputTextCustom
                type="text"
                value={valueName}
                placeHolder="Tên"
                onChange={(e) => setValueName(e.target.value)}
                required={true}
              /> */}
              <InputTextCustom
                type="text"
                value={valueFullName}
                placeHolder="Họ và tên"
                onChange={(e) => setValueFullName(e.target.value)}
              />
              <InputTextCustom
                type="text"
                value={valuePassword}
                placeHolder="Mật khẩu"
                onChange={(e) => setValuePassword(e.target.value)}
                required={true}
                isPassword={true}
              />
            </div>
          </Modal>
          {/* Modal quên mật khẩu */}
          <Modal
            title="Quên mật khẩu"
            onCancel={() => {
              setShowModalForgotPassword(false);
            }}
            onOk={() =>
              handleForgotPassword({
                phone: valuePhoneForgot,
                code_phone_area: valuePhoneArea,
              })
            }
            okText={"Xác nhận"}
            cancelText={"Hủy"}
            open={showModalForgotPassword}
          >
            <div className="login-affiliate__card--information-person">
              <InputTextCustom
                type="text"
                value={valuePhoneForgot}
                placeHolder="Số điện thoại hiện tại"
                onChange={(e) => setValuePhoneForgot(e.target.value)}
              />
            </div>
          </Modal>
          {/* Modal nhập mật khẩu mới */}
          <Modal
            title="Nhập mật khẩu mới"
            onCancel={() => {
              setShowModalUpdatePassword(false);
            }}
            onOk={() =>
              handleUpdatePassword({
                token: saveToken,
                password: valuePassword,
              })
            }
            okText={"Xác nhận"}
            cancelText={"Hủy"}
            open={showModalUpdatePassword}
          >
            <div className="login-affiliate__card--information-person">
              <InputTextCustom
                type="text"
                value={valuePassword}
                placeHolder="Nhập mật khẩu mới"
                onChange={(e) => setValuePassword(e.target.value)}
              />
              <InputTextCustom
                type="text"
                value={valuePasswordRetype}
                placeHolder="Nhập lại mật khẩu"
                onChange={(e) => setValuePasswordRetype(e.target.value)}
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LoginAffiliate;
