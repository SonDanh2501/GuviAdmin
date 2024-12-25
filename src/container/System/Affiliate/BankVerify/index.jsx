import React, { useState } from "react";
import "./index.scss";
import icons from "../../../../utils/icons";
const { IoCheckmark, MdDoubleArrow } = icons;

const BankVerify = () => {
  const [isEngLish, setIsEnglish] = useState(false);
  return (
    <div className="bank-verify">
      <div className="bank-verify__modal">
        {/* Icon */}
        <div className="bank-verify__modal--success-icon">
          <div className="bank-verify__modal--success-icon-inside">
            <IoCheckmark size={24} color="white" />
          </div>
        </div>
        {/* Label */}
        <span className="bank-verify__modal--label">
          {isEngLish ? "Successful transaction" : "Giao dịch thành công"}
        </span>
        <div className="bank-verify__modal--back">
          <div className="bank-verify__modal--back-icon">
            <MdDoubleArrow style={{ transform: "rotate(180deg)" }} />
          </div>
          <span className="bank-verify__modal--back-label">
            Quay lại ứng dụng
          </span>
        </div>

        {/* <div className="bank-verify__modal--info">
          <div className="bank-verify__modal--info-child">
            <div className="bank-verify__modal--info-child-header">
              <span>Tên chủ thẻ:</span>
            </div>
            <div className="bank-verify__modal--info-child-content">
              <span>Danh Trường Sơn</span>
            </div>
          </div>
        </div>
        <div className="bank-verify__modal--info">
          <div className="bank-verify__modal--info-child">
            <div className="bank-verify__modal--info-child-header">
              <span>Số tài khoản:</span>
            </div>
            <div className="bank-verify__modal--info-child-content">
              <span>*** *** 7790</span>
            </div>
          </div>
        </div>
        <div className="bank-verify__modal--info">
          <div className="bank-verify__modal--info-child">
            <div className="bank-verify__modal--info-child-header">
              <span>Tên ngân hàng:</span>
            </div>
            <div className="bank-verify__modal--info-child-content">
              <span>Viettin Bank</span>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default BankVerify;
