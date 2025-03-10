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
} from "../../../api/affiliate";
import { useDispatch } from "react-redux";
import logo from "../../../assets/images/Logo.svg";
import logoLabelImage from "../../../assets/images/LogoS.svg";

import icons from "../../../utils/icons";
import { message, Modal } from "antd";
import { errorNotify, successNotify } from "../../../helper/toast";
import { loadingAction } from "../../../redux/actions/loading";
import {
  loginAffiliateAction,
  loginAffiliateWithOTPAction,
  loginWithOnlyTokenAction,
} from "../../../redux/actions/auth";
import { useNavigate } from "react-router-dom";
import loginLandingImage from "../../../assets/images/loginLanding.svg";
import {
  checkIsEmailFormat,
  checkPasswordRequired,
} from "../../../utils/contant";

const LoginAffiliate = () => {
  const { IoColorWandOutline, IoCashOutline, IoCheckmarkCircleOutline } = icons;
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const navigate = useNavigate();
  const [valuePhone, setValuePhone] = useState(""); // Giá trị điện thoại đăng nhập/đăng ký
  const [valuePhoneForgot, setValuePhoneForgot] = useState(""); // Giá trị điện thoại để quên mật khẩu
  const [valuePassword, setValuePassword] = useState(""); // Giá trị mật khẩu đăng nhập/đăng ký
  const [valueConfirmPassword, setValueConfirmPassword] = useState(""); // Giá trị nhập lại để xác nhận mật khẩu
  const [valueFullName, setValueFullName] = useState(""); // Giá trị họ và tên đăng ký
  const [valueEmail, setValueEmail] = useState(""); // Giá trị email đăng ký
  const [secondsLeft, setSecondsLeft] = useState(60); // Giá trị giờ đếm để được gửi một OTP mới
  const [isRunning, setIsRunning] = useState(false); // Giá trị xác định bộ đếm có đang chạy hay không
  const [saveToken, setSaveToken] = useState(""); // Giá trị Token lưu lại thông tin số điện thoại, mã vùng số điện thoại và ngày tạo (không phải token đăng nhập)
  const [showModalSignUp, setShowModalSignUp] = useState(false); // Giá trị hiển thị modal đăng ký
  const [showModalForgotPassword, setShowModalForgotPassword] = useState(false); // Giá trị hiển thị modal quên mật khẩu
  const [showModalUpdatePassword, setShowModalUpdatePassword] = useState(false); // Giá trị hiển thị modal nhập mật khẩu mới
  const [valuePhoneArea, setValuePhoneArea] = useState("+84"); // Giá trị phân vùng
  const [valueStepSignUp, setValueStepSignUp] = useState(1); // Giá trị xác định bước tạo tài khoản hiện tại

  /* ~~~ Flag ~~~ */
  const [isSignUp, setIsSignUp] = useState(false); // Giá trị cờ form đăng ký
  const [isForgotPassword, setIsForgotPassword] = useState(false); // Giá trị cờ form quên mật khẩu
  const [isModalPasswordType, setIsModalPasswordType] = useState(false); // Giá trị cờ hiển thị modal nhập mật khẩu

  /* ~~~ Handle function ~~~ */
  // 1. Hàm đăng nhập
  const handleLoginAffiliate = (phone, password) => {
    if (phone.trim() === "" || phone === undefined || phone === null) {
      errorNotify({
        message: "Vui lòng nhập số điện thoại",
      });
    } else if (
      password.trim() === "" ||
      password === undefined ||
      password === null
    ) {
      errorNotify({
        message: "Vui lòng nhập mật khẩu",
      });
    } else {
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
    }
  };
  // 2. Hàm gửi mã OTP
  const handleSendOTP = async (payload) => {
    try {
      // if (!valuePhone.trim() || !valueFullName.trim() || !valueEmail.trim())
      //   return errorNotify({ message: "Vui lòng điền đầy đủ thông tin" });

      // if (!checkIsEmailFormat(valueEmail))
      //   return errorNotify({ message: "Vui lòng nhập đúng định dạng email" });

      dispatch(loadingAction.loadingRequest(true));
      await registerPhoneAffiliateApi(payload);
      setIsRunning(true);
      setShowModalSignUp(true);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({ message: err.message });
      dispatch(loadingAction.loadingRequest(false));
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
        setIsModalPasswordType(true);
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
      if (checkPasswordRequired(valuePassword).level < 3) {
        errorNotify({
          message: "Vui lòng chọn mật khẩu thỏa điều kiện",
        });
      } else if (valuePassword !== valueConfirmPassword) {
        errorNotify({
          message: "Vui lòng xác thực đúng mật khẩu",
        });
      } else {
        dispatch(loadingAction.loadingRequest(true));
        dispatch(
          loginAffiliateWithOTPAction.loginAffiliateWithOTPRequest({
            data: payload,
            user: payload,
            naviga: navigate,
          })
        );
        dispatch(loadingAction.loadingRequest(false));
      }
    } catch (err) {
      errorNotify({
        message: err.message,
      });
      dispatch(loadingAction.loadingRequest(false));
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
  const getIsCheckLogin = async () => {
    const currentData = localStorage.getItem("authApp");
    const formatData = JSON.parse(currentData);
    if (formatData?.token && formatData?.isCheckLogin === "true") {
      dispatch(loadingAction.loadingRequest(true));
      dispatch(
        loginWithOnlyTokenAction.loginWithOnlyTokenRequest({
          token: formatData?.token,
          naviga: navigate,
          isApp: JSON.parse(localStorage.getItem("authApp"))?.isApp,
        })
      );
    }
  };
  // 7. Hàm quên mật khẩu
  const handleForgotPassword = async (payload) => {
    try {
      if (payload?.phone.trim() === "") {
        errorNotify({
          message: "Chưa điền số điện thoại",
        });
      } else {
        const res = await forgotPasswordAffiliateApi(payload);
        setIsRunning(true);
        setShowModalSignUp(true);
        setIsForgotPassword(true);
      }
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 8. Hàm cập nhật mật khẩu
  const handleUpdatePassword = async (payload) => {
    try {
      console.log("check");
      const res = await updatePasswordAffiliateApi(payload);
      handleLoginAffiliate(valuePhoneForgot, valuePassword);
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  const handleShowFormSignUp = () => {
    setIsSignUp(true);
    setIsForgotPassword(false);
  };
  const handleShowFormForgetPass = () => {
    setIsSignUp(false);
    setIsForgotPassword(true);
  };
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
  // Hàm kiểm tra đã đăng nhập hay chưa (dành cho khách hàng bấm từ bên app qua)
  useEffect(() => {
    getIsCheckLogin();
  }, []);
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
      {/* <div className="login-affiliate__blank"></div> */}
      <div className="login-affiliate__wave"></div>
      <div className="login-affiliate__form">
        <div className="login-affiliate__form--left">
          <div className="login-affiliate__form--left-child">
            <img src={loginLandingImage} alt=""></img>
          </div>
        </div>
        <div className="login-affiliate__form--right">
          <div className="login-affiliate__form--right-logo">
            <img src={logoLabelImage} alt=""></img>
          </div>
          {/* Form Login */}
          <div
            className={`login-affiliate__form--right-login ${
              (isSignUp || isForgotPassword) && "hide"
            }`}
          >
            <div className="login-affiliate__form--right-login-header">
              <span>Mừng bạn trở lại !</span>
            </div>
            <div className="login-affiliate__form--right-login-input">
              <InputTextCustom
                type="textValue"
                valueUnit={valuePhoneArea}
                onChangeValueUnit={(e) => setValuePhoneArea(e.target.value)}
                value={valuePhone}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhone(e.target.value)}
                // required={true}
              />
              <InputTextCustom
                type="text"
                value={valuePassword}
                placeHolder="Mật khẩu"
                onChange={(e) => setValuePassword(e.target.value)}
                // required={true}
                isPassword={true}
              />
              <button
                className="login-affiliate__button"
                onClick={() => handleLoginAffiliate(valuePhone, valuePassword)}
              >
                <span>Đăng nhập</span>
              </button>
            </div>
            <div className="login-affiliate__form--right-login-line">
              <span className="login-affiliate__form--right-login-line-other">
                Hoặc
              </span>
            </div>
            <div className="login-affiliate__form--right-login-sign-up">
              <div className="login-affiliate__form--right-login-sign-up-container">
                <span className="login-affiliate__form--right-login-sign-up-container-label">
                  Bạn là khách hàng mới?
                </span>
                <span
                  onClick={() => setIsSignUp(true)}
                  className="login-affiliate__form--right-login-sign-up-container-label high-light"
                >
                  Đăng ký ngay
                </span>
              </div>
              <div className="login-affiliate__form--right-login-forgot-password-container">
                <span
                  onClick={() => {
                    setIsSignUp(false);
                    setIsForgotPassword(true);
                  }}
                  className="login-affiliate__form--right-login-sign-up-label high-light"
                >
                  Quên mật khẩu
                </span>
              </div>
            </div>
          </div>
          {/* Form sign up */}
          <div
            className={`login-affiliate__form--right-sign-up ${
              isSignUp === false && "hide"
            }`}
          >
            <div className="login-affiliate__form--right-sign-up-header">
              <span>Trở thành thành viên của chúng tôi !</span>
            </div>
            <div className="login-affiliate__form--right-sign-up-input">
              {/* <InputTextCustom
                type="text"
                value={valueFullName}
                placeHolder="Họ và tên"
                onChange={(e) => setValueFullName(e.target.value)}
                required={true}
              /> */}
              <InputTextCustom
                type="textValue"
                valueUnit={valuePhoneArea}
                onChangeValueUnit={(e) => setValuePhoneArea(e.target.value)}
                value={valuePhone}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhone(e.target.value)}
                required={true}
              />
              {/* <InputTextCustom
                type="text"
                value={valueEmail}
                placeHolder="Email"
                onChange={(e) => setValueEmail(e.target.value)}
                required={true}
              /> */}
              <button
                className="login-affiliate__button"
                onClick={() =>
                  handleSendOTP({
                    phone: valuePhone,
                    code_phone_area: valuePhoneArea,
                  })
                }
              >
                <span>Tham gia ngay</span>
              </button>
            </div>
            <div className="login-affiliate__form--right-sign-up-line">
              <span className="login-affiliate__form--right-sign-up-line-other">
                Hoặc
              </span>
            </div>
            <div className="login-affiliate__form--right-sign-up-sign-up">
              <span className="login-affiliate__form--right-sign-up-sign-up-label">
                Bạn quên mật khẩu?
              </span>
              <span
                onClick={() => {
                  setIsSignUp(false);
                  setIsForgotPassword(true);
                }}
                className="login-affiliate__form--right-sign-up-sign-up-label high-light"
              >
                Bấm vào đây
              </span>
            </div>
          </div>
          {/* Form forgot password */}
          <div
            className={`login-affiliate__form--right-sign-up ${
              isForgotPassword === false && "hide"
            }`}
          >
            <div className="login-affiliate__form--right-sign-up-header">
              <span>Cùng kiểm tra thông tin của bạn nào !</span>
            </div>
            <div className="login-affiliate__form--right-sign-up-input">
              <InputTextCustom
                type="textValue"
                valueUnit={valuePhoneArea}
                onChangeValueUnit={(e) => setValuePhoneArea(e.target.value)}
                value={valuePhoneForgot}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhoneForgot(e.target.value)}
              />
              <button
                className="login-affiliate__button"
                onClick={() =>
                  handleForgotPassword({
                    phone: valuePhoneForgot,
                    code_phone_area: valuePhoneArea,
                  })
                }
              >
                <span>Nhận mã xác nhận</span>
              </button>
            </div>
            <div className="login-affiliate__form--right-sign-up-line">
              <span className="login-affiliate__form--right-sign-up-line-other">
                Hoặc
              </span>
            </div>
            <div className="login-affiliate__form--right-sign-up-sign-up">
              <span className="login-affiliate__form--right-sign-up-sign-up-label">
                Đã nhớ rồi!
              </span>
              <span
                onClick={() => {
                  setIsSignUp(false);
                  setIsForgotPassword(false);
                }}
                className="login-affiliate__form--right-sign-up-sign-up-label high-light"
              >
                Đăng nhập liền
              </span>
            </div>
          </div>
        </div>
        {/* Modal OTP */}
        <Modal
          onCancel={() => setShowModalSignUp(false)}
          onOk={() =>
            handleCheckOTP({
              phone: valuePhone.length > 0 ? valuePhone : valuePhoneForgot,
              code_phone_area: valuePhoneArea,
              code: otp.join(""),
            })
          }
          open={showModalSignUp}
          footer={[]}
        >
          <div className="login-affiliate__card--information-otp">
            <div className="login-affiliate__card--information-otp-header">
              <span>Xác thức bằng mã OTP</span>
            </div>
            <span className="login-affiliate__card--information-otp-label">
              Nhập mã gồm 6 số đã gửi tới SMS thông qua số (+84){" "}
              <span className="bold">{valuePhone}</span>
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
              <>
                <span className="login-affiliate__card--information-otp-label">
                  Bạn chưa nhận được mã OTP. Gửi lại mã sau{" "}
                  <span className="high-light">{secondsLeft}s</span>
                </span>
                <ButtonCustom
                  label="Xác nhận mã"
                  onClick={() =>
                    handleCheckOTP({
                      phone:
                        valuePhone.length > 0 ? valuePhone : valuePhoneForgot,
                      code_phone_area: valuePhoneArea,
                      code: otp.join(""),
                    })
                  }
                  fullScreen={true}
                  borderRadiusFull={true}
                ></ButtonCustom>
              </>
            ) : (
              <>
                <span className="login-affiliate__card--information-otp-label">
                  Lưu ý số lần gửi mã có giới hạn.&nbsp;
                  <span
                    className="high-light click-able"
                    onClick={() =>
                      handleResendOTP({
                        phone:
                          valuePhone.trim() !== ""
                            ? valuePhone
                            : valuePhoneForgot,
                        code_phone_area: valuePhoneArea,
                      })
                    }
                  >
                    Gửi lại mã
                  </span>
                </span>

                {/* <ButtonCustom
                  label="Gửi lại mã"
                  onClick={() =>
                    handleResendOTP({
                      phone: valuePhone.trim() !== "" ?valuePhone : valuePhoneForgot,
                      code_phone_area: valuePhoneArea,
                    })
                  }
                  fullScreen={true}
                  borderRadiusFull={true}
                ></ButtonCustom> */}
                <ButtonCustom
                  label="Xác nhận mã"
                  onClick={() =>
                    handleCheckOTP({
                      phone:
                        valuePhone.length > 0 ? valuePhone : valuePhoneForgot,
                      code_phone_area: valuePhoneArea,
                      code: otp.join(""),
                    })
                  }
                  fullScreen={true}
                  borderRadiusFull={true}
                ></ButtonCustom>
              </>
            )}
          </div>
        </Modal>
        {/* Modal nhập thông tin cá nhân */}
        <Modal
          onCancel={() => {
            setIsModalPasswordType(false);
          }}
          // open={isModalPasswordType}
          open={true}
          footer={[]}
          width={750}
        >
          <div className="login-affiliate__card--information">
            <div className="login-affiliate__card--information-header">
              <div
                className={`login-affiliate__card--information-header-child ${
                  valueStepSignUp === 1 && "activated"
                }`}
              >
                <div
                  onClick={() => setValueStepSignUp(1)}
                  className="login-affiliate__card--information-header-child-step-number"
                >
                  <span>1</span>
                </div>
                <div className="login-affiliate__card--information-header-child-step-title">
                  <span className="login-affiliate__card--information-header-child-step-title-vietnam">
                    Thông tin tài khoản
                  </span>
                  <span className="login-affiliate__card--information-header-child-step-title-english">
                    Account information
                  </span>
                </div>
                <div className="login-affiliate__card--information-header-child-step-line"></div>
              </div>
              <div
                className={`login-affiliate__card--information-header-child ${
                  valueStepSignUp === 2 && "activated"
                }`}
              >
                <div
                  onClick={() => setValueStepSignUp(2)}
                  className="login-affiliate__card--information-header-child-step-number"
                >
                  <span>2</span>
                </div>
                <div className="login-affiliate__card--information-header-child-step-title">
                  <span className="login-affiliate__card--information-header-child-step-title-vietnam">
                    Địa chỉ liên hệ
                  </span>
                  <span className="login-affiliate__card--information-header-child-step-title-english">
                    Address
                  </span>
                </div>
                <div className="login-affiliate__card--information-header-child-step-line"></div>
              </div>
              <div
                className={`login-affiliate__card--information-header-child ${
                  valueStepSignUp === 3 && "activated"
                }`}
              >
                <div
                  onClick={() => setValueStepSignUp(3)}
                  className="login-affiliate__card--information-header-child-step-number"
                >
                  <span>3</span>
                </div>
                <div className="login-affiliate__card--information-header-child-step-title">
                  <span className="login-affiliate__card--information-header-child-step-title-vietnam">
                    Xác nhận mật khẩu
                  </span>
                  <span className="login-affiliate__card--information-header-child-step-title-english">
                    Verify password
                  </span>
                </div>
              </div>
            </div>
            <div className="login-affiliate__card--information-body">
              <div className="login-affiliate__card--information-body-child">
                <div className="login-affiliate__card--information-body-child-input">
                  <InputTextCustom
                    type="text"
                    value={valuePassword}
                    placeHolder=""
                    onChange={(e) => setValuePassword(e.target.value)}
                    isPassword={true}
                  />
                </div>
                <div className="login-affiliate__card--information-body-child-input">
                  <InputTextCustom
                    type="text"
                    value={valuePassword}
                    placeHolder=""
                    onChange={(e) => setValuePassword(e.target.value)}
                    isPassword={true}
                  />
                </div>
              </div>
            </div>
            {/* <InputTextCustom
              type="text"
              value={valuePassword}
              placeHolder="Mật khẩu"
              onChange={(e) => setValuePassword(e.target.value)}
              isPassword={true}
            />
            <InputTextCustom
              type="text"
              value={valueConfirmPassword}
              placeHolder="Xác nhận lại mật khẩu"
              onChange={(e) => setValueConfirmPassword(e.target.value)}
              isPassword={true}
            /> */}
            {/* Thanh kiểm tra dựa trên mật khẩu điền vào */}
            <div className={`login-affiliate__card--information-process-bar`}>
              <div
                className={`login-affiliate__card--information-process-bar-child ${
                  checkPasswordRequired(valuePassword).level === 0
                    ? "empty"
                    : checkPasswordRequired(valuePassword).level === 1
                    ? "week"
                    : checkPasswordRequired(valuePassword).level === 2
                    ? "fear"
                    : checkPasswordRequired(valuePassword).level === 3
                    ? "good"
                    : checkPasswordRequired(valuePassword).level === 4
                    ? "strong"
                    : ""
                }`}
              ></div>
            </div>
            {/* Các yêu cầu khi tạo mật khẩu */}
            <div className="login-affiliate__card--information-condition-required">
              {/* Ít nhất 8 ký tự */}
              <div
                className={`login-affiliate__card--information-condition-required-child ${
                  checkPasswordRequired(valuePassword).isPassLength && "checked"
                }`}
              >
                <span>
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Ít nhất 8 ký tự</span>
              </div>
              <div
                className={`login-affiliate__card--information-condition-required-child ${
                  checkPasswordRequired(valuePassword).isHaveLetter && "checked"
                }`}
              >
                <span>
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Ít nhất 1 chữ cái</span>
              </div>
              <div
                className={`login-affiliate__card--information-condition-required-child ${
                  checkPasswordRequired(valuePassword).isHaveNumber && "checked"
                }`}
              >
                <span>
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Ít nhất 1 chữ số</span>
              </div>
            </div>
            <ButtonCustom
              label="Hoàn tất tạo tài khoản"
              fullScreen={true}
              borderRadiusFull={true}
              onClick={() =>
                handleRegisterAccount({
                  token: saveToken,
                  name: "",
                  full_name: valueFullName,
                  email: valueEmail,
                  // Thiếu ngày sinh, giới tính, mã số thuế, địa chỉ ở hiện tại
                  phone: valuePhone,
                  password: valuePassword,
                  code_phone_area: valuePhoneArea,
                  code: otp.join(""),
                  // code_inviter: valueInvitedCode,
                })
              }
            ></ButtonCustom>
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
          onCancel={() => {
            setShowModalUpdatePassword(false);
          }}
          footer={[]}
          open={showModalUpdatePassword}
        >
          <div className="login-affiliate__card--information">
            <div className="login-affiliate__card--information-header">
              <span>Hãy ghi nhớ mật khẩu của mình nhé</span>
            </div>
            <InputTextCustom
              type="text"
              value={valuePassword}
              placeHolder="Mật khẩu"
              onChange={(e) => setValuePassword(e.target.value)}
              isPassword={true}
            />
            <InputTextCustom
              type="text"
              value={valueConfirmPassword}
              placeHolder="Xác nhận lại mật khẩu"
              onChange={(e) => setValueConfirmPassword(e.target.value)}
              isPassword={true}
            />
            {/* Thanh kiểm tra dựa trên mật khẩu điền vào */}
            <div
              className={`login-affiliate__card--information-password-process-bar`}
            >
              <div
                className={`login-affiliate__card--information-password-process-bar-child ${
                  checkPasswordRequired(valuePassword).level === 0
                    ? "empty"
                    : checkPasswordRequired(valuePassword).level === 1
                    ? "week"
                    : checkPasswordRequired(valuePassword).level === 2
                    ? "fear"
                    : checkPasswordRequired(valuePassword).level === 3
                    ? "good"
                    : checkPasswordRequired(valuePassword).level === 4
                    ? "strong"
                    : ""
                }`}
              ></div>
            </div>
            {/* Các yêu cầu khi tạo mật khẩu */}
            <div className="login-affiliate__card--information-condition-required">
              {/* Ít nhất 8 ký tự */}
              <div
                className={`login-affiliate__card--information-condition-required-child ${
                  checkPasswordRequired(valuePassword).isPassLength && "checked"
                }`}
              >
                <span>
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Ít nhất 8 ký tự</span>
              </div>
              <div
                className={`login-affiliate__card--information-condition-required-child ${
                  checkPasswordRequired(valuePassword).isHaveLetter && "checked"
                }`}
              >
                <span>
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Ít nhất 1 chữ cái</span>
              </div>
              <div
                className={`login-affiliate__card--information-condition-required-child ${
                  checkPasswordRequired(valuePassword).isHaveNumber && "checked"
                }`}
              >
                <span>
                  <IoCheckmarkCircleOutline />
                </span>
                <span>Ít nhất 1 chữ số</span>
              </div>
            </div>
            <ButtonCustom
              label="Cập nhật mật khẩu"
              fullScreen={true}
              borderRadiusFull={true}
              onClick={() =>
                handleUpdatePassword({
                  token: saveToken,
                  password: valuePassword,
                })
              }
            ></ButtonCustom>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default LoginAffiliate;
