import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import InputTextCustom from "../../../components/inputCustom";
import ButtonCustom from "../../../components/button";
import {
  registerPhoneAffiliateApi,
  registerAffiliateApi
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
} from "../../../redux/actions/auth";
import { useNavigate } from "react-router-dom";

const LoginAffiliate = () => {
  const { IoColorWandOutline, IoCashOutline } = icons;
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const navigate = useNavigate();
  const [valuePhoneNumber, setValuePhoneNumber] = useState("");
  const [valuePassWordSave, setValuePassWordSave] = useState("");
  const [valueName, setValueName] = useState("")
  const [valuePassWord, setValuePassWord] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showModalSignUp, setShowModalSignUp] = useState(false);
  // const [showModalRegisterInformation, set]
  const [secondsLeft, setSecondsLeft] = useState(60);
  const [isRunning, setIsRunning] = useState(false);
  const [limitOTP, setLimitOTP] = useState(10);
  const [isPassOtp, setIsPassOtp] = useState(false);
  /* ~~~ Use effect ~~~ */
  useEffect(() => {
    if (isRunning && secondsLeft > 0 ** limitOTP > 0) {
      const timer = setInterval(() => {
        setSecondsLeft((prev) => prev - 1);
      }, 1000);

      return () => clearInterval(timer); // Xóa interval khi component unmount
    } else if (secondsLeft === 0) {
      setIsRunning(false); // Dừng bộ đếm khi hết giờ
      setLimitOTP(limitOTP - 1);
      console.log("Hết giờ");
      // onComplete && onComplete(); // Gọi callback khi hết giờ
    }
  }, [isRunning, secondsLeft]);

  /* ~~~ Handle function ~~~ */
  // 1. Hàm đăng nhập
  const handleLoginAffiliate = useCallback(
    (e) => {
      dispatch(loadingAction.loadingRequest(true));
      dispatch(
        loginAffiliateAction.loginAffiliateRequest({
          data: {
            phone: valuePhoneNumber,
            password: valuePassWord,
            code_phone_area: "+84",
          },
          naviga: navigate,
        })
      );
      dispatch(loadingAction.loadingRequest(false));
    },
    [dispatch, navigate, valuePhoneNumber, valuePassWord]
  );
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
      dispatch(
        loginAffiliateWithOTPAction.loginAffiliateWithOTPRequest({
          data: payload,
          naviga: navigate,
        })
      );
      setIsPassOtp(true);
      dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      errorNotify({
        message: err.message,
      });
    }
  };
  // 4. Hàm tạo tài khoản mới với những thông tin đã nhập
  const handleRegisterAccount = async (payload) => {
    try {
      const res = await registerAffiliateApi(payload);

    }
    catch (err) {
      errorNotify({
        message: message.err,
      });
    }

  }

  const handleCancel = () => {
    setShowModalSignUp(false);
  };

  const handleResendOTP = () => {
    setSecondsLeft(30);
    setIsRunning(true);
  };
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
                valueUnit="(+84)"
                value={valuePhoneNumber}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhoneNumber(e.target.value)}
                required={true}
              />
              <InputTextCustom
                type="text"
                value={valuePassWord}
                placeHolder="Mật khẩu"
                onChange={(e) => setValuePassWord(e.target.value)}
                required={true}
                isPassword={true}
              />
              <ButtonCustom
                fullScreen={true}
                label="Đăng nhập"
                onClick={handleLoginAffiliate}
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
                onClick={() => setIsSignUp(true)}
              />
            </>
          ) : (
            <>
              <InputTextCustom
                type="text"
                value={valuePhoneNumber}
                placeHolder="Số điện thoại"
                onChange={(e) => setValuePhoneNumber(e.target.value)}
                required={true}
              />
              <ButtonCustom
                fullScreen={true}
                label="Đăng ký"
                onClick={() =>
                  handleSendOTP({
                    phone: valuePhoneNumber,
                    code_phone_area: "+84",
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
                onClick={() => setIsSignUp(false)}
              />
            </>
          )}
          {/* Modal OTP */}
          <Modal
            title="Xác thực mã OTP"
            onCancel={handleCancel}
            onOk={() =>
              handleCheckOTP({
                phone: valuePhoneNumber,
                code_phone_area: "+84",
                code: otp.join(""),
              })
            }
            open={showModalSignUp}
          >
            <div className="login-affiliate__card--information-otp">
              <span className="login-affiliate__card--information-otp-label">
                Nhập mã gồm 6 số đã gửi tới SMS thông qua số (+84) 123456789
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
                  onClick={() => handleResendOTP()}
                >
                  Gửi lại mã
                </span>
              )}
            </div>
          </Modal>
          {/* Modal nhập thông tin cá nhân */}
          <Modal
            title="Nhập thông tin cá nhân"
            // onCancel={() => {set}}
            onOk={() =>
              handleCheckOTP({
                phone: valuePhoneNumber,
                code_phone_area: "+84",
                code: otp.join(""),
              })
            }
            okText={"Xác nhận"}
            cancelText={"Hủy"}
            open={true}
          >
            <div className="login-affiliate__card--information-person">
              <InputTextCustom
                type="text"
                value={valueName}
                placeHolder="Họ và tên"
                onChange={(e) => setValueName(e.target.value)}
                required={true}
              />
              <InputTextCustom
                type="text"
                value={valuePassWordSave}
                placeHolder="Mật khẩu"
                onChange={(e) => setValuePassWordSave(e.target.value)}
                required={true}
                isPassword={true}
              />
              <InputTextCustom
                type="text"
                value={valueName}
                placeHolder="Mã giới thiệu"
                onChange={(e) => setValueName(e.target.value)}
                describe="Nhập mã của người giới thiệu"
              />
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default LoginAffiliate;
