import React, { useCallback, useEffect, useRef, useState } from "react";
import "./index.scss";
import InputTextCustom from "../../../components/inputCustom";
import ButtonCustom from "../../../components/button";
import { loginAffiliateApi } from "../../../api/affeliate";
import { useDispatch } from "react-redux";
import logo from "../../../assets/images/Logo.svg";
import icons from "../../../utils/icons";
import { message, Modal } from "antd";
import { errorNotify } from "../../../helper/toast";
import { loadingAction } from "../../../redux/actions/loading";
import { loginAffiliateAction } from "../../../redux/actions/auth";
import { useNavigate } from "react-router-dom";

const LoginAffiliate = () => {
  const { IoColorWandOutline, IoCashOutline } = icons;
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const navigate = useNavigate();
  const [valuePhoneNumber, setValuePhoneNumber] = useState("");
  const [valuePassWord, setValuePassWord] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [showModalSignUp, setShowModalSignUp] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(30);
  const [isRunning, setIsRunning] = useState(false);
  const [limitOTP, setLimitOTP] = useState(10);

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
  // const handleLoginAffiliate = async (phone, password) => {
  //   try {
  //     const res = await loginAffiliateApi({ phone, password, code_phone_area: "+84" });
  //   } catch (err) {
  //     errorNotify({
  //       message: err.message,
  //     });
  //     console.log("Lỗi đăng nhập affeliate: ", err);
  //   }
  // };
  const handleLoginAffiliate = useCallback(
    (e) => {
      dispatch(loadingAction.loadingRequest(true));
      e.preventDefault();
      dispatch(
        loginAffiliateAction.loginRequest({
          data: {
            phone: valuePhoneNumber,
            password: valuePassWord,
            code_phone_area: "+84",
          },
          naviga: navigate,
        })
      );
    },
    [dispatch, navigate, valuePhoneNumber, valuePassWord]
  );
  const handleCancel = () => {
    setShowModalSignUp(false);
  };
  const handleSignUp = () => {
    setIsRunning(true);
    setShowModalSignUp(true);
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
                type="text"
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
                // onClick={handleLoginAffiliate}
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
                onClick={() => handleSignUp()}
              />
            </>
          )}
          <Modal
            title="Xác thực mã OTP"
            onCancel={handleCancel}
            open={showModalSignUp}
            b
            // footer={[
            //   <button
            //     style={{ alignItems: "center", width: "auto" }}
            //     // onClick={handleCancel}
            //   >
            //     Huỷ
            //   </button>,
            //   <button
            //     type="primary"
            //     style={{ alignItems: "center", width: "auto" }}
            //     // onClick={handleOk}
            //   >
            //     Cập nhật
            //   </button>,
            // ]}
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
        </div>
      </div>
    </div>
  );
};

export default LoginAffiliate;
