import React, { useState } from "react";
import "./index.scss";
import InputTextCustom from "../../../components/inputCustom";
import ButtonCustom from "../../../components/button";
import { checkActiveAffeliate } from "../../../api/affeliate";
import { useDispatch } from "react-redux";
import { loadingAction } from "../../../redux/actions/loading";
import logo from "../../../assets/images/Logo.svg"
import icons from "../../../utils/icons";

const LoginAffiliate = () => {
  const { IoColorWandOutline, IoCashOutline } = icons;
  const dispatch = useDispatch();
  /* ~~~ Value ~~~ */
  const [valuePhoneNumber, setValuePhoneNumber] = useState("");
  const [valuePassWord, setValuePassWord] = useState("");
  /* ~~~ Handle function ~~~ */
  const checkingActiveAffeliate = async (phone, password) => {
    try {
      //   dispatch(loadingAction.loadingRequest(true));
      const res = await checkActiveAffeliate(phone, password);
      console.log("check res >>>", res);
      //   dispatch(loadingAction.loadingRequest(false));
    } catch (err) {
      console.log("Lỗi đăng nhập affeliate: ", err);
    }
  };
  return (
    <div className="login-affiliate">
      <div className="login-affiliate__card card-shadow">
        <div className="login-affiliate__card--information">
          {/* Label đăng nhập */}
          <span className="login-affiliate__card--information-label">
            Đăng nhập
          </span>
          {/* Icon fomo */}
          {/* <div className="login-affiliate__card--information-slogan">
            <div className="login-affiliate__card--information-slogan-icon">
              <div className="login-affiliate__card--information-slogan-icon-color">
                <IoColorWandOutline size="16px" />
              </div>
              <span className="login-affiliate__card--information-slogan-icon-label">
                Với GUVI
              </span>
              <span className="login-affiliate__card--information-slogan-icon-sub-label">
                Việc nhà là chuyện nhỏ
              </span>
            </div>
            <div className="login-affiliate__card--information-slogan-icon">
              <div className="login-affiliate__card--information-slogan-icon-color">
                <IoCashOutline size="16px" />
              </div>
              <span className="login-affiliate__card--information-slogan-icon-label">
                Giới thiệu ngay
              </span>
              <span className="login-affiliate__card--information-slogan-icon-sub-label">
                Nhận tiền liền tay
              </span>
            </div>
          </div> */}
          <div className="login-affiliate__card--information-logo">
            <img
              className="login-affiliate__card--information-logo-image"
              src={logo}
            ></img>
          </div>
          {/* Input số điện thoại */}
          <InputTextCustom
            type="text"
            value={valuePhoneNumber}
            placeHolder="Số điện thoại"
            onChange={(e) => setValuePhoneNumber(e.target.value)}
            required={true}
          />
          {/* Số mật khẩu */}
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
            onClick={() =>
              checkingActiveAffeliate(valuePhoneNumber, valuePassWord)
            }
          />
        </div>
      </div>
    </div>
  );
};

export default LoginAffiliate;
