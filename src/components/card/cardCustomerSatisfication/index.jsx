import React from "react";
import "./index.scss";

import icons from "../../../utils/icons";

const { FaRegFrown, FaRegMeh, FaRegSmile } = icons;

const CardCustomerSatisfication = (props) => {
  const { data } = props;
  // const percentFinal = Math.max(
  //   data?.percentHappyCus,
  //   data?.percentNeutralCus,
  //   data?.percentUnhappyCus
  // );
  const statusCustomerSatisfication =
    data?.percentHappyCus < 40
      ? "Kém"
      : data?.percentHappyCus < 60
      ? "Tạm ổn"
      : data?.percentHappyCus < 80
      ? "Tốt"
      : "Tuyệt vời";

  return (
    <div className="card-customer-satisfication card-shadow">
      {/* Các mức thống kê đánh giá */}
      <div className="card-customer-satisfication__icons">
        <div className="card-customer-satisfication__icons--icon-container">
          <div className="card-customer-satisfication__icons--icon">
            <FaRegSmile color="green" size={28} />
          </div>
          <span className="card-customer-satisfication__icons--percent">
            {data?.percentHappyCus}%
          </span>
        </div>
        <div className="card-customer-satisfication__icons--icon-container">
          <div className="card-customer-satisfication__icons--icon">
            <FaRegMeh color="orange" size={28} />
          </div>
          <span className="card-customer-satisfication__icons--percent">
            {data?.percentNeutralCus}%
          </span>
        </div>
        <div className="card-customer-satisfication__icons--icon-container">
          <div className="card-customer-satisfication__icons--icon">
            <FaRegFrown color="red" size={28} />
          </div>
          <span className="card-customer-satisfication__icons--percent">
            {data?.percentUnhappyCus}%
          </span>
        </div>
      </div>
      {/* Chỉ số cuối cùng */}
      <div className="card-customer-satisfication__rating">
        <span
          className={`card-customer-satisfication__rating--review ${
            data?.percentHappyCus < 40
              ? "bad"
              : data?.percentHappyCus < 60
              ? "normal"
              : data?.percentHappyCus < 80
              ? "good"
              : "greet"
          }`}
        >
          {statusCustomerSatisfication}
        </span>
        <span className="card-customer-satisfication__rating--sub">
          Sự hài lòng của khách hàng về dịch vụ của GUVI
        </span>
      </div>
    </div>
  );
};

export default CardCustomerSatisfication;
